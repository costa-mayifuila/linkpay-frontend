import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CriarLink({ onLinkCriado }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [liquido, setLiquido] = useState(null);
  const [linkCriado, setLinkCriado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const BASE_URL  = import.meta.env.VITE_API_URL;
  const BASE_SITE = import.meta.env.VITE_BASE_SITE; // agora vem do painel do Vercel

  const calcularLiquido = (plano, valor) => {
    let p = 0.04;
    if (plano === "ouro") p = 0.025;
    if (plano === "premium") p = 0.01;
    const taxaFixa = 0.5;
    const taxa = valor * p + taxaFixa;
    return valor - taxa;
  };

  useEffect(() => {
    if (amount && user?.plano) {
      const valor = parseFloat(amount);
      if (!isNaN(valor)) {
        const resultado = calcularLiquido(user.plano, valor);
        setLiquido(resultado.toFixed(2));
      } else {
        setLiquido(null);
      }
    } else {
      setLiquido(null);
    }
  }, [amount, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/links/criar`,
        { title, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const link = res.data.link;
      const url  = `${BASE_SITE}/pagar/${link.slug}`;

      setLinkCriado(url);
      await navigator.clipboard.writeText(url);
      alert("✅ Link criado e copiado para a área de transferência!");

      setTitle("");
      setAmount("");
      setLiquido(null);
      if (onLinkCriado) onLinkCriado();
    } catch (err) {
      console.error("❌ Erro ao criar link:", err);
      alert(err.response?.data?.message || "Erro ao criar link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-5 text-gray-800 text-center">
          Criar Novo Link de Pagamento
        </h2>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título do produto/serviço
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Consultoria de Marketing"
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Valor (Kz)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex: 50000"
            min="1"
            step="0.01"
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {liquido && (
          <p className="text-sm text-green-700 bg-green-100 p-2 rounded-lg mb-4">
            💰 Você receberá aproximadamente <strong>Kz {liquido}</strong> após as taxas.
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } transition-colors text-white font-medium px-6 py-3 rounded-xl mb-2`}
        >
          {isLoading ? "Criando..." : "Criar Link"}
        </button>

        {linkCriado && (
          <div className="mt-5 bg-gray-100 p-4 rounded-lg border border-gray-300">
            <p className="text-sm font-medium text-gray-700 mb-1">🔗 Link gerado:</p>
            <div className="flex items-center gap-2">
              <a
                href={linkCriado}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline break-all flex-1"
              >
                {linkCriado}
              </a>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(linkCriado)}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                Copiar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
