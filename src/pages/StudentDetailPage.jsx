import { useMemo, useState } from "react";
import { ArrowLeft, Download, Pencil, Trash2, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../components/Navbar";
import SkillRadarChart from "../components/SkillRadarChart";
import StudentFormModal from "../components/StudentFormModal";
import GradeFormModal from "../components/GradeFormModal";
import NoteFormModal from "../components/NoteFormModal";
import TeacherAssignmentFormModal from "../components/TeacherAssignmentFormModal";
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
    addTeacherAssignment,
    updateTeacherAssignment,
    deleteTeacherAssignment,
  } = useSchool();

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === classId),
    [classes, classId]
  );

  const student = useMemo(
    () => selectedClass?.students.find((item) => item.id === studentId),
    [selectedClass, studentId]
  );

  const grades = student?.grades || [];
  const notes = student?.notes || [];
  const teacherAssignments = student?.teacherAssignments || [];

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  const [editingGrade, setEditingGrade] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [isDownloading, setIsDownloading] = useState(false);

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
    setEditingGrade(null);
  }

  function handleSaveNote(form) {
    if (editingNote) {
      updateNote(classId, studentId, editingNote.id, form);
    } else {
      addNote(classId, studentId, form);
    }
    setEditingNote(null);
  }

  function handleSaveTeacher(form) {
    if (editingTeacher) {
      updateTeacherAssignment(classId, studentId, editingTeacher.id, form);
    } else {
      addTeacherAssignment(classId, studentId, form);
    }
    setEditingTeacher(null);
  }

  function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 6) {
    const lines = doc.splitTextToSize(text || "", maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  }

  async function handleDownloadPDF() {
    try {
      setIsDownloading(true);

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let y = 20;

      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text("Student Report", margin, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 65, 18);

      y = 38;

      if (student.image) {
        try {
          doc.addImage(student.image, "JPEG", margin, y, 30, 30);
        } catch {
          try {
            doc.addImage(student.image, "PNG", margin, y, 30, 30);
          } catch {
            // ignore invalid image format
          }
        }
      } else {
        doc.setDrawColor(180);
        doc.rect(margin, y, 30, 30);
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text("No Image", margin + 7, y + 16);
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(student.name || "Unknown Student", 52, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Student ID: ${student.studentId || "-"}`, 52, y + 14);
      doc.text(`Gender: ${student.gender || "-"}`, 52, y + 20);
      doc.text(`Birthday: ${student.birthday || "-"}`, 52, y + 26);
      doc.text(`Weight: ${student.weight || "-"}`, 52, y + 32);
      doc.text(`Height: ${student.height || "-"}`, 52, y + 38);
      doc.text(`Blood Type: ${student.bloodType || "-"}`, 52, y + 44);
      doc.text(`Class: ${selectedClass.name || "-"}`, 52, y + 50);

      y += 68;

      const drawSectionTitle = (title) => {
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y, pageWidth - margin * 2, 9, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text(title, margin + 3, y + 6);
        y += 14;
      };

      drawSectionTitle("Skill Summary");

      const skillRows = [
        ["Communication", String(student.skills?.communication ?? 0)],
        ["Teamwork", String(student.skills?.teamwork ?? 0)],
        ["Problem Solving", String(student.skills?.problemSolving ?? 0)],
        ["Leadership", String(student.skills?.leadership ?? 0)],
        ["Creativity", String(student.skills?.creativity ?? 0)],
        ["Discipline", String(student.skills?.discipline ?? 0)],
      ];

      autoTable(doc, {
        startY: y,
        head: [["Skill", "Score"]],
        body: skillRows,
        margin: { left: margin, right: margin },
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [37, 99, 235],
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      if (teacherAssignments.length > 0) {
        drawSectionTitle("Teacher Assignments");

        const teacherRows = teacherAssignments.map((teacher) => [
          teacher.level || "-",
          teacher.teacherName || "-",
        ]);

        autoTable(doc, {
          startY: y,
          head: [["Level", "Teacher Name"]],
          body: teacherRows,
          margin: { left: margin, right: margin },
          theme: "grid",
          styles: {
            font: "helvetica",
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [168, 85, 247],
          },
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      drawSectionTitle("Grades");

      const gradeRows =
        grades.length > 0
          ? grades.map((grade) => [
              grade.subject || "-",
              grade.date || "-",
              grade.type || "-",
              String(grade.grade ?? "-"),
            ])
          : [["No grades available", "", "", ""]];

      autoTable(doc, {
        startY: y,
        head: [["Subject", "Date", "Type", "Grade"]],
        body: gradeRows,
        margin: { left: margin, right: margin },
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 163, 74],
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      if (y > pageHeight - 50) {
        doc.addPage();
        y = 20;
      }

      drawSectionTitle("Notes");

      if (notes.length > 0) {
        notes.forEach((note, index) => {
          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(`Note ${index + 1}`, margin, y);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(90);
          doc.text(`Date: ${note.date || "-"}`, margin + 22, y);

          y += 6;

          doc.setDrawColor(220);
          doc.rect(margin, y, pageWidth - margin * 2, 16);

          y = addWrappedText(
            doc,
            note.content || "",
            margin + 3,
            y + 6,
            pageWidth - margin * 2 - 6,
            5
          );

          y += 8;
        });
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("No notes available.", margin, y);
        y += 8;
      }

      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i += 1) {
        doc.setPage(i);
        doc.setDrawColor(220);
        doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text("Student Profile Management System", margin, pageHeight - 4);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 4);
      }

      const safeName = (student.name || "student").replace(/\s+/g, "_");
      doc.save(`${safeName}_report.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => navigate(`/class/${classId}`)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Class
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Download size={16} />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>

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
                  <p className="mt-1 text-slate-500">Gender: {student.gender || "-"}</p>
                  <p className="mt-1 text-slate-500">Birthday: {student.birthday || "-"}</p>
                  <p className="mt-1 text-slate-500">Weight: {student.weight || "-"}</p>
                  <p className="mt-1 text-slate-500">Height: {student.height || "-"}</p>
                  <p className="mt-1 text-slate-500">Blood Type: {student.bloodType || "-"}</p>
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

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800">Teacher Assignments</h2>
            <button
              onClick={() => {
                setEditingTeacher(null);
                setTeacherModalOpen(true);
              }}
              className="rounded-lg bg-primary px-4 py-2 text-white"
            >
              Add Teacher
            </button>
          </div>

          {teacherAssignments.length === 0 ? (
            <p className="text-slate-500">No teacher assignments yet.</p>
          ) : (
            <div className="space-y-3">
              {teacherAssignments.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                    <p className="font-medium text-slate-800">
                      Level: <span className="font-normal">{teacher.level}</span>
                    </p>
                    <p className="font-medium text-slate-800">
                      Teacher: <span className="font-normal">{teacher.teacherName}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTeacher(teacher);
                        setTeacherModalOpen(true);
                      }}
                      className="rounded-lg border px-3 py-2 text-slate-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const confirmed = window.confirm("Delete this teacher assignment?");
                        if (confirmed) {
                          deleteTeacherAssignment(classId, studentId, teacher.id);
                        }
                      }}
                      className="rounded-lg border px-3 py-2 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

            {grades.length === 0 ? (
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
                    {grades.map((grade) => (
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

            {notes.length === 0 ? (
              <p className="text-slate-500">No notes yet.</p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
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
        onClose={() => {
          setGradeModalOpen(false);
          setEditingGrade(null);
        }}
        onSave={handleSaveGrade}
        initialData={editingGrade}
      />

      <NoteFormModal
        isOpen={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        initialData={editingNote}
      />

      <TeacherAssignmentFormModal
        isOpen={teacherModalOpen}
        onClose={() => {
          setTeacherModalOpen(false);
          setEditingTeacher(null);
        }}
        onSave={handleSaveTeacher}
        initialData={editingTeacher}
      />
    </div>
  );
}