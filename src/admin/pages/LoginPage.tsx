import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { inputClass } from "../components/AdminUi";

export default function LoginPage({ login }: { login: (password: string) => Promise<unknown> }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(password);
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "";
      setError(message || "كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-medical-teal p-3 text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-950">Ghazal Admin</h1>
            <p className="text-sm text-slate-500">Admin-only login</p>
          </div>
        </div>
        {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p>}
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase text-slate-500">كلمة المرور (Password)</span>
            <input className={inputClass} type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" />
          </label>
          <button disabled={loading} className="w-full rounded-md bg-medical-teal px-4 py-3 font-black text-white disabled:opacity-60">
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </div>
      </form>
    </div>
  );
}
