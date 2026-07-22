import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSessionByCode, getPlayer, getMyCompany, getAllCompanies, getPlayers,
  upsertCompany, buyShares, getMyShareholdings, enterSalesAndCalculate, advanceRound
} from "@/lib/gameService";
import type { GameSession as GS, GamePlayer, GameCompany, GameShareholding } from "@/types/game";
import { ROUND_NAMES, COMPANY_COLORS } from "@/types/game";
import { Coins, TrendingUp, Users, Trophy, RefreshCw, ChevronRight } from "lucide-react";

type LocalGame = { playerId: string; nickname: string; isTeacher: boolean };

export default function GameSession() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [local, setLocal] = useState<LocalGame | null>(null);
  const [session, setSession] = useState<GS | null>(null);
  const [player, setPlayer] = useState<GamePlayer | null>(null);
  const [myCompany, setMyCompany] = useState<GameCompany | null>(null);
  const [allCompanies, setAllCompanies] = useState<GameCompany[]>([]);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [holdings, setHoldings] = useState<GameShareholding[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("company");

  // Company form state
  const [form, setForm] = useState({
    name: "", description: "", product_name: "", product_price: 100,
    emoji: "🚀", color: COMPANY_COLORS[0].value,
    pitch_text: "", ad_text: "",
    share_price: 100, shares_for_sale: 5,
    cost_operational: 0, cost_marketing: 0, cost_staff: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Buy shares state
  const [buyQty, setBuyQty] = useState<Record<string, number>>({});
  const [buyMsg, setBuyMsg] = useState<Record<string, string>>({});

  // Teacher sales state
  const [salesInput, setSalesInput] = useState<Record<string, string>>({});
  const [salesMsg, setSalesMsg] = useState("");
  const [advanceError, setAdvanceError] = useState("");

  const loadData = useCallback(async () => {
    if (!code) return;
    const localRaw = localStorage.getItem(`game_player_${code}`);
    if (!localRaw) { navigate("/game"); return; }
    const loc: LocalGame = JSON.parse(localRaw);
    setLocal(loc);

    const sess = await getSessionByCode(code);
    if (!sess) { navigate("/game"); return; }
    setSession(sess);

    if (!loc.isTeacher) {
      const p = await getPlayer(loc.playerId);
      if (p) {
        setPlayer(p);
        const company = await getMyCompany(sess.id, p.id);
        if (company) {
          setMyCompany(company);
          setForm(f => ({ ...f, ...company }));
        }
        const h = await getMyShareholdings(p.id);
        setHoldings(h);
      }
    }

    const [companies, pls] = await Promise.all([
      getAllCompanies(sess.id),
      getPlayers(sess.id),
    ]);
    setAllCompanies(companies);
    setPlayers(pls);
    setLoading(false);
  }, [code, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Save company ──────────────────────────────────────────────────────
  const saveCompany = async () => {
    if (!session || !player) return;
    setSaving(true); setSaveMsg("");
    try {
      const saved = await upsertCompany({ ...form, session_id: session.id, player_id: player.id });
      setMyCompany(saved);
      setSaveMsg("✅ Αποθηκεύτηκε!");
    } catch (e: any) { setSaveMsg("❌ " + e.message); }
    setSaving(false);
  };

  // ── Buy shares ────────────────────────────────────────────────────────
  const handleBuy = async (company: GameCompany) => {
    if (!player || !session) return;
    const qty = buyQty[company.id] || 1;
    setBuyMsg(m => ({ ...m, [company.id]: "" }));
    try {
      await buyShares(company.id, player.id, qty, company.share_price, session.id, company.name);
      setBuyMsg(m => ({ ...m, [company.id]: `✅ Αγόρασες ${qty} μερίδια!` }));
      await loadData();
    } catch (e: any) {
      setBuyMsg(m => ({ ...m, [company.id]: "❌ " + e.message }));
    }
  };

  // ── Teacher: enter sales ──────────────────────────────────────────────
  const handleEnterSales = async () => {
    if (!session) return;
    setSalesMsg("⏳ Υπολογισμός...");
    try {
      for (const company of allCompanies) {
        const units = parseInt(salesInput[company.id] || "0");
        await enterSalesAndCalculate(company, units);
      }
      setSalesMsg("✅ Πωλήσεις καταχωρήθηκαν & μερίσματα μοιράστηκαν!");
      await loadData();
    } catch (e: any) { setSalesMsg("❌ " + e.message); }
  };

  const handleAdvanceRound = async () => {
    if (!session) return;
    setAdvanceError("");
    try {
      await advanceRound(session.id, session.current_round + 1);
      await loadData();
    } catch (e: any) {
      setAdvanceError("❌ " + (e.message || "Σφάλμα κατά την αλλαγή γύρου"));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-4xl animate-spin">🏦</div>
        <p className="text-muted-foreground">Φόρτωση παιχνιδιού...</p>
      </div>
    </div>
  );

  if (!session || !local) return null;

  const round = session.current_round;
  const roundInfo = ROUND_NAMES[round];
  const isTeacher = local.isTeacher;
  const totalCoins = player ? player.coins + holdings.reduce((s, h) => s + h.coins_invested, 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* Top bar */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏦</span>
            <div>
              <div className="font-bold text-sm">{session.title}</div>
              <div className="text-xs text-muted-foreground">Κωδικός: <span className="font-mono font-bold text-primary">{code}</span></div>
            </div>
          </div>

          {/* Round badge */}
          <Badge className="bg-primary text-white px-3 py-1 text-xs">
            {roundInfo.icon} {roundInfo.el}
          </Badge>

          {/* Player coins / teacher label */}
          {!isTeacher && player && (
            <div className="flex items-center gap-1.5 bg-yellow-100 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-800">{Math.round(player.coins).toLocaleString()} 🪙</span>
            </div>
          )}
          {isTeacher && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">👩‍🏫 Εκπαιδευτικός</Badge>
              {session.current_round < 4 && (
                <Button size="sm" onClick={handleAdvanceRound} className="text-xs h-7 gap-1">
                  Γύρος {session.current_round + 1} <ChevronRight className="w-3 h-3" />
                </Button>
              )}
              {advanceError && <span className="text-xs text-red-500">{advanceError}</span>}
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Round info banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-sm text-primary font-medium">
        {roundInfo.icon} Round {round}/4 — {roundInfo.description_el}
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="company">🏗️ Εταιρία</TabsTrigger>
            <TabsTrigger value="market">📊 Αγορά</TabsTrigger>
            <TabsTrigger value="portfolio">💼 Χαρτ/κιο</TabsTrigger>
            <TabsTrigger value="leaderboard">🏆 Ranking</TabsTrigger>
          </TabsList>

          {/* ── COMPANY TAB ─────────────────────────────────────────── */}
          <TabsContent value="company">
            {isTeacher ? (
              <TeacherRoundPanel
                session={session}
                allCompanies={allCompanies}
                players={players}
                salesInput={salesInput}
                setSalesInput={setSalesInput}
                salesMsg={salesMsg}
                onEnterSales={handleEnterSales}
                onAdvance={handleAdvanceRound}
              />
            ) : (
              <CompanyForm
                form={form}
                setForm={setForm}
                onSave={saveCompany}
                saving={saving}
                saveMsg={saveMsg}
                round={round}
                myCompany={myCompany}
              />
            )}
          </TabsContent>

          {/* ── MARKET TAB ──────────────────────────────────────────── */}
          <TabsContent value="market">
            <div className="space-y-4">
              <h2 className="font-bold text-lg">📊 Αγορά Μεριδίων</h2>
              {round < 2 && (
                <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground">
                  Η αγορά ανοίγει στο Round 2 (Pitch & Επενδύσεις).
                </div>
              )}
              {round >= 2 && allCompanies.filter(c => !isTeacher && player ? c.player_id !== player.id : true).map(company => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  player={player}
                  round={round}
                  buyQty={buyQty[company.id] || 1}
                  setBuyQty={(v) => setBuyQty(q => ({ ...q, [company.id]: v }))}
                  onBuy={() => handleBuy(company)}
                  buyMsg={buyMsg[company.id] || ""}
                  holdings={holdings}
                />
              ))}
            </div>
          </TabsContent>

          {/* ── PORTFOLIO TAB ────────────────────────────────────────── */}
          <TabsContent value="portfolio">
            {isTeacher ? (
              <div className="text-center text-muted-foreground py-10">Το χαρτοφυλάκιο εμφανίζεται για τους μαθητές.</div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">💼 Χαρτοφυλάκιό μου</h2>
                {/* Cash */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-6 h-6 text-yellow-500" />
                      <span className="font-semibold">Διαθέσιμα Coins</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-700">{Math.round(player?.coins || 0).toLocaleString()} 🪙</span>
                  </CardContent>
                </Card>

                {/* My company performance */}
                {myCompany && round >= 3 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader><CardTitle className="text-base">📈 Απόδοση Εταιρίας μου</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                      <Stat label="Πωλήσεις" value={`${myCompany.units_sold} τεμ.`} />
                      <Stat label="Έσοδα" value={`${myCompany.revenue.toLocaleString()} 🪙`} />
                      <Stat label="Έξοδα" value={`${myCompany.total_costs.toLocaleString()} 🪙`} />
                      <Stat label="Κέρδος" value={`${Math.round(myCompany.net_profit).toLocaleString()} 🪙`} color={myCompany.net_profit >= 0 ? "text-green-600" : "text-red-500"} />
                    </CardContent>
                  </Card>
                )}

                {/* Holdings */}
                {holdings.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">ΜΕΡΙΔΙΑ ΠΟΥ ΕΧΕΙΣ</h3>
                    <div className="space-y-2">
                      {holdings.map(h => (
                        <Card key={h.id} className="border">
                          <CardContent className="pt-3 pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{(h.company as any)?.name || "Εταιρία"}</div>
                                <div className="text-xs text-muted-foreground">{h.shares_owned} μερίδια · Επένδυσα {h.coins_invested.toLocaleString()} 🪙</div>
                              </div>
                              {h.dividends_received > 0 && (
                                <Badge className="bg-green-100 text-green-700">
                                  +{Math.round(h.dividends_received).toLocaleString()} 🪙 μέρισμα
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {holdings.length === 0 && round >= 2 && (
                  <div className="text-center text-muted-foreground py-6 text-sm">
                    Δεν έχεις αγοράσει μερίδια ακόμα. Πήγαινε στην καρτέλα Αγορά!
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* ── LEADERBOARD TAB ──────────────────────────────────────── */}
          <TabsContent value="leaderboard">
            <div className="space-y-3">
              <h2 className="font-bold text-lg">🏆 Leaderboard</h2>
              <p className="text-xs text-muted-foreground">Ταξινόμηση βάσει συνολικών coins (μετρητά + επενδύσεις).</p>
              {players.sort((a, b) => b.coins - a.coins).map((p, i) => {
                const company = allCompanies.find(c => c.player_id === p.id);
                return (
                  <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border bg-white ${i === 0 ? "border-yellow-300 bg-yellow-50" : ""}`}>
                    <span className="text-xl font-bold w-8 text-center">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className="text-lg">{company?.emoji || "👤"}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{p.nickname}</div>
                      {company && <div className="text-xs text-muted-foreground">{company.name}</div>}
                    </div>
                    <div className="font-bold text-yellow-700">{Math.round(p.coins).toLocaleString()} 🪙</div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Stat({ label, value, color = "" }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`font-bold ${color}`}>{value}</div>
    </div>
  );
}

function CompanyForm({ form, setForm, onSave, saving, saveMsg, round, myCompany }: any) {
  const locked = round > 1;
  const emojis = ["🚀","🍕","🎮","🌿","💡","🎨","🐾","📚","🎵","⚽","🌍","🤖","🍦","🏠","💊"];

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">🏗️ Η Εταιρία μου</h2>
      {locked && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        ⚠️ Το Round 1 έχει τελειώσει. Μπορείς να δεις τα στοιχεία αλλά όχι να αλλάξεις.
      </div>}

      <div className="grid grid-cols-1 gap-4">
        {/* Emoji & Color */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <Label className="font-semibold">Logo (Emoji)</Label>
            <div className="flex flex-wrap gap-2">
              {emojis.map(e => (
                <button key={e} disabled={locked}
                  onClick={() => setForm((f: any) => ({ ...f, emoji: e }))}
                  className={`text-2xl p-1.5 rounded-lg border-2 transition-all ${form.emoji === e ? "border-primary bg-primary/10 scale-110" : "border-transparent hover:border-gray-200"}`}>
                  {e}
                </button>
              ))}
            </div>
            <Label className="font-semibold">Χρώμα εταιρίας</Label>
            <div className="flex gap-2 flex-wrap">
              {COMPANY_COLORS.map(c => (
                <button key={c.value} disabled={locked}
                  onClick={() => setForm((f: any) => ({ ...f, color: c.value }))}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.value} border-2 transition-all ${form.color === c.value ? "border-gray-800 scale-110" : "border-transparent"}`} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Basic info */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div>
              <Label>Όνομα εταιρίας *</Label>
              <Input disabled={locked} value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="π.χ. GreenTech Kids" className="mt-1" />
            </div>
            <div>
              <Label>Τι προσφέρει η εταιρία σου;</Label>
              <Textarea disabled={locked} value={form.description || ""} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} placeholder="Περίγραψε σε 1-2 προτάσεις..." className="mt-1 min-h-[70px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Προϊόν/Υπηρεσία</Label>
                <Input disabled={locked} value={form.product_name || ""} onChange={e => setForm((f: any) => ({ ...f, product_name: e.target.value }))} placeholder="π.χ. Eco Bag" className="mt-1" />
              </div>
              <div>
                <Label>Τιμή (coins)</Label>
                <Input disabled={locked} type="number" min={1} value={form.product_price} onChange={e => setForm((f: any) => ({ ...f, product_price: +e.target.value }))} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pitch & Ad */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div>
              <Label>🎤 Pitch (60 δευτερόλεπτα — τι θα πεις;)</Label>
              <Textarea disabled={locked} value={form.pitch_text || ""} onChange={e => setForm((f: any) => ({ ...f, pitch_text: e.target.value }))} placeholder="Γεια! Η εταιρία μου λέγεται... Λύνουμε το πρόβλημα..." className="mt-1 min-h-[80px]" />
            </div>
            <div>
              <Label>📢 Διαφήμιση (σύντομο slogan / post)</Label>
              <Textarea disabled={locked} value={form.ad_text || ""} onChange={e => setForm((f: any) => ({ ...f, ad_text: e.target.value }))} placeholder="Το καλύτερο προϊόν για..." className="mt-1 min-h-[60px]" />
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">💰 ΕΞΟΔΑ (ανά γύρο πωλήσεων)</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "cost_operational", label: "🏢 Λειτουργικά" },
                { key: "cost_marketing", label: "📣 Μάρκετινγκ" },
                { key: "cost_staff", label: "👥 Προσωπικό" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs">{label}</Label>
                  <Input disabled={locked} type="number" min={0} value={form[key as keyof typeof form] as number}
                    onChange={e => setForm((f: any) => ({ ...f, [key]: +e.target.value }))} className="mt-1" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Σύνολο εξόδων: <strong>{((form.cost_operational || 0) + (form.cost_marketing || 0) + (form.cost_staff || 0)).toLocaleString()} 🪙</strong></p>
          </CardContent>
        </Card>

        {/* Shares */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">📊 ΜΕΡΙΔΙΑ (εσύ κρατάς πάντα 5/10)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Τιμή μεριδίου (coins)</Label>
                <Input disabled={locked} type="number" min={10} value={form.share_price}
                  onChange={e => setForm((f: any) => ({ ...f, share_price: +e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Μερίδια προς πώληση (max 5)</Label>
                <Input disabled={locked} type="number" min={1} max={5} value={form.shares_for_sale}
                  onChange={e => setForm((f: any) => ({ ...f, shares_for_sale: Math.min(5, +e.target.value) }))} className="mt-1" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Αξία εταιρίας: <strong>{(form.share_price * 10).toLocaleString()} 🪙</strong> · Μέρισμα/μερίδιο: 10% κερδών
            </p>
          </CardContent>
        </Card>
      </div>

      {!locked && (
        <div>
          <Button onClick={onSave} disabled={saving} className="w-full py-5 text-base">
            {saving ? "Αποθήκευση..." : "💾 Αποθήκευσε Εταιρία"}
          </Button>
          {saveMsg && <p className="text-center text-sm mt-2">{saveMsg}</p>}
        </div>
      )}
    </div>
  );
}

function CompanyCard({ company, player, round, buyQty, setBuyQty, onBuy, buyMsg, holdings }: any) {
  const available = company.shares_for_sale - company.shares_sold;
  const myHolding = holdings.find((h: any) => h.company_id === company.id);
  const canBuy = round === 2 && available > 0;

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/40 transition-colors">
      <div className={`bg-gradient-to-r ${company.color} p-4 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{company.emoji}</span>
            <div>
              <h3 className="font-bold text-lg">{company.name}</h3>
              <p className="text-white/80 text-sm">{company.product_name} — {company.product_price} 🪙/τεμ.</p>
            </div>
          </div>
          <div className="text-right text-white/80 text-sm">
            <div>{available}/{company.shares_for_sale} μερίδια</div>
            <div>{company.share_price} 🪙/μερίδιο</div>
          </div>
        </div>
      </div>
      <CardContent className="pt-4 space-y-3">
        {company.description && <p className="text-sm text-muted-foreground">{company.description}</p>}
        {company.pitch_text && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <span className="font-semibold">🎤 Pitch: </span>{company.pitch_text}
          </div>
        )}
        {company.ad_text && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <span className="font-semibold">📢 </span>{company.ad_text}
          </div>
        )}

        {/* Financials in round 3+ */}
        {round >= 3 && (
          <div className="grid grid-cols-4 gap-2 text-center text-xs bg-muted/30 rounded-lg p-3">
            <div><div className="text-muted-foreground">Πωλήσεις</div><div className="font-bold">{company.units_sold}</div></div>
            <div><div className="text-muted-foreground">Έσοδα</div><div className="font-bold">{company.revenue.toLocaleString()}</div></div>
            <div><div className="text-muted-foreground">Έξοδα</div><div className="font-bold">{company.total_costs.toLocaleString()}</div></div>
            <div><div className="text-muted-foreground">Κέρδος</div><div className={`font-bold ${company.net_profit >= 0 ? "text-green-600" : "text-red-500"}`}>{Math.round(company.net_profit).toLocaleString()}</div></div>
          </div>
        )}

        {myHolding && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            ✅ Κατέχεις {myHolding.shares_owned} μερίδια
            {myHolding.dividends_received > 0 && ` · Μέρισμα: +${Math.round(myHolding.dividends_received)} 🪙`}
          </div>
        )}

        {canBuy && player && (
          <div className="flex items-center gap-2">
            <Input type="number" min={1} max={available} value={buyQty}
              onChange={e => setBuyQty(Math.min(available, Math.max(1, +e.target.value)))}
              className="w-20 text-center" />
            <Button onClick={onBuy} size="sm" className="flex-1">
              Αγορά {buyQty} μεριδίων ({(buyQty * company.share_price).toLocaleString()} 🪙)
            </Button>
          </div>
        )}
        {buyMsg && <p className="text-sm">{buyMsg}</p>}
      </CardContent>
    </Card>
  );
}

function TeacherRoundPanel({ session, allCompanies, players, salesInput, setSalesInput, salesMsg, onEnterSales, onAdvance }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">👩‍🏫 Πίνακας Εκπαιδευτικού</h2>

      {/* Class code display */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Κωδικός τάξης — δώσε στους μαθητές:</p>
          <div className="text-5xl font-extrabold tracking-widest text-primary font-mono">{session.class_code}</div>
          <p className="text-xs text-muted-foreground mt-1">{players.length} μαθητές συνδεδεμένοι · {allCompanies.length} εταιρίες</p>
        </CardContent>
      </Card>

      {/* Round control */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Round {session.current_round}/4</p>
              <p className="text-sm text-muted-foreground">{ROUND_NAMES[session.current_round]?.el}</p>
            </div>
            {session.current_round < 4 && (
              <Button onClick={onAdvance} className="gap-1">
                Επόμενο Round <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            {session.current_round === 4 && (
              <Badge className="bg-green-100 text-green-700">✅ Παιχνίδι τελειώσε!</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enter sales (Round 3) */}
      {session.current_round === 3 && (
        <Card>
          <CardHeader><CardTitle className="text-base">📈 Εισαγωγή Πωλήσεων</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {allCompanies.map((c: GameCompany) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-xl">{c.emoji}</span>
                <div className="flex-1 text-sm font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.product_price} 🪙/τεμ.</div>
                <Input
                  type="number" min={0} placeholder="0"
                  value={salesInput[c.id] || ""}
                  onChange={e => setSalesInput((s: any) => ({ ...s, [c.id]: e.target.value }))}
                  className="w-24 text-center"
                />
                <span className="text-xs text-muted-foreground">τεμ.</span>
              </div>
            ))}
            <Button onClick={onEnterSales} className="w-full mt-2">
              💰 Καταχώρηση & Υπολογισμός Μερισμάτων
            </Button>
            {salesMsg && <p className="text-sm text-center">{salesMsg}</p>}
          </CardContent>
        </Card>
      )}

      {/* Companies overview */}
      <div>
        <h3 className="font-semibold mb-2 text-sm text-muted-foreground">ΕΤΑΙΡΙΕΣ ({allCompanies.length})</h3>
        <div className="space-y-2">
          {allCompanies.map((c: GameCompany) => (
            <div key={c.id} className={`flex items-center gap-3 p-3 bg-white rounded-xl border bg-gradient-to-r ${c.color} bg-opacity-10`}>
              <span className="text-xl">{c.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.product_name} · {c.product_price} 🪙 · Μερίδια: {c.shares_sold}/{c.shares_for_sale}</div>
              </div>
              {session.current_round >= 3 && (
                <div className="text-right text-xs">
                  <div>{c.units_sold} πωλήσεις</div>
                  <div className={c.net_profit >= 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                    {Math.round(c.net_profit).toLocaleString()} 🪙
                  </div>
                </div>
              )}
            </div>
          ))}
          {allCompanies.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Αναμονή για εγγραφή εταιριών...</p>}
        </div>
      </div>
    </div>
  );
}
