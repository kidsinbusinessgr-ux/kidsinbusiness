import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createGameSession, getSessionByCode, joinGame } from "@/lib/gameService";
import { Coins, Users, GraduationCap, Rocket } from "lucide-react";

export default function GameLanding() {
  const navigate = useNavigate();

  // Student join
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

  // Teacher create
  const [teacherName, setTeacherName] = useState("");
  const [gameTitle, setGameTitle] = useState("Venture Game");
  const [teacherPin, setTeacherPin] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleJoin = async () => {
    if (!code.trim() || !nickname.trim()) return setJoinError("Συμπλήρωσε κωδικό και ψευδώνυμο.");
    setJoining(true);
    setJoinError("");
    try {
      const session = await getSessionByCode(code.trim());
      if (!session) return setJoinError("Ο κωδικός δεν βρέθηκε ή το παιχνίδι έχει τελειώσει.");
      const player = await joinGame(session.id, nickname.trim(), session.starting_coins);
      localStorage.setItem(`game_player_${session.class_code}`, JSON.stringify({ playerId: player.id, nickname: player.nickname, isTeacher: false }));
      navigate(`/game/${session.class_code}`);
    } catch (e: any) {
      setJoinError(e.message || "Σφάλμα σύνδεσης.");
    } finally {
      setJoining(false);
    }
  };

  const handleCreate = async () => {
    if (!teacherName.trim()) return setCreateError("Συμπλήρωσε το όνομά σου.");
    if (teacherPin !== "kib2025") return setCreateError("Λάθος PIN εκπαιδευτικού.");
    setCreating(true);
    setCreateError("");
    try {
      const session = await createGameSession(teacherName.trim(), gameTitle.trim() || "Venture Game");
      localStorage.setItem(`game_player_${session.class_code}`, JSON.stringify({ playerId: "teacher", nickname: teacherName.trim(), isTeacher: true }));
      navigate(`/game/${session.class_code}`);
    } catch (e: any) {
      setCreateError(e.message || "Σφάλμα δημιουργίας.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl">🏦</span>
          <h1 className="text-4xl font-extrabold text-gray-800">Venture Game</h1>
        </div>
        <p className="text-muted-foreground text-lg">Δημιούργησε εταιρία · Επένδυσε · Κέρδισε μερίσματα</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 w-full max-w-2xl">
        {[
          { icon: <Rocket className="w-5 h-5" />, label: "Ίδρυσε εταιρία" },
          { icon: <Users className="w-5 h-5" />, label: "Κάνε pitch" },
          { icon: <Coins className="w-5 h-5" />, label: "Κέρδισε coins" },
          { icon: <GraduationCap className="w-5 h-5" />, label: "Γίνε μέτοχος" },
        ].map((s, i) => (
          <div key={i} className="bg-white/80 rounded-xl p-3 flex flex-col items-center gap-1 text-center shadow-sm border">
            <div className="text-primary">{s.icon}</div>
            <span className="text-xs font-semibold text-gray-700">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Join / Create tabs */}
      <Card className="w-full max-w-md shadow-lg">
        <Tabs defaultValue="join">
          <TabsList className="w-full grid grid-cols-2 m-3" style={{ width: "calc(100% - 24px)" }}>
            <TabsTrigger value="join">🎮 Είσοδος Παιδιού</TabsTrigger>
            <TabsTrigger value="create">🏫 Εκπαιδευτικός</TabsTrigger>
          </TabsList>

          {/* STUDENT JOIN */}
          <TabsContent value="join">
            <CardContent className="pt-2 space-y-4">
              <div>
                <Label>Κωδικός τάξης</Label>
                <Input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="π.χ. KIB3X7"
                  className="uppercase tracking-widest text-lg font-bold mt-1"
                  maxLength={6}
                />
              </div>
              <div>
                <Label>Ψευδώνυμο / Όνομα</Label>
                <Input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="π.χ. Νίκος" className="mt-1" />
              </div>
              {joinError && <p className="text-red-500 text-sm">{joinError}</p>}
              <Button onClick={handleJoin} disabled={joining} className="w-full text-base py-5">
                {joining ? "Σύνδεση..." : "Μπαίνω στο Παιχνίδι 🚀"}
              </Button>
            </CardContent>
          </TabsContent>

          {/* TEACHER CREATE */}
          <TabsContent value="create">
            <CardContent className="pt-2 space-y-4">
              <div>
                <Label>Το όνομά σου</Label>
                <Input value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="κ. Παπαδόπουλος" className="mt-1" />
              </div>
              <div>
                <Label>Τίτλος παιχνιδιού</Label>
                <Input value={gameTitle} onChange={e => setGameTitle(e.target.value)} placeholder="Venture Game Β' Τάξη" className="mt-1" />
              </div>
              <div>
                <Label>PIN εκπαιδευτικού</Label>
                <Input type="password" value={teacherPin} onChange={e => setTeacherPin(e.target.value)} placeholder="••••••••" className="mt-1" />
              </div>
              {createError && <p className="text-red-500 text-sm">{createError}</p>}
              <Button onClick={handleCreate} disabled={creating} variant="outline" className="w-full text-base py-5">
                {creating ? "Δημιουργία..." : "Δημιουργία Παιχνιδιού 🏫"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Το PIN είναι: kib2025</p>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
