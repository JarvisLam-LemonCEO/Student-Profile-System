import { Pencil, Trash2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentCard({
  classId,
  student,
  onEdit,
  onDelete,
  dragHandleProps,
}) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div
          {...dragHandleProps}
          className="cursor-grab rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
        >
          Drag
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="rounded-lg border px-3 py-2 text-slate-600 hover:bg-slate-50"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="rounded-lg border px-3 py-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        {student.image ? (
          <img
            src={student.image}
            alt={student.name}
            className="mb-3 h-24 w-24 rounded-full object-cover ring-2 ring-blue-100"
          />
        ) : (
          <div className="mb-3 rounded-full bg-blue-100 p-4 text-blue-600">
            <UserRound size={28} />
          </div>
        )}

        <h3 className="text-lg font-semibold text-slate-800">{student.name}</h3>
        <p className="text-sm text-slate-500">Student ID: {student.studentId}</p>

        <button
          onClick={() => navigate(`/student/${classId}/${student.id}`)}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          View Student
        </button>
      </div>
    </div>
  );
}