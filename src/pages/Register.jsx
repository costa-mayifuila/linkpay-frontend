import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

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
      const res = await axios.post(`${BASE_URL}/api/auth/register`, formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));


      navigate("/painel");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Criar Conta</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
        <input
          type="text"
          name="name"
          placeholder="Nome completo"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          autoComplete="name"
        />

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          autoComplete="new-password"
        />

        <input
          type="tel"
          name="phone"
          placeholder="WhatsApp (ex: 2449xxxxxxxx)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          autoComplete="tel"
          pattern="^2449[0-9]{8}$"
          title="Ex: 2449xxxxxxxx"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
