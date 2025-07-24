import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));


      navigate("/painel");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Acesse sua conta</h2>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          <div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ainda não tem conta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Crie uma agora
          </a>
        </p>
      </div>
    </div>
  );
}
