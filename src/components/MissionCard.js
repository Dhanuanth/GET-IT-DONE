import { useState } from "react";
import {
  completedCount,
  dayDateForIndex,
  formatDate,
  getEndDate,
  todayStr,
} from "../utils/missions";

const COLLAPSED_DAY_LIMIT = 14;

export default function MissionCard({ mission, onToggleDay, onDelete, onCancel, finished }) {
  const [expanded, setExpanded] = useState(false);
  const done = completedCount(mission);
  const today = todayStr();
  const canCollapse = mission.checks.length > COLLAPSED_DAY_LIMIT;
  const visibleChecks = expanded || !canCollapse
    ? mission.checks
    : mission.checks.slice(0, COLLAPSED_DAY_LIMIT);

  function handleCancelClick() {
    if (window.confirm("Cancel this mission? It will move to History.")) {
      onCancel(mission.id);
    }
  }

  function handleDeleteClick() {
    if (
      window.confirm(
        "Delete this mission? All progress will be permanently deleted and cannot be recovered."
      )
    ) {
      onDelete(mission.id);
    }
  }

  return (
    <div className="mission-card">
      <div className="mission-header">
        <div>
          <h3>{mission.name}</h3>
          {mission.description && <p className="mission-desc">{mission.description}</p>}
        </div>
        <button className="btn-icon" onClick={handleDeleteClick} aria-label="Delete mission">
          &times;
        </button>
      </div>

      <div className="mission-meta">
        <span>{formatDate(mission.startDate)} &rarr; {formatDate(getEndDate(mission))}</span>
        <span>
          {done}/{mission.totalDays} days
        </span>
      </div>

      <div className={`checklist ${expanded ? "expanded" : ""}`}>
        {visibleChecks.map((checked, i) => {
          const dayDate = dayDateForIndex(mission, i);
          const dayDateStr = dayDate.toISOString().slice(0, 10);
          const isFuture = dayDateStr > today;
          return (
            <button
              key={i}
              className={`day-check ${checked ? "checked" : ""} ${isFuture ? "future" : ""}`}
              disabled={finished || isFuture}
              title={formatDate(dayDate)}
              onClick={() => onToggleDay(mission.id, i)}
            >
              {checked ? "✓" : i + 1}
            </button>
          );
        })}
      </div>

      {canCollapse && (
        <button className="btn-link checklist-toggle" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Show less" : `Show all ${mission.checks.length} days`}
        </button>
      )}

      <div className="mission-footer">
        <button className="btn-link" onClick={handleCancelClick}>
          Cancel mission
        </button>
      </div>
    </div>
  );
}
