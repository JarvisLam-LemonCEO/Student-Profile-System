import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isReady } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "teacher",
    password: "123456",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(form.username, form.password);

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Student Profile System
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Login with the default account below.
        </p>

        <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            <strong>Username:</strong> teacher
          </p>
          <p>
            <strong>Password:</strong> 123456
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, username: e.target.value }))
            }
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            disabled={!isReady || isSubmitting}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            disabled={!isReady || isSubmitting}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!isReady || isSubmitting}
            className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {!isReady
              ? "Loading..."
              : isSubmitting
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}