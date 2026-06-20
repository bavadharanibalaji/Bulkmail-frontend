import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmailHistory, deleteEmail } from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const History = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getEmailHistory()
      .then((data) => { setEmails(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this email record?")) return;
    try {
      await deleteEmail(id);
      setEmails((prev) => prev.filter((e) => e._id !== id));
      toast.success("Email record deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = emails.filter((e) => {
    const matchSearch = e.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-serif  bg-[#b2baef] p-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">📋 Email History</h1>
              <p className="text-gray-500 mt-1">{emails.length} campaigns total</p>
            </div>
            <button
              onClick={() => navigate("/compose")}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              + New Campaign
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
            <div className="flex gap-2">
              {["all", "sent", "partial", "failed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                    filter === f
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 text-lg">No email records found</p>
                <button
                  onClick={() => navigate("/compose")}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                  Send First Email
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Recipients</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Success</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Failed</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((email) => (
                    <tr key={email._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800 truncate max-w-xs">
                          {email.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {email.recipients.length}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-semibold text-sm">
                          ✅ {email.successCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-red-500 font-semibold text-sm">
                          {email.failCount > 0 ? `❌ ${email.failCount}` : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          email.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : email.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {email.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(email.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/history/${email._id}`)}
                            className="text-indigo-600 hover:underline text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(email._id)}
                            className="text-red-500 hover:underline text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
