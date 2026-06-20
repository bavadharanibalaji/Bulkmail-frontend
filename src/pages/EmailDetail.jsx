import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmailById } from "../utils/api";
import Navbar from "../components/Navbar";

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmailById(id)
      .then((data) => { setEmail(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className=" font-serif  bg-[#b2baef] min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-3">📧</div>
          <p className="text-gray-500">Loading email details...</p>
        </div>
      </div>
    </>
  );

  if (!email) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500">Email not found</p>
          <button onClick={() => navigate("/history")} className="mt-4 text-indigo-600 hover:underline">
            Back to History
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate("/history")}
            className="mb-6 text-indigo-600 hover:underline flex items-center gap-1 font-medium"
          >
            ← Back to History
          </button>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-800 mb-1">{email.subject}</h1>
                <p className="text-gray-500 text-sm">
                  Sent on {new Date(email.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                email.status === "sent"
                  ? "bg-green-100 text-green-700"
                  : email.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {email.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{email.recipients.length}</p>
                <p className="text-sm text-gray-500">Total Recipients</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{email.successCount}</p>
                <p className="text-sm text-gray-500">Successfully Sent</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{email.failCount}</p>
                <p className="text-sm text-gray-500">Failed</p>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-700 mb-4">📝 Email Body</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
              {email.body}
            </div>
          </div>

          {/* Recipients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-700 mb-4">
              👥 All Recipients ({email.recipients.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {email.recipients.map((r) => (
                <span
                  key={r}
                  className={`text-sm px-3 py-1 rounded-full ${
                    email.failedEmails?.includes(r)
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {email.failedEmails?.includes(r) ? "❌" : "✅"} {r}
                </span>
              ))}
            </div>
          </div>

          {/* Failed Emails */}
          {email.failedEmails?.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-100 p-6">
              <h2 className="font-bold text-red-700 mb-4">
                ❌ Failed Emails ({email.failedEmails.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {email.failedEmails.map((r) => (
                  <span key={r} className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailDetail;
