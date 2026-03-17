import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  studentId: "",
  image: "",
  gender: "",
  birthday: "",
  weight: "",
  height: "",
  bloodType: "",
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
        gender: initialData.gender || "Male",
        birthday: initialData.birthday || "",
        weight: initialData.weight || "",
        height: initialData.height || "",
        bloodType: initialData.bloodType || "",
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              >
              <option value="">Choose a gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Birthday
              </label>
              <input
                type="date"
                value={form.birthday}
                onChange={(e) => setForm((prev) => ({ ...prev, birthday: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Weight
              </label>
              <input
                type="text"
                placeholder="e.g. 55 kg"
                value={form.weight}
                onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Height
              </label>
              <input
                type="text"
                placeholder="e.g. 170 cm"
                value={form.height}
                onChange={(e) => setForm((prev) => ({ ...prev, height: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Blood Type
              </label>
              <select
                value={form.bloodType}
                onChange={(e) => setForm((prev) => ({ ...prev, bloodType: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
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