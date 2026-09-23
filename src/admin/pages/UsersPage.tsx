import { Edit } from "lucide-react";
import { FormEvent, useState } from "react";
import { Field, inputClass, Modal, Pagination, usePagination, useToast } from "../components/AdminUi";
import { updateDocument } from "../services/firestoreService";
import { AdminRole, AdminUser } from "../types/admin";

const roles: AdminRole[] = ["Owner", "Manager", "Employee"];

export default function UsersPage({ users }: { users: AdminUser[] }) {
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const pagination = usePagination(users);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4">
        <h2 className="text-lg font-black text-slate-900">Users & Roles</h2>
        <p className="mt-1 text-sm text-slate-500">Create Firebase Auth users in Firebase Console, then add their UID here under users collection.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.currentRows.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-black text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-700">{user.role}</span></td>
                <td className="px-4 py-3">{user.active ? "Active" : "Disabled"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(user)} className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                    <Edit className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination {...pagination} />
      {editing && <UserForm user={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function UserForm({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState(user);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await updateDocument("users", user.id, {
      name: form.name,
      email: form.email,
      role: form.role,
      active: form.active,
    });
    toast("User role updated");
    onClose();
  };

  return (
    <Modal title="Edit User Role" onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Email"><input className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Role">
          <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </Field>
        <label className="mt-7 flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active admin</label>
        <div className="flex justify-end gap-3 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 font-bold text-slate-600">Cancel</button>
          <button className="rounded-md bg-medical-teal px-4 py-2 font-black text-white">Save User</button>
        </div>
      </form>
    </Modal>
  );
}
