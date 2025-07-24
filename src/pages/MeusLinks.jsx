import React, { useEffect, useState } from "react";
import axios from "axios";
import CriarLink from "../components/CriarLink";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MeusLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;
  const SITE_URL = import.meta.env.VITE_BASE_SITE;  // agora usa VITE_BASE_SITE
  const token    = localStorage.getItem("token");

  const fetchLinks = async (pagina = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/links/me?page=${pagina}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLinks(res.data.links || []);
      setPage(res.data.page || pagina);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Erro ao buscar links:", error);
      toast.error("Erro ao buscar seus links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks(1);
  }, []);

  const deletarLink = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este link?")) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/links/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLinks(page);
      toast.success("Link excluído!");
    } catch (err) {
      console.error("Erro ao excluir link:", err);
      toast.error("Erro ao excluir link.");
    }
  };

  const editarLink = async (link) => {
    const novoTitulo = prompt("Novo título:", link.title);
    const novoValor  = prompt("Novo valor:", link.amount);
    if (!novoTitulo || !novoValor) return;

    try {
      const res = await axios.put(
        `${BASE_URL}/api/links/${link._id}`,
        { title: novoTitulo, amount: parseFloat(novoValor) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLinks((lst) =>
        lst.map((l) => (l._id === link._id ? res.data.link : l))
      );
      toast.success("Link atualizado!");
    } catch (err) {
      console.error("Erro ao atualizar link:", err);
      toast.error("Erro ao atualizar link.");
    }
  };

  const totalRecebido = links.reduce((acc, l) => acc + (l.recebidoLiquido || 0), 0);
  const totalValor    = links.reduce((acc, l) => acc + (l.amount || 0), 0);
  const totalComissao = totalValor - totalRecebido;

  const linksFiltrados = links.filter((link) => {
    const correspondeBusca  = link.title.toLowerCase().includes(busca.toLowerCase());
    const correspondeStatus = filtroStatus === "" || link.status === filtroStatus;
    return correspondeBusca && correspondeStatus;
  });

  const corStatus = {
    aguardando: "text-yellow-600",
    pago:       "text-green-600",
    expirado:   "text-red-600",
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">🔄 Carregando seus links...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">💼 Meus Links de Pagamento</h1>

      <CriarLink onLinkCriado={() => fetchLinks(page)} />

      {/* Filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="🔍 Buscar por título"
          className="border px-4 py-2 rounded w-full md:w-1/2 focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="pago">Pago</option>
          <option value="expirado">Expirado</option>
        </select>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-600 p-5 rounded-xl text-white">
          <p className="text-sm">Total em Links</p>
          <p className="text-2xl font-bold">Kz {totalValor.toLocaleString()}</p>
        </div>
        <div className="bg-green-600 p-5 rounded-xl text-white">
          <p className="text-sm">Recebido Líquido</p>
          <p className="text-2xl font-bold">Kz {totalRecebido.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-500 p-5 rounded-xl text-white">
          <p className="text-sm">Taxa da Plataforma</p>
          <p className="text-2xl font-bold">Kz {totalComissao.toLocaleString()}</p>
        </div>
      </div>

      {/* Lista de Links */}
      {linksFiltrados.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          Nenhum link encontrado com os filtros atuais.
        </p>
      ) : (
        <div className="space-y-6">
          {linksFiltrados.map((link) => {
            const urlDoLink = `${SITE_URL}/pagar/${link.slug}`;
            return (
              <div
                key={link._id}
                className="border rounded-xl shadow bg-white p-5 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {link.title}
                </h2>
                <p className="text-gray-700 mb-1">
                  💰 Valor: <strong>Kz {link.amount.toLocaleString()}</strong>
                </p>
                <p className="text-sm mb-1">
                  Status:{" "}
                  <span className={`font-medium ${corStatus[link.status]}`}>
                    {link.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Criado em: {new Date(link.createdAt).toLocaleString()}
                </p>

                {/* Compartilhamento */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(urlDoLink);
                      toast.success("✅ Link copiado com sucesso!");
                    }}
                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                  >
                    📋 Copiar
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      "Veja esse link de pagamento: " + urlDoLink
                    )}`}
                    target="_blank"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${urlDoLink}`}
                    target="_blank"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${urlDoLink}`}
                    target="_blank"
                    className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Telegram
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=Link%20de%20pagamento:%20${urlDoLink}`}
                    target="_blank"
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Twitter
                  </a>
                </div>

                {/* QR Code */}
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-1">📱 QR Code:</p>
                  <QRCodeCanvas value={urlDoLink} size={100} />
                </div>

                {/* Ações */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editarLink(link)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deletarLink(link._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => fetchLinks(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            ⬅️ Anterior
          </button>
          <span className="text-gray-600 font-medium">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => fetchLinks(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Próxima ➡️
          </button>
        </div>
      )}
    </div>
  );
}
