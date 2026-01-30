import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toPng } from 'html-to-image';
import jsPDF from "jspdf";
import { CiGlobe } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import "../styles/CertificatePage.css";
import QRCodeStyling from "qr-code-styling";
import { API_URL } from "../api";
import starIcon from "../star.png";

// أنواع الشهادات المختلفة مع الألوان والأسماء
const CERTIFICATE_TYPES = {
  annual: { name: 'شهادة صحية سنوية', color: '#42ce23ff' },
  basic: { name: 'شهادة صحية', color: '#8bcb6c' },
  health: { name: 'الشهادة الصحية', color: '#428181' },
  unified: { name: 'الشهادة الصحية الموحدة', color: '#428181' }
};

const CertificatePage = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [certificateType, setCertificateType] = useState('unified'); // النوع الافتراضي
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const certRef = useRef();
  const certTopRef = useRef(null);
  const certFooterRef = useRef(null);
  const qrContainerRef = useRef(null);
  const qrInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/certificates/${id}`
        );
        setCertificate(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    if (!certificate) return;
    setIsGeneratingPdf(true);

    try {
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = 297;
      const pdfHeight = 210;

      await document.fonts.ready;

      // PAGE 1: Certificate Header/Body
      const topDataUrl = await toPng(certTopRef.current, { cacheBust: true, pixelRatio: 1.5 });
      pdf.addImage(topDataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      // PAGE 2: Instructions (Footer)
      const footerDataUrl = await toPng(certFooterRef.current, { cacheBust: true, pixelRatio: 1.5 });
      pdf.addPage();
      pdf.addImage(footerDataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Use certificate holder name for filename
      pdf.save(`certificate-${certificate.name || certificate.id}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("حدث خطأ أثناء تحميل الملف. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Initialize or update styled QR code
  useEffect(() => {
    if (!certificate) return;
    const dataUrl = `${window.location.origin}/view/${certificate._id}`;

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling({
        width: 120,
        height: 120,
        type: "svg",
        data: dataUrl,
        dotsOptions: { type: "square", color: "#040404ff" },
        cornersSquareOptions: { type: "square", color: "#010101ff" },
        cornersDotOptions: { type: "square", color: "#000000ff" },
        backgroundOptions: { color: "#ffffff" },
      });
      if (qrContainerRef.current) {
        qrInstanceRef.current.append(qrContainerRef.current);
      }
    } else {
      qrInstanceRef.current.update({ data: dataUrl });
    }
  }, [certificate]);

  if (!certificate) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <>
      <div className="cert-container">
        <div className="cert-wrapper">
          {/* أزرار اختيار نوع الشهادة */}
          <div className="cert-type-selector">
            {Object.entries(CERTIFICATE_TYPES).map(([key, { name, color }]) => (
              <button
                key={key}
                className={`type-button ${certificateType === key ? 'active' : ''}`}
                style={{
                  backgroundColor: certificateType === key ? color : 'transparent',
                  borderColor: color,
                  color: certificateType === key ? '#fff' : color
                }}
                onClick={() => setCertificateType(key)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="cert-card" ref={certRef}>
            <div className="containerTop" ref={certTopRef}>
              {/* TOP HEADER + LOGOS */}
              <div className="header-section">
                <div className="cert-header">
                  <img src="/logo1.png" alt="logo1" className="cert-logo" />
                  <div className="line"></div>
                  <img src="/logo3.png" alt="logo2" className="cert-logo" />
                  <div className="line"></div>
                  <img
                    src={`/${certificate.selectedLogo || "logo2.png"}`}
                    alt="selected logo"
                    className="cert-logo"
                  />
                </div>
                <div
                  className="header-color"
                  style={{ backgroundColor: CERTIFICATE_TYPES[certificateType].color }}
                >
                  <h1 className="main-title">{CERTIFICATE_TYPES[certificateType].name}</h1>
                </div>
              </div>

              {/* LEFT IMAGE + QR + RIGHT INFO */}
              <div className="cert-top-section">
                {/* LEFT SIDE PHOTO + QR */}
                <div className="cert-left">
                  <div className="cert-photo-box">
                    {certificate.photoUrl && (
                      <img
                        className="cert-photo"
                        src={certificate.photoUrl}
                        alt="person"
                      />
                    )}
                  </div>

                  <div className="cert-qr-box">
                    <div ref={qrContainerRef} />
                  </div>
                </div>

                {/* RIGHT INFORMATION GRID */}
                <div className="cert-right">
                  <h2 className="cert-name">{certificate.name}</h2>

                  <div className="cert-info-grid">
                    <div className="info-row">
                      <span>رقم الهوية:</span>
                      <p>{certificate.nationalId}</p>
                    </div>

                    <div className="info-row">
                      <span>الجنسية:</span>
                      <p>{certificate.nationality}</p>
                    </div>

                    <div className="info-row">
                      <span>رقم الشهادة الصحية:</span>
                      <p>{certificate.healthCertificateNumber}</p>
                    </div>

                    <div className="info-row">
                      <span>المهنة:</span>
                      <p>{certificate.job}</p>
                    </div>

                    <div className="info-row">
                      <span>تاريخ إصدار الشهادة الصحية:</span>
                      <p>
                        {certificate.healthCertIssueDate
                          ? new Date(
                            certificate.healthCertIssueDate
                          ).toLocaleDateString("en-GB")
                          : "-"}
                      </p>
                    </div>

                    <div className="info-row">
                      <span>تاريخ نهاية الشهادة الصحية:</span>
                      <p>
                        {certificate.healthCertExpiryDate
                          ? new Date(
                            certificate.healthCertExpiryDate
                          ).toLocaleDateString("en-GB")
                          : "-"}
                      </p>
                    </div>

                    <div className="info-row">
                      <span>نوع البرنامج التثقيفي:</span>
                      <p>{certificate.educationalProgram}</p>
                    </div>

                    <div className="info-row">
                      <span>تاريخ انتهاء البرنامج التثقيفي:</span>
                      <p>
                        {certificate.educationalProgramEndDate
                          ? new Date(
                            certificate.educationalProgramEndDate
                          ).toLocaleDateString("en-GB")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="links">
                <div>
                  www.balady.env.sa
                  <span className="circle">
                    <CiGlobe />
                  </span>
                </div>
                <div>
                  saudimomra
                  <span className="circle">
                    <FaFacebookF />
                  </span>{" "}
                  <span className="circle">
                    {" "}
                    <FaYoutube />{" "}
                  </span>{" "}
                  <span className="circle">
                    {" "}
                    <FaTwitter />{" "}
                  </span>
                </div>

                <span>
                  <div className="title">
                    <span className="title2"> مركز العناية بالعملاء </span>
                    <span className="num">199040</span>
                    <span className="circle2">
                      <FaPhone />
                    </span>
                  </div>
                  <span>
                    <div>
                      Balady_cs
                      <span className="circle">
                        <FaTwitter />
                      </span>
                    </div>
                  </span>
                </span>
              </div>
            </div>

            {/* FOOTER SECTION */}
            <div
              className="cert-footer"
              ref={certFooterRef}
              style={{ backgroundColor: CERTIFICATE_TYPES[certificateType].color }}
            >
              <div className="footer-header">
                <div className="footer-logos">
                  <img src="/logo3.png" alt="logo" className="footer-logo" />
                  <div className="footer-text-logo">
                    <span>وزارة البلديات والإسكان</span>
                    <br />
                    <span style={{ fontSize: '10px', fontWeight: '400', letterSpacing: '0.5px' }}>Ministry of Municipalities and Housing</span>
                  </div>
                  <div className="footer-palm">
                    <img src="/logo2.png" alt="palm" className="palm-icon" />
                  </div>
                </div>
                <h2 className="footer-title">تعليمات وإرشادات</h2>
              </div>



              <div className="footer-content">
                <div className="instruction-item">
                  <img src={starIcon} className="star-icon" alt="star" />
                  <p>شهادة صحية تجدد سنوياً.</p>
                </div>
                <div className="instruction-item">
                  <img src={starIcon} className="star-icon" alt="star" />
                  <p>يسمح لحامل الشهادة الصحية بالعمل في منشآت الغذاء أو الصحة العامة وفق المهنة المسموح بها نظاماً.</p>
                </div>
                <div className="instruction-item">
                  <img src={starIcon} className="star-icon" alt="star" />
                  <p>يلزم حامل هذه الشهادة بإجراء فحص طبي عند عودته من الخارج قبل البدء بممارسة العمل.</p>
                </div>
                <div className="instruction-item">
                  <img src={starIcon} className="star-icon" alt="star" />
                  <p>لا تعتبر الشهادة إثبات هوية.</p>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="cert-actions">
            <button onClick={handlePrint}>🖨 طباعة</button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              style={{ backgroundColor: '#2c3e50', color: 'white' }}
            >
              {isGeneratingPdf ? 'جاري التحميل...' : '📥 تحميل PDF'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificatePage;
