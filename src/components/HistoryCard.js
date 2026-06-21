import { useState } from "react";
import { completedCount, formatDate, getEndDate, getStatus } from "../utils/missions";

export default function HistoryCard({ mission, onReflectionChange, onDelete }) {
  const done = completedCount(mission);
  const status = getStatus(mission);
  const [reflection, setReflection] = useState(mission.reflection || "");
  const [saved, setSaved] = useState(true);

  function handleChange(e) {
    setReflection(e.target.value);
    setSaved(false);
  }

  function handleSave() {
    onReflectionChange(mission.id, reflection);
    setSaved(true);
  }

  return (
    <div className="mission-card history-card">
      <div className="mission-header">
        <div>
          <h3>{mission.name}</h3>
          {mission.description && <p className="mission-desc">{mission.description}</p>}
        </div>
        <span className={`status-badge ${status}`}>
          {status === "completed" ? "Completed" : "Cancelled"}
        </span>
      </div>

      <div className="mission-meta">
        <span>
          {formatDate(mission.startDate)} &rarr; {formatDate(getEndDate(mission))}
          {status === "cancelled" && mission.cancelledOn && (
            <> &middot; stopped {formatDate(mission.cancelledOn)}</>
          )}
        </span>
        <span className="history-result">
          {done} / {mission.totalDays} days done
        </span>
      </div>

      <div className="reflection">
        <label htmlFor={`reflection-${mission.id}`}>Reflection</label>
        <textarea
          id={`reflection-${mission.id}`}
          value={reflection}
          onChange={handleChange}
          placeholder="What did you learn? Would you do it differently?"
          rows={2}
        />
        {!saved && (
          <button className="btn-link" onClick={handleSave}>
            Save reflection
          </button>
        )}
      </div>

      <div className="mission-footer">
        <button className="btn-link" onClick={() => onDelete(mission.id)}>
          Remove from history
        </button>
      </div>
    </div>
  );
}
