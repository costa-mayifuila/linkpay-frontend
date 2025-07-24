import React from "react";
import { Routes, Route } from "react-router-dom";

// 🧩 Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicPaymentPage from "./components/PublicPaymentPage";
import LoadingSpinner from "./components/LoadingSpinner";
import Unauthorized from "./pages/Unauthorized";

// 🏠 Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OfertasPage from "./pages/OfertasPage";
import SolucoesPage from "./pages/SolucoesPage";
import EmpresaPage from "./pages/EmpresaPage";
import PaginaAfiliado from "./pages/PaginaAfiliado";
import AfiliadoLandingPage from "./pages/AfiliadoLandingPage";
import PagamentoConfirmado from "./pages/PagamentoConfirmado";

// 👤 User Pages
import Dashboard from "./pages/Dashboard";
import MeusLinks from "./pages/MeusLinks";
import MinhaAssinatura from "./pages/MinhaAssinatura";
import SaquePage from "./pages/SaquePage";
import PerfilPage from "./pages/PerfilPage";
import ExtratoPage from "./pages/ExtratoPage";
import SuportePage from "./pages/SuportePage";

// 👑 Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminSaques from "./pages/AdminSaques";

// 🤝 Affiliate Pages
import AfiliadoPainel from "./pages/AfiliadoPainel";
import AfiliadoDashboard from "./pages/AfiliadoDashboard";
import AfiliadoSaquePage from "./pages/AfiliadoSaquePage";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-50 md:ml-64">
          <Routes>
            {/* 🌐 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/planos" element={<OfertasPage />} />
            <Route path="/solucoes" element={<SolucoesPage />} />
            <Route path="/empresa" element={<EmpresaPage />} />
            <Route path="/pagar/:slug" element={<PublicPaymentPage />} />
            <Route path="/afiliado/:slug" element={<PaginaAfiliado />} />
            <Route path="/afiliado-page/:idAfiliado" element={<AfiliadoLandingPage />} />
            <Route path="/pagamento-confirmado/:slug" element={<PagamentoConfirmado />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 🔐 Authenticated User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/painel" element={<MeusLinks />} />
              <Route path="/minha-assinatura" element={<MinhaAssinatura />} />
              <Route path="/saques" element={<SaquePage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/extrato" element={<ExtratoPage />} />
              <Route path="/suporte" element={<SuportePage />} />
            </Route>

            {/* 🛡️ Admin Routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/saques" element={<AdminSaques />} />
            </Route>

            {/* 🤝 Affiliate Routes */}
            <Route element={<ProtectedRoute requiredRole="afiliado" />}>
              <Route path="/afiliado/painel" element={<AfiliadoPainel />} />
              <Route path="/afiliado/dashboard" element={<AfiliadoDashboard />} />
              <Route path="/afiliado/saques" element={<AfiliadoSaquePage />} />
            </Route>

            {/* 🚫 404 Page */}
            <Route path="*" element={
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">404 - Página não encontrada</h1>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}