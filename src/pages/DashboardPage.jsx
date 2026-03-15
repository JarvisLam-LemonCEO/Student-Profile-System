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

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Create, edit, and manage your classes.</p>
          </div>

          <button
            onClick={handleAdd}
            className="rounded-xl bg-primary px-5 py-3 font-medium text-white hover:opacity-90"
          >
            Add Class
          </button>
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
