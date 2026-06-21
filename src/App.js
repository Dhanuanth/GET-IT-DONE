import { useEffect, useMemo, useState } from "react";
import "./App.css";
import MissionForm from "./components/MissionForm";
import MissionCard from "./components/MissionCard";
import HistoryCard from "./components/HistoryCard";
import { getStatus, loadMissions, saveMissions } from "./utils/missions";

function App() {
  const [missions, setMissions] = useState(() => loadMissions());
  const [tab, setTab] = useState("active");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    saveMissions(missions);
  }, [missions]);

  const activeMissions = useMemo(
    () => missions.filter((m) => getStatus(m) === "active"),
    [missions]
  );
  const historyMissions = useMemo(
    () =>
      missions
        .filter((m) => getStatus(m) !== "active")
        .sort((a, b) => (a.startDate < b.startDate ? 1 : -1)),
    [missions]
  );

  function handleCreate(mission) {
    setMissions((prev) => [...prev, mission]);
    setShowForm(false);
  }

  function handleToggleDay(id, index) {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              checks: m.checks.map((c, i) => (i === index ? !c : c)),
            }
          : m
      )
    );
  }

  function handleDelete(id) {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  }

  function handleCancel(id) {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "cancelled", cancelledOn: new Date().toISOString().slice(0, 10) }
          : m
      )
    );
  }

  function handleReflectionChange(id, reflection) {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reflection } : m))
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Get It Done</h1>
        <nav className="tabs">
          <button
            className={tab === "active" ? "tab active" : "tab"}
            onClick={() => setTab("active")}
          >
            MISSIONS
          </button>
          <button
            className={tab === "history" ? "tab active" : "tab"}
            onClick={() => setTab("history")}
          >
            HISTORY
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === "active" && (
          <>
            {!showForm && (
              <button className="btn-outline new-mission-btn" onClick={() => setShowForm(true)}>
                + CREATE MISSION
              </button>
            )}
            {showForm && (
              <MissionForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />
            )}

            {activeMissions.length === 0 && !showForm && (
              <p className="empty-state">No active missions. Create one to get started.</p>
            )}

            <div className="mission-list">
              {activeMissions.map((m) => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  onToggleDay={handleToggleDay}
                  onDelete={handleDelete}
                  onCancel={handleCancel}
                  finished={false}
                />
              ))}
            </div>
          </>
        )}

        {tab === "history" && (
          <>
            {historyMissions.length === 0 && (
              <p className="empty-state">No completed missions yet.</p>
            )}
            <div className="mission-list">
              {historyMissions.map((m) => (
                <HistoryCard
                  key={m.id}
                  mission={m}
                  onReflectionChange={handleReflectionChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
