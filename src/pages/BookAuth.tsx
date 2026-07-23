import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Mode = "register" | "login";

export default function BookAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Συμπλήρωσε όλα τα υποχρεωτικά πεδία.");
      return;
    }
    if (password.length < 6) {
      setError("Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 6 χαρακτήρες.");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    if (signUpError) {
      setError(signUpError.message === "User already registered"
        ? "Υπάρχει ήδη λογαριασμός με αυτό το email. Δοκίμασε σύνδεση."
        : signUpError.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      // Insert user profile
      await supabase.from("user_profiles" as any).insert({
        id: data.user.id,
        full_name: fullName.trim(),
        age: age ? parseInt(age) : null,
      });
      navigate("/activate");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Συμπλήρωσε email και κωδικό.");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (loginError) {
      setError("Λανθασμένο email ή κωδικός. Δοκίμασε ξανά.");
      setLoading(false);
      return;
    }
    if (data.user) {
      // Check if already activated
      const { data: profile } = await supabase
        .from("user_profiles" as any)
        .select("book_code")
        .eq("id", data.user.id)
        .single();
      if (profile && (profile as any).book_code) {
        navigate("/book");
      } else {
        navigate("/activate");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-gray-800">Μικροί Επενδυτές</h1>
          <p className="text-gray-500 text-sm mt-1">Μεγάλο Μέλλον</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-white shadow text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Νέα Εγγραφή
            </button>
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-white shadow text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Σύνδεση
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Όνομα παιδιού <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="π.χ. Αλέξανδρος"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ηλικία <span className="text-gray-400">(προαιρετικό)</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="π.χ. 10"
                    min="6"
                    max="18"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Κωδικός πρόσβασης <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Τουλάχιστον 6 χαρακτήρες"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={mode === "register" ? handleRegister : handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {loading
                ? "Φόρτωση..."
                : mode === "register"
                ? "🚀 Εγγραφή"
                : "✨ Σύνδεση"}
            </button>
          </div>

          {/* Free chapters note */}
          {mode === "register" && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Τα 3 πρώτα κεφάλαια είναι δωρεάν για όλους.<br />
              Με τον κωδικό του βιβλίου ξεκλειδώνουν όλα!
            </p>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/book")}
          className="w-full mt-4 text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          ← Πίσω στο βιβλίο
        </button>
      </div>
    </div>
  );
}
