import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  let raw;
  let user = null;

  try {
    raw = localStorage.getItem("userInfo");
    console.log("🔍 ProtectedRoute raw userInfo:", raw);
    if (raw && raw !== "undefined") {
      user = JSON.parse(raw);
      console.log("✅ ProtectedRoute parsed user:", user);
    }
  } catch (error) {
    console.error("❌ Erro ao parsear userInfo:", error);
  }

  // Se não tiver usuário, vai pro login
  if (!user) {
    console.warn("🔒 ProtectedRoute: sem user, redirecionando para /login");
    return <Navigate to="/login" replace />;
  }

  // Se a rota exigir role e não bater
  if (role && user.role !== role) {
    console.warn(
      `🔒 ProtectedRoute: role mismatch (esperada ${role}, encontrada ${user.role}), redirecionando para /`
    );
    return <Navigate to="/" replace />;
  }

  console.log("🔓 ProtectedRoute: autorizado, renderizando children");
  return children;
};

export default ProtectedRoute;
