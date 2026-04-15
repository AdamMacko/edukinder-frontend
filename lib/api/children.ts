// lib/api/children.ts
import { apiFetch } from "./client";

export type Child = {
  id: number;
  firstName: string;
  lastName: string;
  groupName: string;
  className: string;
  classYear: string | null;
};

export type CreateChildInput = {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO formát
  groupId: number;
};

// Získanie všetkých detí (pre Admina/Učiteľa)
export async function fetchAllChildren(): Promise<Child[]> {
  const json = await apiFetch("/api/child");
  return json.data;
}

// Získanie len "mojich" detí (pre Rodiča)
export async function fetchMyChildren(): Promise<Partial<Child>[]> {
  const json = await apiFetch("/api/child/mine");
  return json.data;
}

// Pridanie nového dieťaťa
export async function createChild(data: CreateChildInput): Promise<any> {
  return await apiFetch("/api/child", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Úprava údajov dieťaťa
export async function updateChild(id: number, data: Partial<Child>): Promise<any> {
  return await apiFetch(`/api/child/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export type ClassGroup = {
  id: number;
  name: string;
  class: string;
  roomName: string;
  classTeacher?: { firstName: string; lastName: string };
};

export async function fetchClasses() {
  const json = await apiFetch("/api/group");
  return json.data;
}