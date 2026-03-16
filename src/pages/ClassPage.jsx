import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Navbar from "../components/Navbar";
import StudentCard from "../components/StudentCard";
import StudentFormModal from "../components/StudentFormModal";
import { useSchool } from "../context/SchoolContext";

function SortableStudentCard({
  classId,
  student,
  sequenceNumber,
  onEdit,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: student.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "scale-[1.02] opacity-90 shadow-2xl" : ""}
    >
      <StudentCard
        classId={classId}
        student={student}
        sequenceNumber={sequenceNumber}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

export default function ClassPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes, addStudent, updateStudent, deleteStudent, reorderStudents } =
    useSchool();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === classId),
    [classes, classId]
  );

  if (!selectedClass) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Class not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  function handleAddStudent() {
    setEditingStudent(null);
    setIsModalOpen(true);
  }

  function handleEditStudent(student) {
    setEditingStudent(student);
    setIsModalOpen(true);
  }

  function handleSaveStudent(form) {
    if (editingStudent) {
      updateStudent(classId, editingStudent.id, form);
    } else {
      addStudent(classId, form);
    }
  }

  function handleDeleteStudent(studentId) {
    const confirmed = window.confirm("Delete this student?");
    if (confirmed) {
      deleteStudent(classId, studentId);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = selectedClass.students.findIndex(
      (student) => student.id === active.id
    );
    const newIndex = selectedClass.students.findIndex(
      (student) => student.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(selectedClass.students, oldIndex, newIndex);
    reorderStudents(classId, reordered);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-800">
              {selectedClass.name}
            </h1>
            <p className="text-slate-500">
              {selectedClass.description || "Manage students in this class."}
            </p>
          </div>

          <button
            onClick={handleAddStudent}
            className="rounded-xl bg-primary px-5 py-3 font-medium text-white hover:opacity-90"
          >
            Add Student
          </button>
        </div>

        {selectedClass.students.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No students yet. Click <strong>Add Student</strong> to create one.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedClass.students.map((student) => student.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {selectedClass.students.map((student, index) => (
                  <SortableStudentCard
                    key={student.id}
                    classId={classId}
                    student={student}
                    sequenceNumber={index + 1}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={editingStudent}
      />
    </div>
  );
}