"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/app/components/header/Header";
import { ClassTabs } from "../components/kids/ClassTabs";
import { CreateClassModal } from "../components/kids/CreateClassModal";
import { ClassInfoCard } from "../components/kids/ClassInfoCard";
import { StudentCard } from "../components/kids/StudentCard";
import { Loader2, Plus, X } from "lucide-react";

// API importy
import {
    fetchAllChildren,
    updateChild,
    fetchClasses,
    type Child,
    type ClassGroup,
} from "@/lib/api/children";

type PendingChild = {
    tempId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    groupId: string;
    groupLabel: string;
    groupName: string;
    parentEmail: string;
    isInternal: boolean;
};

type DisplayChild =
    | { type: "server"; data: Child }
    | { type: "pending"; data: PendingChild };

export default function KidsPage() {
    const [classes, setClasses] = useState<ClassGroup[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [teachers, setTeachers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [activeClass, setActiveClass] = useState<string>("Všetci");
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);

    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [pendingChildren, setPendingChildren] = useState<PendingChild[]>([]);

    const [childForm, setChildForm] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        groupId: "",
        parentEmail: "",
        isInternal: false,
    });

    const loadData = async () => {
        try {
            setLoading(true);

            const [kidsData, classesData] = await Promise.all([
                fetchAllChildren(),
                fetchClasses(),
            ]);

            setChildren(kidsData);
            setClasses(classesData);
        } catch (err) {
            console.error("Chyba pri načítaní dát zo servera:", err);
            alert("Nepodarilo sa načítať deti a triedy.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredServerChildren =
        activeClass === "Všetci"
            ? children
            : children.filter((c) => c.groupName === activeClass);

    const filteredPendingChildren =
        activeClass === "Všetci"
            ? pendingChildren
            : pendingChildren.filter((c) => c.groupName === activeClass);

    const mergedChildren: DisplayChild[] = useMemo(() => {
        return [
            ...filteredPendingChildren.map((child) => ({
                type: "pending" as const,
                data: child,
            })),
            ...filteredServerChildren.map((child) => ({
                type: "server" as const,
                data: child,
            })),
        ];
    }, [filteredPendingChildren, filteredServerChildren]);

    const activeGroup =
        activeClass === "Všetci"
            ? null
            : classes.find((cls) => cls.name === activeClass) ?? null;

    const openEditModal = (child: Child) => setEditingChild(child);
    const closeEditModal = () => setEditingChild(null);
    const closeAddChildModal = () => setIsAddChildModalOpen(false);

    const handleSaveChild = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingChild) return;

        const formData = new FormData(e.currentTarget);
        const updatedData = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            groupName: editingChild.groupName,
        };

        try {
            setIsSaving(true);
            await updateChild(editingChild.id, updatedData);
            await loadData();
            closeEditModal();
            alert("Dieťa bolo úspešne upravené.");
        } catch (err) {
            console.error(err);
            alert("Nepodarilo sa uložiť zmeny dieťaťa.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChildFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setChildForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleChildInternalChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { checked } = e.target;
        setChildForm((prev) => ({ ...prev, isInternal: checked }));
    };

    const handleAddChildToList = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !childForm.firstName ||
            !childForm.lastName ||
            !childForm.birthDate ||
            !childForm.groupId
        ) {
            alert("Vyplňte všetky povinné údaje.");
            return;
        }

        if (childForm.isInternal && !childForm.parentEmail.trim()) {
            alert(
                "Ak je rodič zamestnanec/študent organizácie, zadajte jeho e-mail."
            );
            return;
        }

        const selectedGroup = classes.find(
            (g) => String(g.id) === childForm.groupId
        );

        const groupName = selectedGroup?.name ?? "";
        const groupLabel = selectedGroup
            ? `${selectedGroup.name}${"class" in selectedGroup && selectedGroup.class ? ` (${selectedGroup.class})` : ""}`
            : "";

        const newItem: PendingChild = {
            tempId:
                typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : String(Date.now() + Math.random()),
            firstName: childForm.firstName.trim(),
            lastName: childForm.lastName.trim(),
            birthDate: childForm.birthDate,
            groupId: childForm.groupId,
            groupName,
            groupLabel,
            parentEmail: childForm.parentEmail.trim(),
            isInternal: childForm.isInternal,
        };

        setPendingChildren((prev) => [newItem, ...prev]);

        setChildForm({
            firstName: "",
            lastName: "",
            birthDate: "",
            groupId: "",
            parentEmail: "",
            isInternal: false,
        });

        setIsAddChildModalOpen(false);
        alert("Dieťa bolo pridané do zoznamu. Zatiaľ nie je uložené v systéme.");
    };

    const handleRemovePending = (tempId: string) => {
        setPendingChildren((prev) => prev.filter((c) => c.tempId !== tempId));
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48] pt-10 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-4xl font-black tracking-tight text-[#3E2E48]">
                            Prehľad tried a detí
                        </h1>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAddChildModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition hover:shadow-md active:scale-95"
                            >
                                <Plus className="h-4 w-4" />
                                Pridať dieťa
                            </button>

                            <button
                                onClick={() => setIsClassModalOpen(true)}
                                className="rounded-2xl bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 hover:shadow-lg active:scale-95"
                            >
                                Vytvoriť triedu
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-6 sm:p-8 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#d0a91a]" />
                                <p className="text-lg font-bold uppercase tracking-widest text-[#3E2E48]/40">
                                    Načítavam EduKinder...
                                </p>
                            </div>
                        ) : (
                            <>
                                <ClassTabs
                                    classes={classes}
                                    activeClass={activeClass}
                                    onSelect={setActiveClass}
                                />

                                <ClassInfoCard
                                    activeGroup={activeGroup}
                                    onEdit={() => alert("Tu neskôr pridáme editáciu triedy")}
                                />

                                {mergedChildren.length === 0 ? (
                                    <div className="py-20 text-center text-xl font-bold italic text-[#3E2E48]/40">
                                        V tejto triede zatiaľ nie sú žiadne deti.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {mergedChildren.map((item) => {
                                            if (item.type === "server") {
                                                return (
                                                    <StudentCard
                                                        key={item.data.id}
                                                        child={item.data}
                                                        onEdit={openEditModal}
                                                    />
                                                );
                                            }

                                            return (
                                                <div
                                                    key={item.data.tempId}
                                                    className="rounded-[28px] border border-dashed border-[#d0a91a]/40 bg-[#fffaf0] p-5 shadow-sm"
                                                >
                                                    <div className="mb-4 flex items-start justify-between gap-3">
                                                        <div>
                              <span className="inline-flex rounded-full bg-[#d0a91a]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#b38f15]">
                                Nové
                              </span>
                                                            <h3 className="mt-3 text-xl font-black text-[#3E2E48]">
                                                                {item.data.firstName} {item.data.lastName}
                                                            </h3>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemovePending(item.data.tempId)}
                                                            className="rounded-xl p-2 text-[#3E2E48]/50 transition hover:bg-[#3E2E48]/5 hover:text-[#3E2E48]"
                                                            aria-label="Odstrániť dieťa"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        <div className="rounded-2xl bg-white px-4 py-3">
                                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3E2E48]/40">
                                                                Trieda
                                                            </p>
                                                            <p className="mt-1 font-bold text-[#3E2E48]">
                                                                {item.data.groupLabel || "Bez triedy"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-2xl bg-white px-4 py-3">
                                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3E2E48]/40">
                                                                Dátum narodenia
                                                            </p>
                                                            <p className="mt-1 font-bold text-[#3E2E48]">
                                                                {item.data.birthDate || "—"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-2xl bg-white px-4 py-3">
                                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3E2E48]/40">
                                                                E-mail rodiča
                                                            </p>
                                                            <p className="mt-1 break-all font-bold text-[#3E2E48]">
                                                                {item.data.parentEmail || "—"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-2xl bg-white px-4 py-3">
                                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3E2E48]/40">
                                                                Interný rodič
                                                            </p>
                                                            <p className="mt-1 font-bold text-[#3E2E48]">
                                                                {item.data.isInternal ? "Áno" : "Nie"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {editingChild && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3E2E48]/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="border-b border-[#3E2E48]/10 bg-[#fcf7f3]/50 px-8 py-6">
                            <h2 className="text-2xl font-black text-[#3E2E48]">
                                Úprava údajov
                            </h2>
                        </div>

                        <form onSubmit={handleSaveChild} className="flex flex-col gap-5 p-8">
                            <div>
                                <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-[#3E2E48]/70">
                                    Meno
                                </label>
                                <input
                                    name="firstName"
                                    type="text"
                                    defaultValue={editingChild.firstName}
                                    required
                                    className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-[#3E2E48]/70">
                                    Priezvisko
                                </label>
                                <input
                                    name="lastName"
                                    type="text"
                                    defaultValue={editingChild.lastName}
                                    required
                                    className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                                />
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 rounded-xl bg-[#d0a91a] py-3.5 text-sm font-black text-white shadow-lg shadow-[#d0a91a]/20 transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                                    ) : (
                                        "Uložiť zmeny"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 rounded-xl bg-[#f8f5f2] py-3.5 text-sm font-bold text-[#3E2E48]/60 transition hover:bg-[#3E2E48]/5"
                                >
                                    Zrušiť
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAddChildModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#3E2E48]/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-[#3E2E48]/10 bg-[#fcf7f3]/50 px-8 py-6">
                            <div>
                                <h2 className="text-2xl font-black text-[#3E2E48]">
                                    Pridať dieťa
                                </h2>
                                <p className="mt-1 text-sm font-medium text-[#3E2E48]/50">
                                    Zatiaľ sa uloží len lokálne do zoznamu.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeAddChildModal}
                                className="rounded-xl p-2 text-[#3E2E48]/50 transition hover:bg-[#3E2E48]/5 hover:text-[#3E2E48]"
                                aria-label="Zavrieť"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddChildToList} className="p-8">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-[#3E2E48]/70">
                                        Meno dieťaťa
                                    </label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        value={childForm.firstName}
                                        onChange={handleChildFormChange}
                                        required
                                        className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-[#3E2E48]/70">
                                        Priezvisko dieťaťa
                                    </label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        value={childForm.lastName}
                                        onChange={handleChildFormChange}
                                        required
                                        className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-[#3E2E48]/70">
                                        Dátum narodenia
                                    </label>
                                    <input
                                        name="birthDate"
                                        type="date"
                                        value={childForm.birthDate}
                                        onChange={handleChildFormChange}
                                        required
                                        className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-[#3E2E48]/70">
                                        Trieda
                                    </label>
                                    <select
                                        name="groupId"
                                        value={childForm.groupId}
                                        onChange={handleChildFormChange}
                                        required
                                        className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                                    >
                                        <option value="">-- Vyber triedu --</option>
                                        {classes.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                                {"class" in g && g.class ? ` (${g.class})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-[#3E2E48]/70">
                                        E-mail rodiča
                                    </label>
                                    <input
                                        name="parentEmail"
                                        type="email"
                                        value={childForm.parentEmail}
                                        onChange={handleChildFormChange}
                                        placeholder="meno.priezvisko@example.com"
                                        className="w-full rounded-xl border-2 border-transparent bg-[#fcf7f3] px-4 py-3 text-sm font-bold text-[#3E2E48] outline-none transition focus:border-[#d0a91a] focus:bg-white"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="inline-flex items-center gap-3 rounded-2xl bg-[#fcf7f3] px-4 py-4 text-sm font-bold text-[#3E2E48]">
                                        <input
                                            name="isInternal"
                                            type="checkbox"
                                            checked={childForm.isInternal}
                                            onChange={handleChildInternalChange}
                                            className="h-4 w-4 rounded border-[#d0a91a] text-[#d0a91a] focus:ring-[#d0a91a]"
                                        />
                                        Rodič je zamestnanec / študent organizácie
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-[#d0a91a] py-3.5 text-sm font-black text-white shadow-lg shadow-[#d0a91a]/20 transition hover:opacity-90 active:scale-95"
                                >
                                    Pridať dieťa do zoznamu
                                </button>

                                <button
                                    type="button"
                                    onClick={closeAddChildModal}
                                    className="flex-1 rounded-xl bg-[#f8f5f2] py-3.5 text-sm font-bold text-[#3E2E48]/60 transition hover:bg-[#3E2E48]/5"
                                >
                                    Zrušiť
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <CreateClassModal
                isOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                availableTeachers={teachers}
                availableChildren={children}
            />
        </>
    );
}