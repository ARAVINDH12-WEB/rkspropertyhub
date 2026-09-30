import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Shield, UserMinus, Mail, Phone, Loader2, Edit2, UserPlus,
  X, Check, Lock, Search, Filter,
} from "lucide-react";
import { adminPatch, adminPost, adminPut, adminDelete } from "./api";
import { cn } from "../utils/cn";

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  AGENT: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  BUYER: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "BUYER" | "AGENT" | "ADMIN";
  createdAt: string;
}

interface UsersManagerProps {
  users: UserData[] | null;
  loading: boolean;
  currentUserId?: string;
  onRefresh: () => void;
}

export default function UsersManager({ users, loading, currentUserId, onRefresh }: UsersManagerProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Edit User modal state
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<"BUYER" | "AGENT" | "ADMIN">("BUYER");
  const [editPassword, setEditPassword] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Create User modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<"BUYER" | "AGENT" | "ADMIN">("BUYER");
  const [newPassword, setNewPassword] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [savingCreate, setSavingCreate] = useState(false);

  // Open edit modal
  const openEdit = (user: UserData) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || "");
    setEditRole(user.role);
    setEditPassword("");
    setEditError(null);
  };

  // Submit edit user
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const body: any = {
        name: editName,
        email: editEmail,
        phone: editPhone,
        role: editRole,
      };
      if (editPassword.trim()) {
        body.password = editPassword.trim();
      }
      const res = await adminPut(`/admin/users/${editingUser.id}`, body);
      if (!res.success) {
        throw new Error(res.message || "Failed to update user");
      }
      setEditingUser(null);
      onRefresh();
    } catch (err: any) {
      setEditError(err.message || "Failed to save user");
    } finally {
      setSavingEdit(false);
    }
  };

  // Submit create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCreate(true);
    setCreateError(null);
    try {
      const res = await adminPost("/admin/users", {
        name: newName,
        email: newEmail,
        phone: newPhone,
        role: newRole,
        password: newPassword,
      });
      if (!res.success) {
        throw new Error(res.message || "Failed to create user");
      }
      setIsCreating(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewPassword("");
      setNewRole("BUYER");
      onRefresh();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create user");
    } finally {
      setSavingCreate(false);
    }
  };

  const changeRole = async (id: string, role: string) => {
    setUpdating(id);
    try {
      await adminPatch(`/admin/users/${id}/role`, { role });
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const removeUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    setUpdating(id);
    try {
      await adminDelete(`/admin/users/${id}`);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  // Filtering
  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar: Search, Role filters & Add User button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search box */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
            />
          </div>

          {/* Role pills */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            {["ALL", "ADMIN", "AGENT", "BUYER"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition",
                  roleFilter === r
                    ? "bg-gold-400 text-ink-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase() + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Add User button */}
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 px-4 py-2 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 transition hover:shadow-lg hover:shadow-gold-500/30 shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold-400" />
          <p className="mt-2 text-sm text-slate-400">Loading users…</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center glass rounded-2xl">
          <Users className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No users match your filters</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden md:table-cell">Joined</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <tr key={user.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-300/20 to-gold-500/10 text-gold-300 font-bold text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-white flex items-center gap-1.5">
                            {user.name}
                            {isSelf && <span className="text-[10px] text-gold-400 font-bold bg-gold-400/10 border border-gold-400/20 px-1.5 rounded">(You)</span>}
                          </p>
                          <p className="text-xs text-slate-500 sm:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="space-y-1">
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Mail className="h-3 w-3 text-gold-400" /> {user.email}
                        </p>
                        {user.phone ? (
                          <p className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone className="h-3 w-3 text-gold-400" /> {user.phone}
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-600">No phone</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[user.role] || ROLE_BADGE.BUYER}`}>
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEdit(user)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gold-400/30 bg-gold-400/10 px-2.5 py-1.5 text-xs font-semibold text-gold-300 transition hover:bg-gold-400 hover:text-ink-950"
                          title="Edit User Details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Quick Role select */}
                        <select
                          value={user.role}
                          onChange={(e) => changeRole(user.id, e.target.value)}
                          disabled={isSelf || updating === user.id}
                          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white focus:outline-none disabled:opacity-40"
                          title="Quick Role Change"
                        >
                          <option value="BUYER">Buyer</option>
                          <option value="AGENT">Agent</option>
                          <option value="ADMIN">Admin</option>
                        </select>

                        {/* Delete Button */}
                        {!isSelf && (
                          <button
                            onClick={() => removeUser(user.id, user.name)}
                            disabled={updating === user.id}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-40"
                            title="Delete user"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── EDIT USER MODAL ─── */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass relative w-full max-w-lg rounded-3xl border border-white/15 bg-ink-900/95 p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setEditingUser(null)}
                className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-white">Edit User Information</h3>
                  <p className="text-xs text-slate-400">Update account credentials and permissions</p>
                </div>
              </div>

              {editError && (
                <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Role / Permissions
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                    >
                      <option value="BUYER" className="bg-ink-900">Buyer (Standard)</option>
                      <option value="AGENT" className="bg-ink-900">Agent (Manage listings)</option>
                      <option value="ADMIN" className="bg-ink-900">Admin (Full Control)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      New Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leave blank to keep unchanged"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg disabled:opacity-50"
                  >
                    {savingEdit ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CREATE USER MODAL ─── */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass relative w-full max-w-lg rounded-3xl border border-white/15 bg-ink-900/95 p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsCreating(false)}
                className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-white">Create New User</h3>
                  <p className="text-xs text-slate-400">Add a new admin, agent, or buyer account</p>
                </div>
              </div>

              {createError && (
                <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Initial Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Role / Permissions
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                    >
                      <option value="BUYER" className="bg-ink-900">Buyer</option>
                      <option value="AGENT" className="bg-ink-900">Agent</option>
                      <option value="ADMIN" className="bg-ink-900">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingCreate}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg disabled:opacity-50"
                  >
                    {savingCreate ? "Creating…" : "Create User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
