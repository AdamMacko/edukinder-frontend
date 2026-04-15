// lib/api/client.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // ZMENA: Zmenili sme "omit" na "include"
    // Toto povie prehliadaču: "Pošli s touto požiadavkou aj prihlasovacie cookies"
    credentials: "include", 
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || "Chyba pri komunikácii so serverom.");
  }

  return json;
}