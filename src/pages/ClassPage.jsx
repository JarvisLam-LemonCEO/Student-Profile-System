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

function StudentSection({
  title,
  badgeClassName,
  students,
  classId,
  sensors,
  onDragEnd,
  onEdit,
  onDelete,
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <span className={badgeClassName}>{students.length} students</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
    <SortableContext
    items={students.map((student) => student.id)}
    strategy={rectSortingStrategy}
    >
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
    {students.map((student, index) => (
      <SortableStudentCard
      key={student.id}
      classId={classId}
      student={student}
      sequenceNumber={index + 1}
      onEdit={onEdit}
      onDelete={onDelete}
      />
    ))}
    </div>
    </SortableContext>
      </DndContext>
    </section>
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

  const maleStudents = useMemo(
    () =>
    selectedClass?.students.filter(
      (student) => (student.gender || "Male").toLowerCase() === "male"
    ) || [],
    [selectedClass]
  );
  
  const femaleStudents = useMemo(
    () =>
    selectedClass?.students.filter(
      (student) => (student.gender || "").toLowerCase() === "female"
    ) || [],
    [selectedClass]
  );

  const hasMaleStudents = maleStudents.length > 0;
  const hasFemaleStudents = femaleStudents.length > 0;
  const hasAnyStudents = hasMaleStudents || hasFemaleStudents;

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

  function rebuildStudents(males, females) {
    return [...males, ...females];
  }

  function handleMaleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = maleStudents.findIndex((student) => student.id === active.id);
    const newIndex = maleStudents.findIndex((student) => student.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedMales = arrayMove(maleStudents, oldIndex, newIndex);
    reorderStudents(classId, rebuildStudents(reorderedMales, femaleStudents));
  }

  function handleFemaleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = femaleStudents.findIndex((student) => student.id === active.id);
    const newIndex = femaleStudents.findIndex((student) => student.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedFemales = arrayMove(femaleStudents, oldIndex, newIndex);
    reorderStudents(classId, rebuildStudents(maleStudents, reorderedFemales));
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

        {!hasAnyStudents && (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No students yet. Click <strong>Add Student</strong> to create one.
          </div>
        )}

        {hasAnyStudents && (
          <div
            className={`grid gap-8 ${
              hasMaleStudents && hasFemaleStudents ? "lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {hasMaleStudents && (
              <StudentSection
                title="Male Students"
                badgeClassName="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                students={maleStudents}
                classId={classId}
                sensors={sensors}
                onDragEnd={handleMaleDragEnd}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            )}

            {hasFemaleStudents && (
              <StudentSection
                title="Female Students"
                badgeClassName="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700"
                students={femaleStudents}
                classId={classId}
                sensors={sensors}
                onDragEnd={handleFemaleDragEnd}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            )}
          </div>
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