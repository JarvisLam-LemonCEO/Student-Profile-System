import { useState } from "react";
import Navbar from "../components/Navbar";
import ClassCard from "../components/ClassCard";
import ClassFormModal from "../components/ClassFormModal";
import { useSchool } from "../context/SchoolContext";
import { db } from "../db/db";

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

  async function exportData() {
    try {
      const users = await db.users.toArray();
      const classes = await db.classes.toArray();
      const currentUserMeta = await db.meta.get("currentUser");

      const data = {
        users,
        classes,
        currentUser: currentUserMeta?.value || null,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      const now = new Date();
      const fileName = `student_profile_backup_${now
        .toISOString()
        .slice(0, 10)}.json`;

      a.href = url;
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data.");
    }
  }

  function normalizeStudent(student) {
    return {
      ...student,
      gender: student.gender || "",
      birthday: student.birthday || "",
      weight: student.weight || "",
      height: student.height || "",
      bloodType: student.bloodType || "",
      image: student.image || "",
      teacherAssignments: Array.isArray(student.teacherAssignments)
        ? student.teacherAssignments
        : [],
      skills: student.skills || {
        communication: 0,
        teamwork: 0,
        problemSolving: 0,
        leadership: 0,
        creativity: 0,
        discipline: 0,
      },
      grades: Array.isArray(student.grades) ? student.grades : [],
      notes: Array.isArray(student.notes) ? student.notes : [],
    };
  }

  function normalizeClass(cls) {
    return {
      ...cls,
      students: Array.isArray(cls.students)
        ? cls.students.map(normalizeStudent)
        : [],
    };
  }

  async function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "Importing will overwrite current database data. Continue?"
    );

    if (!confirmed) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {
      try {
        const importedData = JSON.parse(e.target.result);

        const users = Array.isArray(importedData.users)
          ? importedData.users
          : [];

        const classes = Array.isArray(importedData.classes)
          ? importedData.classes.map(normalizeClass)
          : [];

        const fallbackCurrentUser =
          importedData.currentUser || (users.length > 0 ? users[0] : null);

        await db.transaction("rw", db.users, db.classes, db.meta, async () => {
          await db.users.clear();
          await db.classes.clear();
          await db.meta.delete("currentUser");

          if (users.length > 0) {
            await db.users.bulkPut(users);
          }

          if (classes.length > 0) {
            await db.classes.bulkPut(classes);
          }

          if (fallbackCurrentUser) {
            await db.meta.put({
              key: "currentUser",
              value: fallbackCurrentUser,
            });
          }
        });

        alert("Data imported successfully.");
        window.location.reload();
      } catch (error) {
        console.error("Import failed:", error);
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