import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UserRow {
  id: string;
  full_name: string;
  email: string | null;
  age: number | null;
  book_code: string | null;
  activated_at: string | null;
  created_at: string;
  chapters_completed?: number;
  total_coins?: number;
}

export default function BookFounderDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, activated: 0, totalCoins: 0 });
  const [codeStats, setCodeStats] = useState<{ code: string; edition: string; use_count: number; max_uses: number } | null>(null);

  useEffect(() => {
    checkFounder();
  }, []);

  const checkFounder = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "kidsinbusinessgr@gmail.com") {
      navigate("/book");
      return;
    }
    loadData();
  };

  const loadData = async () => {
    setLoading(true);

    const { data: profiles, error: profilesError } = await supabase
      .from("user_profiles" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      setError("Σφάλμα φόρτωσης δεδομένων.");
      setLoading(false);
      return;
    }

    const { data: progressData } = await supabase
      .from("book_progress" as any)
      .select("user_id, completed, coins_earned");

    const enriched = (profiles || []).map((p: any) => {
      const userProgress = (progressData || []).filter((pr: any) => pr.user_id === p.id);
      return {
        ...p,
        chapters_completed: userProgress.filter((pr: any) => pr.completed).length,
        total_coins: userProgress.reduce((s: number, pr: any) => s + (pr.coins_earned || 0), 0),
      };
    });

    setUsers(enriched);
    setStats({
      total: enriched.length,
      activated: enriched.filter((u: any) => u.book_code).length,
      totalCoins: enriched.reduce((s: number, u: any) => s + (u.total_coins || 0), 0),
    });

    const { data: codeData } = await supabase
      .from("book_codes" as any)
      .select("code, edition, use_count, max_uses")
      .single();
    if (codeData) setCodeStats(codeData as any);

    setLoading(false);
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const exportToCSV = () => {
    const headers = ["Όνομα παιδιού", "Email γονέα", "Ηλικία", "Ημ. Εγγραφής", "Ενεργοποιημένο", "Ημ. Ενεργοποίησης", "Κεφάλαια", "Νομίσματα"];
    const rows = users.map(u => [
      u.full_name,
      u.email || "—",
      u.age || "—",
      formatDate(u.created_at),
      u.book_code ? "ΝΑΙ" : "ΟΧΙ",
      formatDate(u.activated_at),
      u.chapters_completed || 0,
      u.total_coins || 0,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

        const doExport = (XLSX: any) => {
      const data = rows.map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      XLSX.writeFile(wb, `mikroi-ependytes-${new Date().toISOString().slice(0,10)}.xlsx`);
    };
    if ((window as any).XLSX) { doExport((window as any).XLSX); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = () => doExport((window as any).XLSX);
    document.head.appendChild(s);
  };;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-gray-800">📊 Dashboard Ιδρύτριας</h1>
            <p className="text-xs text-gray-500">Αρνιθενού Σταυρούλα • Μικροί Επενδυτές, Μεγάλο Μέλλον</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              📥 Export Excel
            </button>
            <button onClick={() => navigate("/book")} className="text-sm text-gray-500 hover:text-gray-700">
              ← Πίσω
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Φόρτωση...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">{error}</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
                <div className="text-sm text-gray-500 mt-1">Εγγεγραμμένοι</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="text-3xl font-bold text-green-600">{stats.activated}</div>
                <div className="text-sm text-gray-500 mt-1">Ενεργοποιημένοι</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="text-3xl font-bold text-yellow-600">{stats.totalCoins}</div>
                <div className="text-sm text-gray-500 mt-1">Συνολικά νομίσματα</div>
              </div>
              {codeStats && (
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="text-3xl font-bold text-blue-600">{codeStats.use_count}</div>
                  <div className="text-sm text-gray-500 mt-1">Χρήσεις κωδικού</div>
                  <div className="text-xs text-gray-400">/ {codeStats.max_uses} max</div>
                </div>
              )}
            </div>

            {/* Users table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">👥 Χρήστες ({users.length})</h2>
                <button onClick={loadData} className="text-sm text-purple-600 hover:underline">
                  🔄 Ανανέωση
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Όνομα παιδιού</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Email γονέα</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Ηλικία</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Εγγραφή</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Κωδικός</th>
                      <th className="text-right px-4 py-2 text-gray-600 font-medium">Κεφάλαια</th>
                      <th className="text-right px-4 py-2 text-gray-600 font-medium">Νομίσματα</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-medium text-gray-800">{u.full_name}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{u.email || <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-3 text-gray-500">{u.age || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(u.created_at)}</td>
                        <td className="px-4 py-3">
                          {u.book_code ? (
                            <span className="text-green-600 text-xs font-medium">✅ {formatDate(u.activated_at)}</span>
                          ) : (
                            <span className="text-gray-400 text-xs">Εκκρεμεί</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold text-purple-600">{u.chapters_completed}</span>
                          <span className="text-gray-400"> / 16</span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-yellow-600">🪙 {u.total_coins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-10 text-gray-400">Δεν υπάρχουν εγγεγραμμένοι χρήστες ακόμα.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
