
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Check, X, HelpCircle } from "lucide-react";
import "./AttendanceTracker.css";

export default function AttendanceTracker({
  lessonId,
  attendees = [],
  onAttendanceChange,
  variant = "card",
}) {
  const { user } = useAuth();
  const [myStatus, setMyStatus] = useState(null);
  const [stats, setStats] = useState({ coming: 0, notComing: 0, maybe: 0 });

  useEffect(() => {
    if (!user?.id) return;

    
    const myAttendance = attendees.find(
      (att) => Number(att.userId) === Number(user.id)
    );
    setMyStatus(myAttendance?.status || null);

    // Calculate stats
    const coming = attendees.filter((att) => att.status === "coming").length;
    const notComing = attendees.filter(
      (att) => att.status === "not_coming"
    ).length;
    const maybe = attendees.filter((att) => att.status === "maybe").length;

    setStats({ coming, notComing, maybe });
  }, [attendees, user?.id]);

  const handleStatusChange = async (status) => {
    if (!user?.id) {
      alert("Je moet ingelogd zijn om aanwezigheid te bevestigen");
      return;
    }

   
    setMyStatus(status);

    if (onAttendanceChange) {
      await onAttendanceChange(status);
    }
  };

  return (
    <div className="attendance-tracker">
      <h4 className="attendance-tracker__title">Kom je naar deze les?</h4>

      <div className="attendance-tracker__buttons">
        <button
          className={`attendance-btn attendance-btn--coming ${
            myStatus === "coming" ? "attendance-btn--active" : ""
          }`}
          onClick={() => handleStatusChange("coming")}
        >
          <Check size={18} />
          <span>Ik kom</span>
          {stats.coming > 0 && (
            <span className="attendance-btn__count">{stats.coming}</span>
          )}
        </button>

        <button
          className={`attendance-btn attendance-btn--maybe ${
            myStatus === "maybe" ? "attendance-btn--active" : ""
          }`}
          onClick={() => handleStatusChange("maybe")}
        >
          <HelpCircle size={18} />
          <span>Misschien</span>
          {stats.maybe > 0 && (
            <span className="attendance-btn__count">{stats.maybe}</span>
          )}
        </button>

        <button
          className={`attendance-btn attendance-btn--not-coming ${
            myStatus === "not_coming" ? "attendance-btn--active" : ""
          }`}
          onClick={() => handleStatusChange("not_coming")}
        >
          <X size={18} />
          <span>Ik kom niet</span>
          {stats.notComing > 0 && (
            <span className="attendance-btn__count">{stats.notComing}</span>
          )}
        </button>
      </div>

      {myStatus && (
        <p className="attendance-tracker__status">
          {myStatus === "coming" && "✅ Je hebt aangegeven dat je komt"}
          {myStatus === "maybe" && "❓ Je hebt 'misschien' aangegeven"}
          {myStatus === "not_coming" &&
            "❌ Je hebt aangegeven dat je niet komt"}
        </p>
      )}
    </div>
  );
}
