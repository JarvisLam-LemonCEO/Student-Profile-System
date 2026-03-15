import { useEffect, useState } from "react";

const initialForm = {
  subject: "",
  date: "",
  type: "Quiz",
  grade: "",
};

export default function GradeFormModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        subject: initialData.subject || "",
        date: initialData.date || "",
        type: initialData.type || "Quiz",
        grade: initialData.grade || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject || !form.date || form.grade === "") return;
    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          {initialData ? "Edit Grade" : "Add Grade"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>Quiz</option>
              <option>Test</option>
              <option>Exam</option>
            </select>

            <input
              type="number"
              placeholder="Grade"
              min="0"
              max="100"
              value={form.grade}
              onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

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
