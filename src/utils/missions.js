const STORAGE_KEY = "missions";

export function loadMissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMissions(missions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function todayStr() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// Mission shape:
// { id, name, description, totalDays, startDate, checks: [bool, ...],
//   status: "active" | "cancelled", cancelledOn, reflection }

export function getEndDate(mission) {
  return addDays(mission.startDate, mission.totalDays - 1);
}

export function isPastEndDate(mission) {
  const end = getEndDate(mission);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return today > end;
}

// Derived status, independent of whatever is stored.
export function getStatus(mission) {
  if (mission.status === "cancelled") return "cancelled";
  if (isPastEndDate(mission)) return "completed";
  return "active";
}

export function isMissionFinished(mission) {
  return getStatus(mission) !== "active";
}

export function completedCount(mission) {
  return mission.checks.filter(Boolean).length;
}

export function dayDateForIndex(mission, index) {
  return addDays(mission.startDate, index);
}
