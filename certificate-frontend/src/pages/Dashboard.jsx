import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { API_URL } from "../api";

function Dashboard() {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // لو مفيش توكن → نرجّعه على اللوجين
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchCertificates();
  }, []);

  // دالة تجيب الشهادات
  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الشهادة؟")) return;

    try {
      await axios.delete(`${API_URL}/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم حذف الشهادة بنجاح");
      fetchCertificates(); // refresh list
    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleToggleLock = async (id, currentStatus) => {
    try {
      // Toggle logic
      const newStatus = !currentStatus;
      await axios.put(
        `${API_URL}/api/certificates/${id}`,
        { isLocked: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state without refetching all
      setCertificates(prevDocs =>
        prevDocs.map(doc =>
          doc._id === id ? { ...doc, isLocked: newStatus } : doc
        )
      );

    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحديث حالة القفل");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>لوحة التحكم</h2>
        <button onClick={() => navigate("/add-certificate")} className="dashboard-add-btn">
          + إضافة شهادة
        </button>
        <button onClick={logout} className="dashboard-logout-btn">تسجيل خروج</button>
      </div>

      <div className="dashboard-list">
        {certificates.length === 0 ? (
          <p className="dashboard-empty">لا توجد شهادات حتى الآن.</p>
        ) : (
          certificates.map((c) => (
            <div key={c._id} className="dashboard-card">
              <div className="dashboard-card-header">
                {c.photoUrl ? (
                  <img
                    src={c.photoUrl.startsWith('http') ? c.photoUrl : `${API_URL}/${c.photoUrl}`}
                    alt={c.name}
                    className="dashboard-card-photo"
                  />
                ) : (
                  <div className="dashboard-card-photo-placeholder">
                    {c.name.charAt(0)}
                  </div>
                )}
                <h3>{c.name}</h3>
              </div>
              <p><span className="dashboard-card-strong">رقم الهوية:</span> {c.nationalId}</p>
              <p><span className="dashboard-card-strong">الجنسية:</span> {c.nationality}</p>
              <div className="dashboard-btn-group">
                <button
                  className="dashboard-view-btn"
                  onClick={() => navigate(`/certificate/${c._id}`)}
                  title="عرض"
                >
                  👁️
                </button>
                <button
                  className="dashboard-edit-btn"
                  onClick={() => navigate(`/edit-certificate/${c._id}`)}
                  title="تعديل"
                >
                  ✏️
                </button>
                <button
                  className="dashboard-delete-btn"
                  onClick={() => handleDelete(c._id)}
                  title="حذف"
                >
                  🗑️
                </button>
                <button
                  onClick={() => handleToggleLock(c._id, c.isLocked)}
                  style={{
                    backgroundColor: c.isLocked ? '#d32f2f' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginLeft: '5px'
                  }}
                  title={c.isLocked ? "فتح الشهادة" : "قفل الشهادة"}
                >
                  {c.isLocked ? "🔒 مقفل" : "🔓 مفتوح"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
