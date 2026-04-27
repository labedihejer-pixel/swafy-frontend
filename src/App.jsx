import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLiveStream from "./pages/AdminLiveStream";
import AdminContact from "./pages/AdminContact";
import JeuneDashboard from "./pages/JeuneDashboard";
import JeuneLayout from "./pages/JeuneLayout";
import Swafy_Meet from "./pages/Swafy_Meet";
import MeetRoom from "./pages/MeetRoom";
import ArchivePage from "./pages/ArchivePage";
import LiveViewer from "./pages/LiveViewer";
import NewLive from "./pages/NewLive";
import CalendarPage from "./pages/CalendarPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ ROOT */}
        <Route path="/" element={<Login />} />

        {/* ✅ Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/live/:roomCode" element={<LiveViewer />} />

        {/* ✅ Calendar */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Meet */}
        <Route
          path="/meet"
          element={
            <ProtectedRoute>
              <Swafy_Meet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meet/:roomCode"
          element={
            <ProtectedRoute>
              <MeetRoom />
            </ProtectedRoute>
          }
        />

        {/* ✅ Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/contact"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminContact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/live"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLiveStream />
            </ProtectedRoute>
          }
        />

        <Route
          path="/archive"
          element={
            <ProtectedRoute requiredRole="admin">
              <ArchivePage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Jeune */}
        <Route
          path="/jeune"
          element={
            <ProtectedRoute requiredRole="jeune">
              <JeuneLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jeune/dashboard"
          element={
            <ProtectedRoute requiredRole="jeune">
              <JeuneDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Create Live */}
        <Route
          path="/new-live"
          element={
            <ProtectedRoute requiredRole="admin">
              <NewLive />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}