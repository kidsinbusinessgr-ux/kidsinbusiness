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
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: "https://app.kidsinbusiness.gr/activate",
      },
    });

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "Υπάρχει ήδη λογαριασμός με αυτό το email. Δοκίμασε σύνδεση."
          : signUpError.message
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      // Save profile
      await supabase.from("user_profiles" as any).insert({
        id: data.user.id,
        full_name: fullName.trim(),
        age: age ? parseInt(age) : null,
        email: email.trim(),
      });

      if (!data.session) {
        // Email confirmation required — show success message
        setEmailSent(true);
        setLoading(false);
        return;
      }
      // No confirmation needed — go straight to activation
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

  // ✅ Email sent screen
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="text-7xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Έλεγξε το email σου!</h1>
          <p className="text-gray-500 mb-6">
            Στείλαμε σύνδεσμο επιβεβαίωσης στο <strong>{email}</strong>.<br />
            Άνοιξέ το email και κάνε κλικ στον σύνδεσμο για να συνεχίσεις.
          </p>
          <div className="bg-white rounded-2xl shadow p-5 text-left text-sm text-gray-600 mb-6">
            <p className="font-semibold text-gray-700 mb-2">📌 Τι να κάνεις:</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Άνοιξε το email από <strong>noreply@mail.app.supabase.io</strong></li>
              <li>Κάνε κλικ στο κουμπί <strong>«Επιβεβαίωση»</strong></li>
              <li>Θα μπεις αυτόματα στην πλατφόρμα!</li>
            </ol>
          </div>
          <button
            onClick={() => { setEmailSent(false); setMode("login"); }}
            className="text-purple-600 text-sm hover:underline"
          >
            Επιστροφή στη σύνδεση →
          </button>
        </div>
      </div>
    );
  }

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
                mode === "register" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Νέα Εγγραφή
            </button>
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "login" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Σύνδεση
            </button>
          </div>

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
                    Ηλικία παιδιού <span className="text-gray-400">(προαιρετικό)</span>
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
                Email γονέα <span className="text-red-500">*</span>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Τουλάχιστον 6 χαρακτήρες"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
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
              {loading ? "Φόρτωση..." : mode === "register" ? "🚀 Εγγραφή" : "✨ Σύνδεση"}
            </button>
          </div>

          {mode === "register" && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Τα 3 πρώτα κεφάλαια είναι δωρεάν.<br />
              Με τον κωδικό του βιβλίου ξεκλειδώνουν όλα!
            </p>
          )}
        </div>

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
