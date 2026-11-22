import { STATUS, usagePercent } from "../utils/status.js";

export function StatusBadge({ status }) {
  const { label, badge } = STATUS[status];
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
      {label}
    </span>
  );
}

export default function AttendanceSummary({ subject }) {
  const { bar } = STATUS[subject.status];
  const percent = usagePercent(subject.absences_used, subject.absence_limit);

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>
          {subject.absences_used} de {subject.absence_limit} faltas
        </span>
        <span className="text-slate-500">
          Restam {subject.absences_remaining}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="h-2 overflow-hidden rounded-full bg-slate-200"
      >
        <div className={`h-full ${bar}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
