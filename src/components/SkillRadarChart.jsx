import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export default function SkillRadarChart({ skills }) {
  const data = [
    { subject: "Communication", value: Number(skills.communication || 0) },
    { subject: "Teamwork", value: Number(skills.teamwork || 0) },
    { subject: "Problem Solving", value: Number(skills.problemSolving || 0) },
    { subject: "Leadership", value: Number(skills.leadership || 0) },
    { subject: "Creativity", value: Number(skills.creativity || 0) },
    { subject: "Discipline", value: Number(skills.discipline || 0) },
  ];

  return (
    <div className="h-[360px] w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Student Skill Hexagon</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="65%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
