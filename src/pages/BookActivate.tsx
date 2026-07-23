import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function BookActivate() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/book-login");
      return;
    }
    // Already activated?
    const { data: profile } = await supabase
      .from("user_profiles" as any)
      .select("full_name, book_code")
      .eq("id", user.id)
      .single();
    if (profile) {
      setUserName((profile as any).full_name || "");
      if ((profile as any).book_code) {
        navigate("/book");
      }
    }
  };

  const handleActivate = async () => {
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) {
      setError("Γράψε τον κωδικό του βιβλίου σου.");
      return;
    }
    setLoading(true);
    setError("");

    // Check code exists
    const { data: codeRows, error: codeError } = await supabase
      .from("book_codes" as any)
      .select("code, edition, max_uses, use_count")
      .eq("code", trimmed);

    if (codeError || !codeRows || codeRows.length === 0) {
      setError("Ο κωδικός δεν βρέθηκε. Έλεγξε ότι τον έγραψες σωστά.");
      setLoading(false);
      return;
    }

    const codeData = codeRows[0] as any;

    if (codeData.use_count >= codeData.max_uses) {
      setError("Αυτός ο κωδικός έχει φτάσει τον μέγιστο αριθμό χρήσεων.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/book-login");
      return;
    }

    // Update user profile
    await supabase
      .from("user_profiles" as any)
      .update({ book_code: trimmed, activated_at: new Date().toISOString() })
      .eq("id", user.id);

    // Increment use count
    await supabase
      .from("book_codes" as any)
      .update({ use_count: codeData.use_count + 1 })
      .eq("code", trimmed);

    setLoading(false);
    navigate("/book");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {userName ? `Γεια σου, ${userName}!` : "Ξεκλείδωσε το βιβλίο!"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Βρες τον κωδικό στο εσωτερικό εξώφυλλο του βιβλίου σου
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-800 text-center">
            📖 Ο κωδικός βρίσκεται στην <strong>πρώτη σελίδα</strong> του βιβλίου σου
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Κωδικός βιβλίου
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                placeholder="Γράψε τον κωδικό σου"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-300"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleActivate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Ελέγχω τον κωδικό..." : "🚀 Ξεκλείδωσε τώρα!"}
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-2">
              Θέλεις να δεις πρώτα τα δωρεάν κεφάλαια;
            </p>
            <button
              onClick={() => navigate("/book")}
              className="text-purple-600 text-sm hover:underline"
            >
              Πήγαινε στο βιβλίο →
            </button>
          </div>
        </div>

        <button
          onClick={async () => { await supabase.auth.signOut(); navigate("/book-login"); }}
          className="w-full mt-4 text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          Αποσύνδεση
        </button>
      </div>
    </div>
  );
}
