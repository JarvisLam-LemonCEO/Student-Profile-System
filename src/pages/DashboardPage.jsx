import { useState } from "react";
import Navbar from "../components/Navbar";
import ClassCard from "../components/ClassCard";
import ClassFormModal from "../components/ClassFormModal";
import { useSchool } from "../context/SchoolContext";

export default function DashboardPage() {
  const { classes, addClass, updateClass, deleteClass } = useSchool();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  function handleAdd() {
    setEditingClass(null);
    setIsModalOpen(true);
  }

  function handleEdit(item) {
    setEditingClass(item);
    setIsModalOpen(true);
  }

  function handleSave(form) {
    if (editingClass) {
      updateClass(editingClass.id, form);
    } else {
      addClass(form);
    }
  }

  function handleDelete(classId) {
    const confirmed = window.confirm("Delete this class?");
    if (confirmed) deleteClass(classId);
  }

  function exportData() {
    const data = {
      classes: JSON.parse(localStorage.getItem("student_profile_classes")) || [],
      users: JSON.parse(localStorage.getItem("student_profile_users")) || [],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "student_profile_backup.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "Importing will overwrite current data. Continue?"
    );
    if (!confirmed) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);

        if (data.classes) {
          localStorage.setItem(
            "student_profile_classes",
            JSON.stringify(data.classes)
          );
        }

        if (data.users) {
          localStorage.setItem(
            "student_profile_users",
            JSON.stringify(data.users)
          );
        }

        alert("Data imported successfully.");
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file.");
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">
              Create, edit, and manage your classes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportData}
              className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:opacity-90"
            >
              Export Data
            </button>

            <label className="cursor-pointer rounded-xl bg-orange-500 px-5 py-3 font-medium text-white hover:opacity-90">
              Import Data
              <input
                type="file"
                accept="application/json"
                onChange={importData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleAdd}
              className="rounded-xl bg-primary px-5 py-3 font-medium text-white hover:opacity-90"
            >
              Add Class
            </button>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No classes yet. Click <strong>Add Class</strong> to create one.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((item) => (
              <ClassCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <ClassFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingClass}
      />
    </div>
  );
}