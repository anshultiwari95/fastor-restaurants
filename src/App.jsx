import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import InstallPrompt from "./components/InstallPrompt";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
      />
      <Route
        path="/otp"
        element={isAuthenticated ? <Navigate to="/home" /> : <Otp />}
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:id"
        element={
          <ProtectedRoute>
            <RestaurantDetail />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <InstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  );
}
