import { useState } from "react";
import {
  completedCount,
  dayDateForIndex,
  formatDate,
  getEndDate,
  todayStr,
} from "../utils/missions";

const COLLAPSED_DAY_LIMIT = 14;
const COLORS = ["red", "yellow", "green"];

function getDayColor(checked) {
  if (!checked) return "";
  if (checked === true) return "green";
  return checked.color || "";
}

function getDayJournal(checked) {
  if (!checked || checked === true) return "";
  return checked.journal || "";
}

export default function MissionCard({ mission, onToggleDay, onDelete, onCancel, finished }) {
  const [expanded, setExpanded] = useState(false);
  const [modalDay, setModalDay] = useState(null);
  const [modalColor, setModalColor] = useState(null);
  const [modalJournal, setModalJournal] = useState("");
  const [hoveredDay, setHoveredDay] = useState(null);

  const done = completedCount(mission);
  const today = todayStr();
  const colorCounts = mission.checks.reduce(
    (acc, c) => {
      const color = getDayColor(c);
      if (color) acc[color] = (acc[color] || 0) + 1;
      return acc;
    },
    {}
  );
  const canCollapse = mission.checks.length > COLLAPSED_DAY_LIMIT;
  const visibleChecks = expanded || !canCollapse
    ? mission.checks
    : mission.checks.slice(0, COLLAPSED_DAY_LIMIT);

  function openModal(i) {
    const existing = mission.checks[i];
    setModalDay(i);
    setModalColor(getDayColor(existing) || null);
    setModalJournal(getDayJournal(existing));
  }

  function handleModalSubmit() {
    onToggleDay(
      mission.id,
      modalDay,
      modalColor ? { color: modalColor, journal: modalJournal.trim() } : null
    );
    setModalDay(null);
  }

  function handleModalCancel() {
    setModalDay(null);
  }

  function handleCancelClick() {
    if (window.confirm("Cancel this mission? It will move to History.")) {
      onCancel(mission.id);
    }
  }

  function handleDeleteClick() {
    if (window.confirm("Delete this mission? All progress will be permanently deleted and cannot be recovered.")) {
      onDelete(mission.id);
    }
  }

  return (
    <div className="mission-card">
      <div className="mission-meta">
        <span>{formatDate(mission.startDate)} &rarr; {formatDate(getEndDate(mission))}</span>
        <span className="color-counts">
          [<span className="count-red">{colorCounts.red || 0}</span>,&nbsp;
          <span className="count-yellow">{colorCounts.yellow || 0}</span>,&nbsp;
          <span className="count-green">{colorCounts.green || 0}</span>]
        </span>
      </div>

      <div className="mission-header">
        <div>
          <h3>{mission.name}</h3>
          {expanded && mission.rules && (
            <div className="mission-detail-field">
              <span className="mission-field-label">Rules</span>
              <div className="mission-detail-box">{mission.rules}</div>
            </div>
          )}
          {expanded && mission.rewards && (
            <div className="mission-detail-field">
              <span className="mission-field-label">Rewards</span>
              <div className="mission-detail-box">{mission.rewards}</div>
            </div>
          )}
          {expanded && mission.penalties && (
            <div className="mission-detail-field">
              <span className="mission-field-label">Penalties</span>
              <div className="mission-detail-box">{mission.penalties}</div>
            </div>
          )}
        </div>
        <button className="btn-icon" onClick={handleDeleteClick} aria-label="Delete mission">
          &times;
        </button>
      </div>

      <div className="mission">
        {visibleChecks.map((checked, i) => {
          const dayDate = dayDateForIndex(mission, i);
          const dayDateStr = dayDate.toISOString().slice(0, 10);
          const isFuture = dayDateStr > today;
          const color = getDayColor(checked);
          const journal = getDayJournal(checked);

          return (
            <div key={i} className="day-check-wrap">
              <button
                className={`day-check ${color ? `color-${color}` : ""} ${isFuture ? "future" : ""}`}
                disabled={finished || isFuture}
                title={formatDate(dayDate)}
                onClick={() => openModal(i)}
                onMouseEnter={() => journal && setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {i + 1}
              </button>
              {hoveredDay === i && journal && (
                <div className="day-journal-tooltip">" {journal} "</div>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-link checklist-toggle" onClick={() => setExpanded((e) => !e)}>
        {expanded ? "Show less" : "More details"}
      </button>

      <div className="mission-footer">
        <button className="btn-link" onClick={handleCancelClick}>
          Cancel mission
        </button>
      </div>

      {modalDay !== null && (
        <div className="modal-overlay" onMouseDown={handleModalCancel}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <p className="modal-day-label">{formatDate(dayDateForIndex(mission, modalDay))}</p>
            <div className="modal-colors">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`color-opt ${color} ${modalColor === color ? "selected" : ""}`}
                  onClick={() => setModalColor((prev) => (prev === color ? null : color))}
                />
              ))}
            </div>
            <textarea
              className="modal-journal"
              value={modalJournal}
              onChange={(e) => setModalJournal(e.target.value)}
              placeholder="How did it go today?"
              rows={4}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-outline modal-submit" onClick={handleModalSubmit}>
                SUBMIT
              </button>
              <button className="btn-link" onClick={handleModalCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
