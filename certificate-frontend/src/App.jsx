import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddCertificate from "./pages/AddCertificate";
import EditCertificate from "./pages/EditCertificate";
import CertificatePage from "./pages/CertificatePage";
import CertificateView from "./pages/CertificateView";
import AllCertificates from "./pages/AllCertificates";
import IslamicReminder from "./components/IslamicReminder"; // Import Reminder

function App() {
  return (
    <>
      <IslamicReminder /> {/* Add Reminder Global Component */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-certificate" element={<AddCertificate />} />
        <Route path="/edit-certificate/:id" element={<EditCertificate />} />
        <Route path="/certificate/:id" element={<CertificatePage />} />
        <Route path="/view/:id" element={<CertificateView />} />
        <Route path="/certificates" element={<AllCertificates />} />
      </Routes>
    </>
  );
}

export default App;
