import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendBulkEmail } from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const Compose = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: "", body: "" });
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const addRecipient = () => {
    const emails = recipientInput
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter((e) => e);

    const valid = [];
    const invalid = [];

    emails.forEach((email) => {
      if (validateEmail(email)) {
        if (!recipients.includes(email)) valid.push(email);
      } else {
        invalid.push(email);
      }
    });

    if (valid.length > 0) {
      setRecipients((prev) => [...prev, ...valid]);
      toast.success(`${valid.length} recipient(s) added!`);
    }
    if (invalid.length > 0) {
      toast.error(`Invalid emails: ${invalid.join(", ")}`);
    }
    setRecipientInput("");
  };

  const removeRecipient = (email) => {
    setRecipients((prev) => prev.filter((e) => e !== email));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addRecipient();
    }
  };

  const validate = () => {
    let e = {};
    if (!form.subject) e.subject = "Subject is required";
    if (!form.body) e.body = "Email body is required";
    if (recipients.length === 0) e.recipients = "Add at least one recipient";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      setLoading(true);
      const data = await sendBulkEmail({
        subject: form.subject,
        body: form.body,
        recipients,
      });
      setResult(data);
      toast.success(`${data.successCount} emails sent successfully!`);
    } catch (err) {
      toast.error("Failed to send emails. Check your Gmail credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ subject: "", body: "" });
    setRecipients([]);
    setRecipientInput("");
    setResult(null);
    setErrors({});
  };

  return (
    <>
      <Navbar />
      <div className=" font-serif  bg-[#b2baef] min-h-scree p-6">
        <div className="max-w-4xl mx-auto">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">✉️ Compose Bulk Email</h1>
            <p className="text-gray-500 mt-1">Send emails to multiple recipients at once</p>
          </div>

          {/* Success Result */}
          {result && (
            <div className={`mb-6 rounded-xl p-6 border ${
              result.status === "sent"
                ? "bg-green-50 border-green-200"
                : result.status === "failed"
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}>
              <h3 className="text-lg font-bold mb-3">
                {result.status === "sent" ? "✅ All Emails Sent!" :
                 result.status === "failed" ? "❌ All Emails Failed!" :
                 "⚠️ Partially Sent!"}
              </h3>
              <div className="flex gap-6 mb-3">
                <p className="text-green-700 font-semibold">
                  ✅ Success: {result.successCount}
                </p>
                <p className="text-red-600 font-semibold">
                  ❌ Failed: {result.failCount}
                </p>
              </div>
              {result.failedEmails?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Failed emails:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.failedEmails.map((e) => (
                      <span key={e} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleReset}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Send Another Email
                </button>
                <button
                  onClick={() => navigate("/history")}
                  className="bg-white text-gray-700 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  View History
                </button>
              </div>
            </div>
          )}

          {!result && (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Subject */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📌 Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter email subject..."
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              {/* Recipients */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👥 Recipients ({recipients.length} added)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Enter email(s) separated by comma or space..."
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Press Enter or comma to add. You can paste multiple emails at once.
                </p>

                {errors.recipients && (
                  <p className="text-red-500 text-xs mb-2">{errors.recipients}</p>
                )}

                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                    {recipients.map((email) => (
                      <span
                        key={email}
                        className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeRecipient(email)}
                          className="ml-1 text-indigo-400 hover:text-red-500 transition font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {recipients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRecipients([])}
                    className="mt-2 text-xs text-red-500 hover:underline"
                  >
                    Clear all recipients
                  </button>
                )}
              </div>

              {/* Email Body */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Email Body
                </label>
                <textarea
                  placeholder="Write your email content here..."
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {form.body.length} characters
                </p>
              </div>

              {/* Summary */}
              {recipients.length > 0 && form.subject && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <h3 className="font-semibold text-indigo-800 mb-2">📋 Summary</h3>
                  <p className="text-sm text-indigo-700">
                    Subject: <span className="font-medium">{form.subject}</span>
                  </p>
                  <p className="text-sm text-indigo-700">
                    Recipients: <span className="font-medium">{recipients.length} emails</span>
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending {recipients.length} emails...
                  </>
                ) : (
                  <>📤 Send to {recipients.length} Recipient{recipients.length !== 1 ? "s" : ""}</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Compose;
