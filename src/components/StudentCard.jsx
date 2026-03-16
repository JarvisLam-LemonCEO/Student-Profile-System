import { Pencil, Trash2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentCard({
  classId,
  student,
  sequenceNumber,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="cursor-grab rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md active:cursor-grabbing">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
          #{sequenceNumber}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(student);
            }}
            className="rounded-lg border px-3 py-2 text-slate-600 hover:bg-slate-50"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(student.id);
            }}
            className="rounded-lg border px-3 py-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div
        className="flex flex-col items-center text-center"
        onClick={() => navigate(`/student/${classId}/${student.id}`)}
      >
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
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/student/${classId}/${student.id}`);
          }}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          View Student
        </button>
      </div>
    </div>
  );
}