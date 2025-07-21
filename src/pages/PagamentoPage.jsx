import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PagamentoPage() {
  const { slug } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [afiliadoId, setAfiliadoId] = useState(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [whatsappCliente, setWhatsappCliente] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    setAfiliadoId(ref);

    const url = ref
      ? `${BASE_URL}/api/links/publico/${slug}?ref=${ref}`
      : `${BASE_URL}/api/links/${slug}`;

    axios
      .get(url)
      .then((res) => {
        setLink(res.data);
      })
      .catch(() => {
        setLink(null);
      })
      .finally(() => setLoading(false));
  }, [slug, BASE_URL]);

  const iniciarPagamento = async () => {
    if (!nomeCliente || !emailCliente || !whatsappCliente) {
      alert("Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const payload = {
        reference: link.slug || slug,
        amount: link.amount,
        nomeCliente,
        emailCliente,
        whatsappCliente,
      };

      if (afiliadoId) {
        payload.afiliadoId = afiliadoId;
      }

      const response = await axios.post(`${BASE_URL}/api/payment/solicitar-token`, payload);
      const { frameUrl } = response.data;
      window.location.href = frameUrl;
    } catch (error) {
      console.error("Erro ao solicitar token:", error.response?.data || error.message);
      alert("Erro ao iniciar pagamento. Verifique os dados e tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        ⏳ Carregando dados do pagamento...
      </div>
    );
  }

  if (!link) {
    return (
      <div className="p-6 text-center text-red-600">
        ❌ Link de pagamento inválido ou expirado.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-sm mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">{link.title}</h1>
        <p className="text-gray-700 mb-3">{link.description}</p>

        <p className="text-lg text-green-600 font-semibold mb-4">
          💰 Valor: Kz {parseFloat(link.amount).toLocaleString()}
        </p>

        {/* Campos do cliente */}
        <input
          type="text"
          placeholder="Seu nome completo"
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Seu e-mail"
          value={emailCliente}
          onChange={(e) => setEmailCliente(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="tel"
          placeholder="WhatsApp (com indicativo)"
          value={whatsappCliente}
          onChange={(e) => setWhatsappCliente(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          onClick={iniciarPagamento}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition duration-200"
        >
          💳 Pagar com Multicaixa Express
        </button>
      </div>
    </div>
  );
}
