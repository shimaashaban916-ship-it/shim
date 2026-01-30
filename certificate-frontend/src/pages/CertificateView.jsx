import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../styles/CertificateView.css";
import { API_URL } from "../api";

const CertificateView = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/certificates/${id}`);
        setCertificate(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.certificate-view-container');
      if (container) {
        if (window.scrollY > 40) {
          container.classList.add('scrolled-mode');
        } else {
          container.classList.remove('scrolled-mode');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!certificate) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>جاري تحميل الشهادة...</p>
      </div>
    );
  }

  if (certificate.isLocked) {
    return (
      <>
        <Header />
        <div className="certificate-view-container">
          <div className="certificate-view-card" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
            <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>الشهادة مقفولة</h2>
            <p style={{ fontSize: '18px', color: '#555', lineHeight: '1.6' }}>
              عذراً، هذه الشهادة غير متاحة للعرض حالياً.<br />
              يرجى التواصل مع المسؤول للحصول على مزيد من المعلومات.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="certificate-view-container">
        <div className="certificate-view-card">

          <div className="certificate-view-title-group" style={{
            width: '600px',
            maxWidth: '90%',
            margin: '20px auto',
            backgroundColor: '#40798c',
            borderRadius: '8px',
            padding: '12px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h2 className="certificate-view-title-ar" style={{ margin: 0, color: '#fff', fontSize: '24px' }}>الشهادة الصحية الموحدة</h2>
          </div>

          <div className="certificate-content-wrapper">
            <div className="certificate-view-photo-container" style={{ margin: "0 auto 16px" }}>
              {certificate.photoUrl ? (
                <img
                  src={certificate.photoUrl}
                  alt="Photo"
                  className="certificate-view-photo"
                />
              ) : (
                <div className="photo-placeholder">لا توجد صورة</div>
              )}
            </div>

            <div className="certificate-view-info-grid">

              <div className="certificate-view-info-row">
                <span className="certificate-view-label">الأمانة</span>
                <div className="input-box">{certificate.amana || '-'}</div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">البلدية</span>
                <div className="input-box">{certificate.baladiya || '-'}</div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">الاسم</span>
                <div className="input-box">{certificate.name || '-'}</div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">رقم الهوية</span>
                <div className="input-box">{certificate.nationalId || '-'}</div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">الجنس</span>
                <div className="input-box">{certificate.gender || '-'}</div>
              </div>

              <div className="certificate-view-info-row">
                <span className="certificate-view-label">الجنسية</span>
                <div className="input-box">{certificate.nationality || '-'}</div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">المهنة</span>
                <div className="input-box">{certificate.job || '-'}</div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">رقم الشهادة الصحية</span>
                <div className="input-box">{certificate.healthCertificateNumber || '-'}</div>
              </div>


              <div className="certificate-view-info-row">
                <span className="certificate-view-label">تاريخ إصدار الشهادة الصحية</span>
                <div className="input-box">
                  {certificate.healthCertIssueDate ? new Date(certificate.healthCertIssueDate).toLocaleDateString("en-GB") : "-"}
                </div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">تاريخ نهاية الشهادة الصحية</span>
                <div className="input-box">
                  {certificate.healthCertExpiryDate ? new Date(certificate.healthCertExpiryDate).toLocaleDateString("en-GB") : "-"}
                </div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">نوع البرنامج التثقيفي</span>
                <div className="input-box">{certificate.educationalProgram || '-'}</div>
              </div>

              <div className="certificate-view-info-row">
                <span className="certificate-view-label">تاريخ انتهاء البرنامج التثقيفي</span>
                <div className="input-box">
                  {certificate.educationalProgramEndDate ? new Date(certificate.educationalProgramEndDate).toLocaleDateString("en-GB") : "-"}
                </div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">رقم الرخصة</span>
                <div className="input-box">{certificate.licenseNumber || '-'}</div>
              </div>

              <div className="certificate-view-info-row">
                <span className="certificate-view-label">اسم المنشأة</span>
                <div className="input-box">{certificate.establishmentName || '-'}</div>
              </div>
              <div className="certificate-view-info-row">
                <span className="certificate-view-label">رقم المنشأة</span>
                <div className="input-box">{certificate.establishmentNumber || '-'}</div>
              </div>
            </div>

            {/* Removed old footer from inside card */}
          </div>
        </div>
      </div>

      {/* Accessibility Icon */}
      <div className="accessibility-icon-container">
        <button className="accessibility-btn" aria-label="Accessibility Options">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="7" r="2" fill="white" stroke="none" />
            <path d="M9 13v6a1 1 0 0 0 2 0v-4h2v4a1 1 0 0 0 2 0v-6" stroke="white" fill="none" />
            <path d="M8 10h8" stroke="white" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Main Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">خريطة الموقع</a>
            <span className="separator">|</span>
            <a href="#">شروط الاستخدام</a>
            <span className="separator">|</span>
            <a href="#">اتصل بنا</a>
          </div>
          <div className="footer-copyright">
            <p>© 2025 وزارة البلديات والإسكان</p>
          </div>
          <div className="footer-logos">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Saudi_Vision_2030_logo.svg/800px-Saudi_Vision_2030_logo.svg.png" alt="Vision 2030" className="vision-logo" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default CertificateView;
