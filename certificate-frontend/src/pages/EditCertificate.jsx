import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditCertificate.css";
import { baladyData } from "../data/baladyData";

function EditCertificate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    amana: "",
    baladiya: "",
    nationalId: "",
    healthCertificateNumber: "",
    nationality: "",
    job: "",
    healthCertIssueDate: "",
    healthCertExpiryDate: "",
    educationalProgram: "",
    educationalProgramEndDate: "",
    selectedLogo: "logos/الرياض.png",
    isLocked: false,
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [municipalities, setMunicipalities] = useState([]);

  /* 
   * تم نقل خريطة اللوجو إلى baladyData.js
   * يتم الآن استدعاء اللوجو مباشرة من الكائن baladyData
   */

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/certificates/${id}`);
        const cert = res.data;

        setForm({
          name: cert.name || "",
          amana: cert.amana || "",
          baladiya: cert.baladiya || "",
          nationalId: cert.nationalId || "",
          healthCertificateNumber: cert.healthCertificateNumber || "",
          nationality: cert.nationality || "",
          job: cert.job || "",
          healthCertIssueDate: cert.healthCertIssueDate ? cert.healthCertIssueDate.split('T')[0] : "",
          healthCertExpiryDate: cert.healthCertExpiryDate ? cert.healthCertExpiryDate.split('T')[0] : "",
          educationalProgram: cert.educationalProgram || "",
          educationalProgramEndDate: cert.educationalProgramEndDate ? cert.educationalProgramEndDate.split('T')[0] : "",
          selectedLogo: cert.selectedLogo || "logos/الرياض.png",
          isLocked: cert.isLocked || false,
        });

        if (cert.amana && baladyData[cert.amana]) {
          setMunicipalities(baladyData[cert.amana].municipalities);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        alert("حدث خطأ أثناء تحميل البيانات");
        navigate("/dashboard");
      }
    };
    fetchCertificate();
  }, [id, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleAmanaChange = (e) => {
    const selectedAmana = e.target.value;
    const selectedData = baladyData[selectedAmana];
    const correspondingLogo = selectedData?.logo || "logos/الرياض.png";
    const availableMunicipalities = selectedData?.municipalities || [];

    setForm({
      ...form,
      amana: selectedAmana,
      baladiya: "", // Reset municipality
      selectedLogo: correspondingLogo
    });
    setMunicipalities(availableMunicipalities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("amana", form.amana);
      formData.append("baladiya", form.baladiya);
      formData.append("nationalId", form.nationalId);
      formData.append("healthCertificateNumber", form.healthCertificateNumber);
      formData.append("nationality", form.nationality);
      formData.append("job", form.job);
      formData.append("healthCertIssueDate", form.healthCertIssueDate);
      formData.append("healthCertExpiryDate", form.healthCertExpiryDate);
      formData.append("isLocked", form.isLocked);
      formData.append("educationalProgram", form.educationalProgram);
      formData.append("educationalProgramEndDate", form.educationalProgramEndDate);
      formData.append("selectedLogo", form.selectedLogo);

      if (photo) {
        formData.append("photo", photo);
      }

      await axios.put(
        `http://localhost:5000/api/certificates/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert("تم تعديل الشهادة بنجاح");
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء التعديل");
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>جاري التحميل...</div>;
  }

  return (
    <div className="edit-certificate-container">
      <div className="edit-certificate-header">
        <h2>تعديل الشهادة الصحية</h2>
      </div>

      <form className="edit-certificate-form" onSubmit={handleSubmit}>

        <div>
          <label>اسم الشخص *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="أدخل الاسم الكامل" required />
        </div>

        <div>
          <label>الأمانة / المنطقة *</label>
          <select name="amana" value={form.amana} onChange={handleAmanaChange} required>
            <option value="">اختر الأمانة أو المنطقة</option>
            {Object.keys(baladyData).map((amanaName) => (
              <option key={amanaName} value={amanaName}>
                {amanaName}
              </option>
            ))}
          </select>
          {form.amana && form.selectedLogo && (
            <img
              src={`/${form.selectedLogo}`}
              alt="لوجو الأمانة"
              style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px', border: '1px solid #ddd', padding: '5px', borderRadius: '4px', backgroundColor: 'white' }}
            />
          )}
        </div>

        <div>
          <label>البلدية</label>
          <select name="baladiya" value={form.baladiya} onChange={handleChange} required>
            <option value="">اختر البلدية</option>
            {municipalities.map((municipality, index) => (
              <option key={index} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>رقم الهوية *</label>
          <input type="text" name="nationalId" value={form.nationalId} onChange={handleChange} placeholder="أدخل رقم الهوية" required />
        </div>

        <div>
          <label>رقم الشهادة الصحية *</label>
          <input type="text" name="healthCertificateNumber" value={form.healthCertificateNumber} onChange={handleChange} placeholder="أدخل رقم الشهادة الصحية" required />
        </div>

        <div>
          <label>الجنسية *</label>
          <input type="text" name="nationality" value={form.nationality} onChange={handleChange} placeholder="أدخل الجنسية" required />
        </div>

        <div>
          <label>المهنة *</label>
          <input type="text" name="job" value={form.job} onChange={handleChange} placeholder="أدخل المهنة" required />
        </div>

        <div>
          <label>تاريخ إصدار الشهادة الصحية *</label>
          <input type="date" name="healthCertIssueDate" value={form.healthCertIssueDate} onChange={handleChange} required />
        </div>

        <div>
          <label>تاريخ انتهاء الشهادة الصحية *</label>
          <input type="date" name="healthCertExpiryDate" value={form.healthCertExpiryDate} onChange={handleChange} required />
        </div>

        <div>
          <label>نوع البرنامج التثقيفي *</label>
          <input type="text" name="educationalProgram" value={form.educationalProgram} onChange={handleChange} placeholder="أدخل نوع البرنامج التثقيفي" required />
        </div>

        <div>
          <label>تاريخ انتهاء البرنامج التثقيفي *</label>
          <input type="date" name="educationalProgramEndDate" value={form.educationalProgramEndDate} onChange={handleChange} required />
        </div>

        <div>
          <label>صورة الشخص (اختياري)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        <div className="form-group-checkbox" style={{ gridColumn: '1 / -1', marginTop: '10px', padding: '15px', background: '#ffe4e4', borderRadius: '8px', border: '1px solid #ffcccc' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#d32f2f', margin: 0 }}>
            <input
              type="checkbox"
              name="isLocked"
              checked={form.isLocked}
              onChange={handleChange}
              style={{ width: '24px', height: '24px', marginLeft: '10px' }}
            />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>قفل الشهادة (منع العرض عند المسح)</span>
          </label>
        </div>

        <div className="edit-certificate-btn-group">
          <button type="submit" className="edit-certificate-btn edit-certificate-submit">✓ حفظ التعديلات</button>
          <button type="button" onClick={() => navigate("/dashboard")} className="edit-certificate-btn edit-certificate-cancel">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCertificate;
