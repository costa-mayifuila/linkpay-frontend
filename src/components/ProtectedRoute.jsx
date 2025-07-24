import { Navigate } from "react-router-dom";

// Componente que protege rotas privadas
const ProtectedRoute = ({ children, role }) => {
  let user = null;

  try {
    // aqui mudamos para usar a chave "userInfo" que você salvou no login
    const raw = localStorage.getItem("userInfo");

    // Garante que o conteúdo seja válido antes de parsear
    if (raw && raw !== "undefined") {
      user = JSON.parse(raw);
    }
  } catch (error) {
    console.error("❌ Erro ao acessar o usuário do localStorage:", error);
  }

  // Redireciona se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se houver uma role exigida e ela não bater, vai para home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Autorizado: renderiza o conteúdo protegido
  return children;
};

export default ProtectedRoute;
