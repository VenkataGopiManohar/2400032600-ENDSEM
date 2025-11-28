import React, { useReducer, useMemo } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Asha Reddy", roll: "S101" },
  { id: 2, name: "Rahul Sharma", roll: "S102" },
  { id: 3, name: "Priya Kumar", roll: "S103" },
  { id: 4, name: "Vikram Singh", roll: "S104" },
  { id: 5, name: "Sneha Patel", roll: "S105" }
];

const STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  UNMARKED: "Unmarked"
};

const ACTIONS = {
  MARK_PRESENT: "mark_present",
  MARK_ABSENT: "mark_absent",
  RESET: "reset"
};

function buildInitialAttendance(students) {
  const map = {};
  students.forEach((s) => (map[s.id] = STATUS.UNMARKED));
  return map;
}

function attendanceReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MARK_PRESENT:
      return { ...state, [action.payload.id]: STATUS.PRESENT };
    case ACTIONS.MARK_ABSENT:
      return { ...state, [action.payload.id]: STATUS.ABSENT };
    case ACTIONS.RESET:
      return buildInitialAttendance(action.payload.students);
    default:
      return state;
  }
}

export default function App() {
  const students = initialStudents;

  const [attendance, dispatch] = useReducer(
    attendanceReducer,
    students,
    buildInitialAttendance
  );

  const summary = useMemo(() => {
    const c = { present: 0, absent: 0, unmarked: 0 };
    Object.values(attendance).forEach((s) => {
      if (s === STATUS.PRESENT) c.present++;
      else if (s === STATUS.ABSENT) c.absent++;
      else c.unmarked++;
    });
    return c;
  }, [attendance]);

  function exportCsv() {
    const header = ["Roll", "Name", "Status"];
    const rows = students.map((s) => [s.roll, s.name, attendance[s.id]]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fullscreen">
      <div className="card">
        <h1>Student Attendance Portal</h1>
        <p className="subtitle">
          Mark students present or absent using the buttons. Uses useReducer for state management.
        </p>

        <div className="row summary-row">
          <strong>
            Summary: Present: {summary.present} • Absent: {summary.absent} • Unmarked: {summary.unmarked}
          </strong>
          <div className="buttons">
            <button
              className="btn reset"
              onClick={() => dispatch({ type: ACTIONS.RESET, payload: { students } })}
            >
              Reset
            </button>
            <button className="btn export" onClick={exportCsv}>Export CSV</button>
          </div>
        </div>

        {students.map((s) => (
          <div className="row" key={s.id}>
            <div className="student-info">
              <strong className="name">{s.name}</strong>
              <div className="roll">Roll: {s.roll}</div>
            </div>

            <div className="buttons">
              <span>Status: <b>{attendance[s.id]}</b></span>

              <button
                className="btn"
                onClick={() => dispatch({ type: ACTIONS.MARK_PRESENT, payload: { id: s.id } })}
              >
                Mark Present
              </button>

              <button
                className="btn"
                onClick={() => dispatch({ type: ACTIONS.MARK_ABSENT, payload: { id: s.id } })}
              >
                Mark Absent
              </button>
            </div>
          </div>
        ))}

        <h2>Final Attendance List</h2>
        <table className="attendance-table">
          <thead>
            <tr><th>Roll</th><th>Name</th><th>Status</th></tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.roll}</td>
                <td>{s.name}</td>
                <td>{attendance[s.id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
