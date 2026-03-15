import { Pencil, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClassCard({ item, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.description || "No description"}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="rounded-lg border px-3 py-2 text-slate-600 hover:bg-slate-50"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="rounded-lg border px-3 py-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Users size={18} />
          <span>{item.students.length} students</span>
        </div>

        <button
          onClick={() => navigate(`/class/${item.id}`)}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          View Class
        </button>
      </div>
    </div>
  );
}
