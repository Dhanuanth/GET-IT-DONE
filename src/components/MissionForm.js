import { useState } from "react";
import { todayStr } from "../utils/missions";

export default function MissionForm({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalDays, setTotalDays] = useState(7);
  const [startDate, setStartDate] = useState(todayStr());

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || totalDays <= 0) return;
    onCreate({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      totalDays: Number(totalDays),
      startDate,
      checks: Array(Number(totalDays)).fill(false),
    });
  }

  return (
    <form className="mission-form" onSubmit={handleSubmit}>
      <label>
        NAME
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
          autoFocus
          required
        />
      </label>
      <label>
        DESCRIPTION
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          rows={3}
        />
      </label>
      <div className="form-row">
        <label>
          NUMBER OF DAYS
          <input
            type="number"
            min={1}
            value={totalDays}
            onChange={(e) => setTotalDays(e.target.value)}
            required
          />
        </label>
        <label>
          START DATE
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-outline">
          CREATE
        </button>
        <button type="button" className="btn-link" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
