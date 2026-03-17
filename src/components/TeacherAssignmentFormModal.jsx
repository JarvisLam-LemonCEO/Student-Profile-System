import { useEffect, useState } from "react";

const initialForm = {
  level: "",
  teacherName: "",
};

export default function ClassTeacherFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        level: initialData.level || "",
        teacherName: initialData.teacherName || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.level.trim() || !form.teacherName.trim()) return;
    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          {initialData ? "Edit Class Teacher" : "Add Class Teacher"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Class Level"
            value={form.level}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, level: e.target.value }))
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Teacher Name"
            value={form.teacherName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, teacherName: e.target.value }))
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}