import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import fr from "date-fns/locale/fr";
import { ChevronLeft, ChevronRight, Pin, PinOff, Radio } from "lucide-react";

const CalendarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { name: "Meeting", color: "#f59e0b" },
    { name: "Event", color: "#ef4444" },
    { name: "Task", color: "#3b82f6" },
    { name: "Personal", color: "#10b981" },
    { name: "Other", color: "#8b5cf6" },
  ];

  // ===============================
  // Fetch lives
  // ===============================
  useEffect(() => {
    const fetchLives = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://swafy-backend.onrender.com/api/lives", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const lives = await res.json();
        const newEvents = {};

        lives.forEach((live) => {
          if (!live.date) return;

          const key = format(new Date(live.date), "yyyy-MM-dd");
          if (!newEvents[key]) newEvents[key] = [];

          newEvents[key].push({
            id: live.id,
            title: live.title,
            time: live.time,
            thematique: live.thematique,
            status: live.status || "Programmé",
            isLive: true,
            isPinned: false,
            category: "Other",
          });
        });

        setEvents(newEvents);
      } catch (err) {
        console.error("Erreur chargement lives:", err);
      }
    };

    fetchLives();
  }, [location.key]);

  // ===============================
  // Helpers
  // ===============================
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (date) => {
    const key = format(date, "yyyy-MM-dd");
    return events[key] || [];
  };

  const getCategoryColor = (name) =>
    categories.find((c) => c.name === name)?.color || "#8b5cf6";

  // ===============================
  // Render
  // ===============================
  return (
    <div style={{ background: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(to right,#9e7dec,#7c3aed)",
            color: "white",
            padding: 30,
            borderRadius: 20,
            marginBottom: 25,
          }}
        >
          <h1 style={{ margin: 0 }}>
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </h1>
          <p style={{ marginTop: 6 }}>
            {format(currentDate, "EEEE dd MMMM yyyy", { locale: fr })}
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft /> Mois précédent
          </button>
          <button onClick={() => setCurrentDate(new Date())}>Aujourd’hui</button>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            Mois suivant <ChevronRight />
          </button>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 2,
            background: "#e5e3f0",
          }}
        >
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const hasLive = dayEvents.some((e) => e.isLive);
            const pinned = dayEvents.some((e) => e.isPinned);

            return (
              <div
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day);
                  setShowModal(true);
                }}
                style={{
                  background: "white",
                  minHeight: 90,
                  padding: 10,
                  cursor: "pointer",
                }}
              >
                {/* Day header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: isToday(day) ? "700" : "500",
                      color: isToday(day) ? "#6b46c1" : "#333",
                    }}
                  >
                    {format(day, "d")}
                  </span>

                  <div style={{ display: "flex", gap: 4 }}>
                    {hasLive && <Radio size={14} color="#ef4444" />}
                    {pinned && <Pin size={14} color="#f59e0b" />}
                  </div>
                </div>

                {/* Indicators */}
                <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                  {dayEvents.slice(0, 4).map((ev, i) => (
                    <div
                      key={i}
                      style={{
                        width: ev.isLive ? 22 : 16,
                        height: 5,
                        background: getCategoryColor(ev.category),
                        borderRadius: 10,
                      }}
                    />
                  ))}
                </div>
                {dayEvents
  .filter((e) => e.isLive)
  .map((lv) => (
    <div
      key={lv.id}
      onClick={(e) => {
        e.stopPropagation();
        navigate("/admin/live", {
          state: { recentLive: lv },
        });
      }}
      style={{
        marginTop: 6,
        fontSize: 11,
        fontWeight: 600,
        color: "#7c3aed",
        background: "#ede9fe",
        borderRadius: 6,
        padding: "2px 6px",
        cursor: "pointer",
      }}
    >
      📡 {lv.title}
    </div>
))}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;