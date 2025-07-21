import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api"; // seu axios configurado
import { toast } from "react-toastify";

export default function PublicPaymentPage() {
  const { slug } = useParams();
  const [link, setLink] = useState(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [whatsappCliente, setWhatsappCliente] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const { data } = await api.get(`/publico/link/${slug}`);
        setLink(data);
      } catch (err) {
        toast.error("Link inválido ou expirado");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [slug]);

  const handlePagar = async () => {
    if (!nomeCliente || !emailCliente || !whatsappCliente) {
      toast.warning("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const pagamento = {
        nomeCliente,
        emailCliente,
        whatsappCliente,
        valor: link.valor,
        referencia: link.referencia,
        callbackUrl: `${window.location.origin}/obrigado`,
        cssUrl: `${window.location.origin}/estilo.css`,
        productName: link.title || "Pagamento LinkPay",
      };

      const { data } = await api.post("/api/payment/solicitar-token", pagamento);
      if (data?.id) {
        window.location.href = `https://pagamentonline.emis.co.ao/webframe?frameToken=${data.id}`;
      } else {
        toast.error("Erro ao gerar link de pagamento");
      }
    } catch (err) {
      toast.error("Erro ao iniciar pagamento");
      console.error(err);
    }
  };

  if (carregando) return <p className="text-center p-6">Carregando pagamento...</p>;

  if (!link) return <p className="text-center text-red-600">Link não encontrado.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6 text-gray-800">
      <h2 className="text-2xl font-bold text-center mb-4">Pagar com LinkPay</h2>
      <p className="text-center text-gray-500 mb-4">Pagando para: <strong>{link.nomeVendedor}</strong></p>
      <div className="mb-4">
        <p><strong>Descrição:</strong> {link.title}</p>
        <p><strong>Valor:</strong> Kz {link.valor?.toLocaleString("pt-AO")}</p>
        <p><strong>Referência:</strong> {link.referencia}</p>
      </div>

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
        placeholder="Seu WhatsApp (ex: 924123456)"
        value={whatsappCliente}
        onChange={(e) => setWhatsappCliente(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <button
        onClick={handlePagar}
        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded"
      >
        Pagar com Multicaixa Express
      </button>
    </div>
  );
}
