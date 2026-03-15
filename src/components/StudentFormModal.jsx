import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  studentId: "",
  image: "",
  skills: {
    communication: 0,
    teamwork: 0,
    problemSolving: 0,
    leadership: 0,
    creativity: 0,
    discipline: 0,
  },
};

export default function StudentFormModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        studentId: initialData.studentId || "",
        image: initialData.image || "",
        skills: {
          communication: initialData.skills?.communication ?? 0,
          teamwork: initialData.skills?.teamwork ?? 0,
          problemSolving: initialData.skills?.problemSolving ?? 0,
          leadership: initialData.skills?.leadership ?? 0,
          creativity: initialData.skills?.creativity ?? 0,
          discipline: initialData.skills?.discipline ?? 0,
        },
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.studentId.trim()) return;
    onSave(form);
    onClose();
  }

  function updateSkill(key, value) {
    setForm((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [key]: value,
      },
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setForm((prev) => ({
      ...prev,
      image: "",
    }));
  }

  const skillFields = [
    "communication",
    "teamwork",
    "problemSolving",
    "leadership",
    "creativity",
    "discipline",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          {initialData ? "Edit Student" : "Add Student"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Student name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Student ID"
              value={form.studentId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, studentId: e.target.value }))
              }
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Student Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            {form.image && (
              <div className="mt-4">
                <img
                  src={form.image}
                  alt="Student preview"
                  className="h-32 w-32 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-700">Skill Scores</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {skillFields.map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm capitalize text-slate-600">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.skills[field]}
                    onChange={(e) => updateSkill(field, e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
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