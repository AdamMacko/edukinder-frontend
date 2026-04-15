// lib/api/parents.ts

export type ChildShort = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Parent = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  active: boolean;
  createdAt: string;
  children: ChildShort[];
};

export async function fetchParents(): Promise<Parent[]> {
  const res = await fetch("/api/user/parents");
  const json = await res.json();
  
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Nepodarilo sa načítať zoznam rodičov.");
  }
  
  return json.data;
}

export async function deleteParent(id: number): Promise<void> {
  const res = await fetch(`/api/user/${id}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    throw new Error("Nepodarilo sa zmazať rodiča.");
  }
}