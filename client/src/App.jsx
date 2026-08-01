import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Spinner from "./components/ui/Spinner";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const FindDonors = lazy(() => import("./pages/FindDonors"));
const BecomeDonor = lazy(() => import("./pages/BecomeDonor"));
const BloodRequests = lazy(() => import("./pages/BloodRequests"));
const EmergencyBoard = lazy(() => import("./pages/EmergencyBoard"));
const Hospitals = lazy(() => import("./pages/Hospitals"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} className="text-ink" />
        <p className="text-sm font-medium text-ink-soft">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-donors" element={<FindDonors />} />
              <Route path="/become-donor" element={<BecomeDonor />} />
              <Route path="/blood-requests" element={<BloodRequests />} />
              <Route path="/emergency-board" element={<EmergencyBoard />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donors" element={<FindDonors />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111111",
            color: "#ffffff",
            borderRadius: "14px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;

