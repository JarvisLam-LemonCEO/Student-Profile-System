import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getClasses, saveClasses, seedLocalStorage } from "../utils/storage";

const SchoolContext = createContext(null);

export function SchoolProvider({ children }) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    seedLocalStorage();
    setClasses(getClasses());
  }, []);

  useEffect(() => {
    if (classes.length) {
      saveClasses(classes);
    }
  }, [classes]);

  function addClass(payload) {
    const newClass = {
      id: crypto.randomUUID(),
      name: payload.name,
      description: payload.description || "",
      students: [],
    };
    setClasses((prev) => [...prev, newClass]);
  }

  function updateClass(classId, payload) {
    setClasses((prev) =>
      prev.map((item) =>
        item.id === classId ? { ...item, ...payload } : item
      )
    );
  }

  function deleteClass(classId) {
    setClasses((prev) => prev.filter((item) => item.id !== classId));
  }

  function addStudent(classId, studentPayload) {
    const newStudent = {
      id: crypto.randomUUID(),
      name: studentPayload.name,
      studentId: studentPayload.studentId,
      image: studentPayload.image || "",
      skills: {
        communication: Number(studentPayload.skills?.communication || 0),
        teamwork: Number(studentPayload.skills?.teamwork || 0),
        problemSolving: Number(studentPayload.skills?.problemSolving || 0),
        leadership: Number(studentPayload.skills?.leadership || 0),
        creativity: Number(studentPayload.skills?.creativity || 0),
        discipline: Number(studentPayload.skills?.discipline || 0),
      },
      grades: [],
      notes: [],
    };

    setClasses((prev) =>
      prev.map((item) =>
        item.id === classId
          ? { ...item, students: [...item.students, newStudent] }
          : item
      )
    );
  }

  function updateStudent(classId, studentId, payload) {
    setClasses((prev) =>
      prev.map((classItem) => {
        if (classItem.id !== classId) return classItem;

        return {
          ...classItem,
          students: classItem.students.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  ...payload,
                  image:
                    payload.image !== undefined ? payload.image : student.image || "",
                  skills: payload.skills
                    ? {
                        ...student.skills,
                        ...payload.skills,
                      }
                    : student.skills,
                }
              : student
          ),
        };
      })
    );
  }

  function deleteStudent(classId, studentId) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.filter(
                (student) => student.id !== studentId
              ),
            }
          : classItem
      )
    );
  }

  function reorderStudents(classId, reorderedStudents) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? { ...classItem, students: reorderedStudents }
          : classItem
      )
    );
  }

  function addGrade(classId, studentId, gradePayload) {
    const newGrade = {
      id: crypto.randomUUID(),
      subject: gradePayload.subject,
      date: gradePayload.date,
      type: gradePayload.type,
      grade: Number(gradePayload.grade),
    };

    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? { ...student, grades: [...student.grades, newGrade] }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  function updateGrade(classId, studentId, gradeId, payload) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      grades: student.grades.map((grade) =>
                        grade.id === gradeId
                          ? { ...grade, ...payload, grade: Number(payload.grade) }
                          : grade
                      ),
                    }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  function deleteGrade(classId, studentId, gradeId) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      grades: student.grades.filter((grade) => grade.id !== gradeId),
                    }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  function addNote(classId, studentId, notePayload) {
    const newNote = {
      id: crypto.randomUUID(),
      content: notePayload.content,
      date: notePayload.date,
    };

    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? { ...student, notes: [...student.notes, newNote] }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  function updateNote(classId, studentId, noteId, payload) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      notes: student.notes.map((note) =>
                        note.id === noteId ? { ...note, ...payload } : note
                      ),
                    }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  function deleteNote(classId, studentId, noteId) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      notes: student.notes.filter((note) => note.id !== noteId),
                    }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  const value = useMemo(
    () => ({
      classes,
      addClass,
      updateClass,
      deleteClass,
      addStudent,
      updateStudent,
      deleteStudent,
      reorderStudents,
      addGrade,
      updateGrade,
      deleteGrade,
      addNote,
      updateNote,
      deleteNote,
    }),
    [classes]
  );

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  return useContext(SchoolContext);
}