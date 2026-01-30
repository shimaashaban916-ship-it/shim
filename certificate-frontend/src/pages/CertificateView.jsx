import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../styles/CertificateView.css";
import { API_URL } from "../api";
import visionLogo from "../vision2030_logo_transparent.png";

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

      {/* Accessibility Icon - Standard Blue Widget style */}
      <div className="accessibility-icon-container">
        <button className="accessibility-btn" aria-label="Accessibility Options">
          {/* Standard Eye Icon often used for 'Views' or simple Person icon */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#0063cf" />
            <path d="M12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6Z" fill="white" />
            <path d="M12 14C9.33333 14 7 15.3333 7 17V18H17V17C17 15.3333 14.6667 14 12 14Z" fill="white" />
          </svg>
        </button>
      </div>

      {/* Main Footer - Order: Logo (Start), Copyright, Links (End) */}
      <footer className="main-footer">
        <div className="footer-content">
          {/* Logo Section - First in HTML = Right in RTL */}
          <div className="footer-logos">
            <img src={visionLogo} alt="Vision 2030" className="vision-logo" />
          </div>

          {/* Copyright - Center */}
          <div className="footer-copyright">
            <p>© 2025 وزارة البلديات والإسكان</p>
          </div>

          {/* Links - Last in HTML = Left in RTL */}
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
