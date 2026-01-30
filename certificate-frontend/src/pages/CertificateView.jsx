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

      {/* Accessibility Icon - Fixed Position */}
      <div className="accessibility-icon-container">
        <button className="accessibility-btn" aria-label="Accessibility Options">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#0076c8" />
            <path d="M12 4.5C13.1 4.5 14 3.6 14 2.5C14 1.4 13.1 0.5 12 0.5C10.9 0.5 10 1.4 10 2.5C10 3.6 10.9 4.5 12 4.5ZM12 6.5C9.5 6.5 7 7 7 7V12.5H9.5V19.5H14.5V12.5H17V7C17 7 14.5 6.5 12 6.5Z" fill="white" transform="translate(0 2) scale(0.85 0.85)" />
            {/* Alternative Path for "Universal Access" style if above isn't exact */}
            <path d="M12 5.5C12.8284 5.5 13.5 4.82843 13.5 4C13.5 3.17157 12.8284 2.5 12 2.5C11.1716 2.5 10.5 3.17157 10.5 4C10.5 4.82843 11.1716 5.5 12 5.5Z" fill="white" />
            <path d="M10 8V18H10.6667V22H13.3333V18H14V8H18V6H6V8H10Z" fill="white" />
          </svg>
          {/* Let's use a simpler, cleaner SVG for the "Man in Circle" */}
          <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, padding: '10px' }}>
            <path d="M50,18c4.4,0,8-3.6,8-8s-3.6-8-8-8s-8,3.6-8,8S45.6,18,50,18z M50,22c-9,0-19,2-19,2v7h5v31h10V46h8v16h10V31h5v-7 C69,24,59,22,50,22z" fill="white" />
          </svg>
        </button>
      </div>

      {/* Main Footer - Order: Logo (Start), Copyright, Links (End) */}
      <footer className="main-footer">
        <div className="footer-content">
          {/* Logo Section - First in Code as requested */}
          <div className="footer-logos">
            <img src="https://cdn.vision2030.gov.sa/media/rc0b2322/vision-2030-logo-white.png" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="color:white;font-weight:bold;">VISION 2030</span>' }} alt="Vision 2030" className="vision-logo" />
          </div>

          <div className="footer-copyright">
            <p>© 2025 وزارة البلديات والإسكان</p>
          </div>

          <div className="footer-links">
            <a href="#">اتصل بنا</a>
            <span className="separator">|</span>
            <a href="#">شروط الاستخدام</a>
            <span className="separator">|</span>
            <a href="#">خريطة الموقع</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CertificateView;
