import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getClasses, saveAllClasses, seedDatabase } from "../db/databaseService";

const SchoolContext = createContext(null);

export function SchoolProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      await seedDatabase();
      const storedClasses = await getClasses();
      setClasses(storedClasses);
      setIsLoaded(true);
    }

    init();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    async function persist() {
      await saveAllClasses(classes);
    }

    persist();
  }, [classes, isLoaded]);

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
      gender: studentPayload.gender || "",
      birthday: studentPayload.birthday || "",
      weight: studentPayload.weight || "",
      height: studentPayload.height || "",
      bloodType: studentPayload.bloodType || "",
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
      teacherAssignments: [],
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
                  teacherAssignments:
                    payload.teacherAssignments !== undefined
                      ? payload.teacherAssignments
                      : student.teacherAssignments || [],
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

  function addTeacherAssignment(classId, studentId, teacherPayload) {
    const newTeacherAssignment = {
      id: crypto.randomUUID(),
      level: teacherPayload.level,
      teacherName: teacherPayload.teacherName,
    };

    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      teacherAssignments: [
                        ...(student.teacherAssignments || []),
                        newTeacherAssignment,
                      ],
                    }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  function updateTeacherAssignment(classId, studentId, assignmentId, payload) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      teacherAssignments: (student.teacherAssignments || []).map(
                        (assignment) =>
                          assignment.id === assignmentId
                            ? { ...assignment, ...payload }
                            : assignment
                      ),
                    }
                  : student
              ),
            }
          : classItem
      )
    );
  }

  function deleteTeacherAssignment(classId, studentId, assignmentId) {
    setClasses((prev) =>
      prev.map((classItem) =>
        classItem.id === classId
          ? {
              ...classItem,
              students: classItem.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      teacherAssignments: (student.teacherAssignments || []).filter(
                        (assignment) => assignment.id !== assignmentId
                      ),
                    }
                  : student
              ),
            }
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
                  ? {
                      ...student,
                      grades: [...(student.grades || []), newGrade],
                    }
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
                      grades: (student.grades || []).map((grade) =>
                        grade.id === gradeId
                          ? {
                              ...grade,
                              ...payload,
                              grade: Number(payload.grade),
                            }
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
                      grades: (student.grades || []).filter(
                        (grade) => grade.id !== gradeId
                      ),
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
                  ? {
                      ...student,
                      notes: [...(student.notes || []), newNote],
                    }
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
                      notes: (student.notes || []).map((note) =>
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
                      notes: (student.notes || []).filter(
                        (note) => note.id !== noteId
                      ),
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
      isLoaded,
      addClass,
      updateClass,
      deleteClass,
      addStudent,
      updateStudent,
      deleteStudent,
      reorderStudents,
      addTeacherAssignment,
      updateTeacherAssignment,
      deleteTeacherAssignment,
      addGrade,
      updateGrade,
      deleteGrade,
      addNote,
      updateNote,
      deleteNote,
    }),
    [classes, isLoaded]
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