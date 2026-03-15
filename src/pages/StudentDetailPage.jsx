import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, Trash2, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SkillRadarChart from "../components/SkillRadarChart";
import StudentFormModal from "../components/StudentFormModal";
import GradeFormModal from "../components/GradeFormModal";
import NoteFormModal from "../components/NoteFormModal";
import { useSchool } from "../context/SchoolContext";

export default function StudentDetailPage() {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    updateStudent,
    addGrade,
    updateGrade,
    deleteGrade,
    addNote,
    updateNote,
    deleteNote,
  } = useSchool();

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === classId),
    [classes, classId]
  );

  const student = useMemo(
    () => selectedClass?.students.find((item) => item.id === studentId),
    [selectedClass, studentId]
  );

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  if (!selectedClass || !student) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Student not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  function handleSaveStudent(form) {
    updateStudent(classId, studentId, form);
  }

  function handleDeleteImage() {
    updateStudent(classId, studentId, { image: "" });
  }

  function handleSaveGrade(form) {
    if (editingGrade) {
      updateGrade(classId, studentId, editingGrade.id, form);
    } else {
      addGrade(classId, studentId, form);
    }
  }

  function handleSaveNote(form) {
    if (editingNote) {
      updateNote(classId, studentId, editingNote.id, form);
    } else {
      addNote(classId, studentId, form);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <button
          onClick={() => navigate(`/class/${classId}`)}
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Class
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-5">
                {student.image ? (
                  <img
                    src={student.image}
                    alt={student.name}
                    className="h-28 w-28 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <UserRound size={40} />
                  </div>
                )}

                <div>
                  <h1 className="text-3xl font-bold text-slate-800">{student.name}</h1>
                  <p className="mt-1 text-slate-500">Student ID: {student.studentId}</p>
                  <p className="mt-2 text-sm text-slate-400">Class: {selectedClass.name}</p>

                  {student.image && (
                    <button
                      onClick={handleDeleteImage}
                      className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Delete Image
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => setStudentModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white"
              >
                <Pencil size={16} />
                Edit Student
              </button>
            </div>
          </div>

          <SkillRadarChart skills={student.skills} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800">Grades</h2>
              <button
                onClick={() => {
                  setEditingGrade(null);
                  setGradeModalOpen(true);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-white"
              >
                Add Grade
              </button>
            </div>

            {student.grades.length === 0 ? (
              <p className="text-slate-500">No grades yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm text-slate-500">
                      <th className="py-3 pr-4">Subject</th>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Type</th>
                      <th className="py-3 pr-4">Grade</th>
                      <th className="py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.grades.map((grade) => (
                      <tr key={grade.id} className="border-b text-sm text-slate-700">
                        <td className="py-3 pr-4">{grade.subject}</td>
                        <td className="py-3 pr-4">{grade.date}</td>
                        <td className="py-3 pr-4">{grade.type}</td>
                        <td className="py-3 pr-4 font-semibold">{grade.grade}</td>
                        <td className="py-3 pr-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingGrade(grade);
                                setGradeModalOpen(true);
                              }}
                              className="rounded-lg border px-3 py-2 text-slate-600"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => {
                                const confirmed = window.confirm("Delete this grade?");
                                if (confirmed) deleteGrade(classId, studentId, grade.id);
                              }}
                              className="rounded-lg border px-3 py-2 text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800">Notes</h2>
              <button
                onClick={() => {
                  setEditingNote(null);
                  setNoteModalOpen(true);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-white"
              >
                Add Note
              </button>
            </div>

            {student.notes.length === 0 ? (
              <p className="text-slate-500">No notes yet.</p>
            ) : (
              <div className="space-y-4">
                {student.notes.map((note) => (
                  <div key={note.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">{note.date}</p>
                        <p className="mt-2 text-slate-700">{note.content}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingNote(note);
                            setNoteModalOpen(true);
                          }}
                          className="rounded-lg border px-3 py-2 text-slate-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const confirmed = window.confirm("Delete this note?");
                            if (confirmed) deleteNote(classId, studentId, note.id);
                          }}
                          className="rounded-lg border px-3 py-2 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <StudentFormModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={student}
      />

      <GradeFormModal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        onSave={handleSaveGrade}
        initialData={editingGrade}
      />

      <NoteFormModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
        initialData={editingNote}
      />
    </div>
  );
}