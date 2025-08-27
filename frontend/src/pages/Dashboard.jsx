// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../services/api"; // axios instance with baseURL
import { Link } from "react-router-dom";

// Dashboard shows different views depending on role
export default function Dashboard() {
  const [user, setUser] = useState(null); // logged in user
  const [classes, setClasses] = useState([]);

  // Fetch current user + their classes
  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await api.get("/users/me"); // backend should return logged in user
        setUser(userRes.data);

        const classRes = await api.get("/classes"); // fetch all or role-based classes
        setClasses(classRes.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    }
    fetchData();
  }, []);

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <p className="mb-6">Role: <span className="font-semibold">{user.role}</span></p>

      {/* Admin Dashboard */}
      {user.role === "admin" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Admin Dashboard</h2>
          <p className="mb-3">Manage classes and teachers below:</p>
          <ul className="space-y-2">
            {classes.map(c => (
              <li key={c.id} className="p-3 border rounded-md">
                <Link to={`/classes/${c.id}`} className="text-blue-600 font-medium">
                  {c.name}
                </Link>{" "}
                – {c.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Teacher Dashboard */}
      {user.role === "teacher" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Classes</h2>
          <ul className="space-y-2">
            {classes
              .filter(c => c.teacher_id === user.id)
              .map(c => (
                <li key={c.id} className="p-3 border rounded-md">
                  <Link to={`/classes/${c.id}`} className="text-blue-600 font-medium">
                    {c.name}
                  </Link>{" "}
                  – {c.description}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Student Dashboard */}
      {user.role === "student" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Enrolled Classes</h2>
          <ul className="space-y-2">
            {classes
              .filter(c => c.enrolled) // backend marks enrolled=true
              .map(c => (
                <li key={c.id} className="p-3 border rounded-md">
                  <Link to={`/classes/${c.id}`} className="text-blue-600 font-medium">
                    {c.name}
                  </Link>{" "}
                  – {c.description}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
