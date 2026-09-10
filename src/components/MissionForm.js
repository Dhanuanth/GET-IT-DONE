import { useLayoutEffect, useRef, useState } from "react";
import { todayStr } from "../utils/missions";

function useBulletField() {
  const [value, setValue] = useState("• ");
  const ref = useRef(null);
  const nextCursor = useRef(null);

  useLayoutEffect(() => {
    if (nextCursor.current !== null && ref.current) {
      ref.current.setSelectionRange(nextCursor.current, nextCursor.current);
      nextCursor.current = null;
    }
  });

  function onKeyDown(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const { selectionStart, selectionEnd, value: v } = e.target;
    const newVal = v.slice(0, selectionStart) + "\n• " + v.slice(selectionEnd);
    nextCursor.current = selectionStart + 3;
    setValue(newVal);
  }

  function onChange(e) {
    setValue(e.target.value);
  }

  return { value, ref, onKeyDown, onChange };
}

export default function MissionForm({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [totalDays, setTotalDays] = useState(7);
  const [startDate, setStartDate] = useState(todayStr());
  const rules = useBulletField();
  const rewards = useBulletField();
  const penalties = useBulletField();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || totalDays <= 0) return;
    onCreate({
      id: crypto.randomUUID(),
      name: name.trim(),
      rules: rules.value.trim(),
      rewards: rewards.value.trim(),
      penalties: penalties.value.trim(),
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
        RULES
        <textarea
          ref={rules.ref}
          value={rules.value}
          onChange={rules.onChange}
          onKeyDown={rules.onKeyDown}
          rows={3}
          required
        />
      </label>
      <label>
        REWARDS
        <textarea
          ref={rewards.ref}
          value={rewards.value}
          onChange={rewards.onChange}
          onKeyDown={rewards.onKeyDown}
          rows={3}
          required
        />
      </label>
      <label>
        PENALTIES
        <textarea
          ref={penalties.ref}
          value={penalties.value}
          onChange={penalties.onChange}
          onKeyDown={penalties.onKeyDown}
          rows={3}
          required
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
