import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getEmailHistory } from "../utils/api";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmailHistory()
      .then((data) => { setEmails(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalSent = emails.reduce((acc, e) => acc + e.successCount, 0);
  const totalFailed = emails.reduce((acc, e) => acc + e.failCount, 0);
  const totalCampaigns = emails.length;

  return (
    <>
      <Navbar />
      <div className="font-serif  bg-[#b2baef] min-h-screen p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              👋 Welcome, {user?.name}!
            </h1>
            <p className="text-gray-900 mt-1">Here's your email campaign overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm font-medium">Total Campaigns</p>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-3xl font-bold text-indigo-600">{totalCampaigns}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm font-medium">Emails Sent</p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{totalSent}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm font-medium">Emails Failed</p>
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-3xl font-bold text-red-500">{totalFailed}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm font-medium">Success Rate</p>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {totalSent + totalFailed > 0
                  ? Math.round((totalSent / (totalSent + totalFailed)) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              onClick={() => navigate("/compose")}
              className="bg-indigo-600 rounded-xl p-6 cursor-pointer hover:bg-indigo-700 transition text-white"
            >
              <div className="text-4xl mb-3">✉️</div>
              <h3 className="text-xl font-bold mb-1">Send Bulk Email</h3>
              <p className="text-indigo-200 text-sm">
                Compose and send emails to multiple recipients at once
              </p>
            </div>

            <div
              onClick={() => navigate("/history")}
              className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-md transition border border-gray-100"
            >
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Email History</h3>
              <p className="text-gray-500 text-sm">
                View all your previously sent email campaigns
              </p>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Recent Campaigns</h2>
              <button
                onClick={() => navigate("/history")}
                className="text-indigo-600 text-sm hover:underline font-medium"
              >
                View All →
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500">No campaigns yet!</p>
                <button
                  onClick={() => navigate("/compose")}
                  className="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                  Send First Email
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {emails.slice(0, 5).map((email) => (
                  <div
                    key={email._id}
                    onClick={() => navigate(`/history/${email._id}`)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 cursor-pointer transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{email.subject}</p>
                      <p className="text-sm text-gray-500">
                        {email.recipients.length} recipients •{" "}
                        {new Date(email.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-600 font-medium">
                        ✅ {email.successCount}
                      </span>
                      {email.failCount > 0 && (
                        <span className="text-sm text-red-500 font-medium">
                          ❌ {email.failCount}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        email.status === "sent"
                          ? "bg-green-100 text-green-700"
                          : email.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {email.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
