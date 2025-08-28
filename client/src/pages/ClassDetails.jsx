// src/pages/ClassDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

// Page for viewing details of a class (students, grades, etc.)
export default function ClassDetails() {
  const { id } = useParams(); // class id from URL
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchClass() {
      try {
        const classRes = await api.get(`/classes/${id}`);
        setClassInfo(classRes.data);

        const studentsRes = await api.get(`/classes/${id}/students`);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error("Error loading class details:", err);
      }
    }
    fetchClass();
  }, [id]);

  if (!classInfo) return <p>Loading class details...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{classInfo.name}</h1>
      <p className="mb-6">{classInfo.description}</p>

      <h2 className="text-xl font-semibold mb-3">Enrolled Students</h2>
      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.email}</td>
                <td className="p-2 border">{s.status}</td>
                <td className="p-2 border">{s.grade ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
