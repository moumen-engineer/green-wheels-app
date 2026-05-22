import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Vehicules from "./pages/Vehicules";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminVehicules from "./pages/AdminVehicules/AdminVehicules";
import AdminStations from "./pages/AdminStations/AdminStations";
import AdminUtilisateurs from "./pages/AdminUtilisateurs/AdminUtilisateurs";
import AdminReservations from "./pages/AdminReservations/AdminReservations";
import AdminPayments from "./pages/AdminPayments/AdminPayments";
import AdminMaintenance from "./pages/AdminMaintenance/AdminMaintenance";
import Station from "./pages/Stations";
import Abonnements from "./pages/Abonnements";
import Apropos from "./pages/Apropos";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contacts";
import VehicleDetails from "./pages/VehicleDetails";
import Payment from "./pages/Payment";  // ADD THIS
import PaymentSuccess from "./pages/PaymentSuccess";  // ADD THIS

  
function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin-");

  return (
    <>
      {!isAdmin && <Navbar />} 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicules" element={<Vehicules />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin-vehicules" element={<ProtectedRoute requiredRole="admin"><AdminVehicules /></ProtectedRoute>} />
        <Route path="/admin-stations" element={<ProtectedRoute requiredRole="admin"><AdminStations /></ProtectedRoute>} />
        <Route path="/admin-utilisateurs" element={<ProtectedRoute requiredRole="admin"><AdminUtilisateurs /></ProtectedRoute>} />
        <Route path="/admin-reservations" element={<ProtectedRoute requiredRole="admin"><AdminReservations /></ProtectedRoute>} />
        <Route path="/admin-paiements" element={<ProtectedRoute requiredRole="admin"><AdminPayments /></ProtectedRoute>} />
        <Route path="/admin-maintenance" element={<ProtectedRoute requiredRole="admin"><AdminMaintenance /></ProtectedRoute>} />
        <Route path="/stations" element={<Station />} />
        <Route path="/abonnements" element={<Abonnements />} />
        <Route path="/a-propos" element={<Apropos />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/vehicules/:id" element={<VehicleDetails />} />
        <Route path="/payment" element={<Payment />} />  {/* ADD THIS */}
        <Route path="/payment-success" element={<PaymentSuccess />} />  {/* ADD THIS */}
      </Routes>
    </>
  );
}

export default App;