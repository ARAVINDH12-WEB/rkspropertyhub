import { useState, useEffect, useCallback } from "react";

const API = "/api/v1";

function getToken() {
  return localStorage.getItem("rks_admin_token") || "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export function useAdminAuth() {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    if (data.data.user.role !== "ADMIN") throw new Error("Admin access required");
    localStorage.setItem("rks_admin_token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem("rks_admin_token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/auth/me`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUser(d.data.user);
        else logout();
      })
      .catch(() => logout());
  }, [token]);

  return { token, user, login, logout, isAuthed: !!token && !!user };
}

export function useAdminData<T>(endpoint: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch(`${API}${endpoint}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data ?? d);
        else setError(d.message);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [endpoint, ...deps]);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh };
}

export async function adminPost(endpoint: string, body: any) {
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function adminPatch(endpoint: string, body: any) {
  const res = await fetch(`${API}${endpoint}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function adminPut(endpoint: string, body: any) {
  const res = await fetch(`${API}${endpoint}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function adminDelete(endpoint: string) {
  const res = await fetch(`${API}${endpoint}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}
