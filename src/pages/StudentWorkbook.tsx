import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import logo from "@/assets/kids-in-business-logo.png";

// ─── Types ─────────────────────────────────────────────────────────────────

type FieldDef =
  | { type: "textarea"; key: string; label: string; placeholder?: string; rows?: number }
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "list"; key: string; label: string; items: string[] }
  | { type: "grid"; key: string; label: string; columns: string[]; rows: number }
  | { type: "week"; key: string; label: string }
  | { type: "skills"; key: string; questions: string[] };

interface Section {
  id: string;
  emoji: string;
  title: string;
  subtitle?: string;
  color: string;
  fields: FieldDef[];
}

// ─── Workbook Sections (from PDF) ──────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "entrepreneur",
    emoji: "🚀",
    title: "Ποιος είναι ο Νέος Επιχειρηματίας;",
    subtitle: "Ο νέος επιχειρηματίας είναι ένα παιδί που βρίσκει ωραίες ιδέες και εργάζεται σκληρά για να τις υλοποιήσει.",
    color: "from-violet-400 to-purple-500",
    fields: [
      {
        type: "textarea",
        key: "entrepreneur_goal",
        label: "Ο στόχος μου είναι:",
        placeholder: "Γράψε τον στόχο σου...",
        rows: 4,
      },
      {
        type: "list",
        key: "entrepreneur_steps",
        label: "Βήματα που πρέπει να ακολουθήσω:",
        items: ["Βήμα 1", "Βήμα 2", "Βήμα 3", "Βήμα 4"],
      },
      {
        type: "textarea",
        key: "entrepreneur_notes",
        label: "Σημειώσεις:",
        placeholder: "Γράψε εδώ τις σκέψεις σου...",
        rows: 5,
      },
    ],
  },
  {
    id: "skills",
    emoji: "💡",
    title: "Ποιες Δεξιότητες Χρειάζεσαι;",
    subtitle: "Χρειάζεσαι δημιουργικότητα, υπευθυνότητα και καλές επικοινωνιακές δεξιότητες.",
    color: "from-sky-400 to-blue-500",
    fields: [
      {
        type: "skills",
        key: "skills_answers",
        questions: [
          "Πώς μπορώ να χρησιμοποιήσω τη δημιουργικότητά μου για να κάνω το προϊόν ή την υπηρεσία μου μοναδικό;",
          "Πώς θα παραμείνω οργανωμένος/η για να παρακολουθώ τις εργασίες και τα χρήματά μου;",
          "Πώς μπορώ να επικοινωνώ με σαφήνεια και ευγένεια με τους πελάτες μου;",
          "Πώς θα χειριστώ τα προβλήματα ή τις προκλήσεις που θα προκύψουν στην επιχείρησή μου;",
        ],
      },
    ],
  },
  {
    id: "brainstorming",
    emoji: "🧠",
    title: "Business Brainstorming",
    subtitle: "Γράψε όλες τις ιδέες σου, όσο μεγάλες ή μικρές κι αν είναι, και στη συνέχεια επίλεξε τις καλύτερες.",
    color: "from-amber-400 to-orange-500",
    fields: [
      {
        type: "textarea",
        key: "brainstorm_idea1",
        label: "💜 Ιδέα 1",
        placeholder: "Γράψε την πρώτη σου ιδέα...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "brainstorm_idea2",
        label: "💛 Ιδέα 2",
        placeholder: "Γράψε τη δεύτερη ιδέα σου...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "brainstorm_idea3",
        label: "🩷 Ιδέα 3",
        placeholder: "Γράψε την τρίτη ιδέα σου...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "brainstorm_idea4",
        label: "🩵 Ιδέα 4",
        placeholder: "Γράψε την τέταρτη ιδέα σου...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "brainstorm_idea5",
        label: "🟢 Ιδέα 5",
        placeholder: "Γράψε μια ακόμη ιδέα...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "brainstorm_idea6",
        label: "🟡 Ιδέα 6",
        placeholder: "Και άλλη μία...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "brainstorm_best",
        label: "⭐ Η καλύτερη ιδέα μου είναι:",
        placeholder: "Ποια ιδέα σε ενθουσιάζει περισσότερο;",
        rows: 3,
      },
    ],
  },
  {
    id: "my_business",
    emoji: "🏪",
    title: "Η Επιχείρησή μου...",
    subtitle: "Γράψε μια σύντομη περιγραφή που να εξηγεί τι θα προσφέρει η επιχείρησή σου και πώς θα λειτουργεί.",
    color: "from-teal-400 to-emerald-500",
    fields: [
      {
        type: "textarea",
        key: "business_description",
        label: "Τι θα κάνει η επιχείρησή μου;",
        placeholder: "Περίγραψε εδώ την επιχείρησή σου...",
        rows: 8,
      },
    ],
  },
  {
    id: "customers",
    emoji: "🧑‍🤝‍🧑",
    title: "Ποιοι είναι οι Πελάτες μου;",
    subtitle: "Η κατανόηση του ποιος θα αγοράσει το προϊόν ή την υπηρεσία σου βοηθά να διασφαλίσεις ότι προσφέρεις κάτι που θα τους αρέσει.",
    color: "from-pink-400 to-rose-500",
    fields: [
      {
        type: "textarea",
        key: "customers_who",
        label: "Ποιος θα αγοράσει το προϊόν ή την υπηρεσία μου;",
        placeholder: "Π.χ. παιδιά 8-12 χρονών, γονείς, σχολεία...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "customers_connect",
        label: "Πώς μπορώ να συνδεθώ με τους πελάτες μου;",
        placeholder: "Instagram, σχολείο, γειτονιά, online...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "customers_interest",
        label: "Ενδιαφέρεται ήδη ο πελάτης-στόχος μου να αγοράσει κάτι τέτοιο;",
        placeholder: "Έχεις ρωτήσει κάποιους; Τι σου είπαν;",
        rows: 3,
      },
      {
        type: "textarea",
        key: "customers_need",
        label: "Ποια ανάγκη έχει ο ιδανικός μου πελάτης που μπορώ να ικανοποιήσω;",
        placeholder: "Τι πρόβλημα λύνει η επιχείρησή σου;",
        rows: 3,
      },
    ],
  },
  {
    id: "product",
    emoji: "🎨",
    title: "Σχεδίασε το Προϊόν σου",
    subtitle: "Χρησιμοποίησε αυτόν τον χώρο για να περιγράψεις ή να σχεδιάσεις το προϊόν ή την υπηρεσία που επέλεξες.",
    color: "from-violet-400 to-fuchsia-500",
    fields: [
      {
        type: "textarea",
        key: "product_description",
        label: "Πώς μοιάζει / λειτουργεί το προϊόν μου;",
        placeholder: "Περίγραψε το πρωτότυπο προϊόν σου εδώ...",
        rows: 6,
      },
      {
        type: "textarea",
        key: "product_idea_board",
        label: "💡 Idea Board — Εικόνες & ιδέες που με εμπνέουν:",
        placeholder: "Τι χρώματα, σχέδια, στυλ σε εμπνέουν; Περίγραψε ή λίστα...",
        rows: 5,
      },
    ],
  },
  {
    id: "branding",
    emoji: "✨",
    title: "Σχεδίασε το Brand σου",
    subtitle: "Ένα ισχυρό εμπορικό σήμα κάνει το προϊόν σου εύκολα αναγνωρίσιμο.",
    color: "from-yellow-400 to-amber-500",
    fields: [
      {
        type: "text",
        key: "brand_name",
        label: "Το όνομα της εταιρίας μου είναι:",
        placeholder: "Π.χ. EcoSnack Junior, PetPals, ArtKids...",
      },
      {
        type: "textarea",
        key: "brand_logo",
        label: "Περιγραφή logo μου (χρώματα, σχέδιο, στυλ):",
        placeholder: "Π.χ. Ένα πολύχρωμο αστέρι με το όνομα της εταιρίας σε μπλε χρώμα...",
        rows: 4,
      },
      {
        type: "textarea",
        key: "brand_packaging",
        label: "Πώς θα μοιάζει η συσκευασία / παρουσίαση μου;",
        placeholder: "Π.χ. ροζ κουτί με χρυσό ribbon, χάρτινη σακούλα με αυτοκόλλητο...",
        rows: 4,
      },
      {
        type: "textarea",
        key: "brand_colors",
        label: "Τα χρώματα του brand μου:",
        placeholder: "Π.χ. μωβ, λευκό, χρυσό...",
        rows: 2,
      },
    ],
  },
  {
    id: "competition",
    emoji: "🔍",
    title: "Υπάρχουν Άλλες Εταιρίες που Κάνουν το Ίδιο;",
    subtitle: "Εντόπισε άλλες επιχειρήσεις που πουλούν το ίδιο προϊόν ή υπηρεσία.",
    color: "from-cyan-400 to-sky-500",
    fields: [
      {
        type: "textarea",
        key: "competition_who",
        label: "Ποιοι είναι οι ανταγωνιστές μου;",
        placeholder: "Γράψε εδώ εταιρίες ή άτομα που κάνουν κάτι παρόμοιο...",
        rows: 4,
      },
      {
        type: "textarea",
        key: "competition_usp",
        label: "🌟 Ποιο είναι το USP μου (Unique Selling Point);",
        placeholder: "Τι κάνω διαφορετικά; Γιατί να με επιλέξουν εμένα;",
        rows: 3,
      },
      {
        type: "textarea",
        key: "competition_advantage",
        label: "Ποιο είναι το μοναδικό πλεονέκτημα του προϊόντος μου;",
        placeholder: "Τι ξεχωρίζει το προϊόν ή την υπηρεσία μου;",
        rows: 3,
      },
    ],
  },
  {
    id: "costs",
    emoji: "💰",
    title: "Κόστος & Κέρδος",
    subtitle: "Κατέγραψε το κόστος παραγωγής του προϊόντος ή της υπηρεσίας σου.",
    color: "from-green-400 to-emerald-600",
    fields: [
      {
        type: "textarea",
        key: "costs_materials",
        label: "Τι χρειάζεσαι για να ξεκινήσεις; (Υλικά / Πόροι):",
        placeholder: "Λίστα: π.χ. Χαρτί €2, Μαρκαδόροι €5, Συσκευασίες €3...",
        rows: 6,
      },
      {
        type: "text",
        key: "costs_total_production",
        label: "💸 Συνολικό κόστος παραγωγής (€):",
        placeholder: "π.χ. 10€",
      },
      {
        type: "text",
        key: "costs_selling_price",
        label: "🏷️ Τιμή πώλησης (€):",
        placeholder: "π.χ. 15€",
      },
      {
        type: "text",
        key: "costs_profit",
        label: "✅ Συνολικό κέρδος (τιμή πώλησης − κόστος παραγωγής):",
        placeholder: "π.χ. 5€",
      },
    ],
  },
  {
    id: "advertising",
    emoji: "📢",
    title: "Διαφήμιση",
    subtitle: "Δεν έχει νόημα να προσφέρεις ένα καταπληκτικό προϊόν αν οι άνθρωποι δεν το γνωρίζουν!",
    color: "from-orange-400 to-red-500",
    fields: [
      {
        type: "textarea",
        key: "ads_ideas",
        label: "Πώς θα ενημερώσω το κοινό μου;",
        placeholder: "Π.χ. Instagram posts, flyers στο σχολείο, word of mouth, TikTok...",
        rows: 5,
      },
      {
        type: "textarea",
        key: "ads_examples",
        label: "Παραδείγματα διαφήμισης που με εμπνέουν:",
        placeholder: "Τι είδους διαφήμιση έχεις δει και σου άρεσε;",
        rows: 4,
      },
      {
        type: "textarea",
        key: "ads_slogan",
        label: "Το slogan της επιχείρησής μου:",
        placeholder: "Π.χ. \"Fresh ideas for little entrepreneurs!\"",
        rows: 2,
      },
    ],
  },
  {
    id: "action_plan",
    emoji: "📋",
    title: "Το Σχέδιο της Δράσης μου",
    subtitle: "Συνοψίστε την επιχειρηματική σου ιδέα σε μια σελίδα.",
    color: "from-indigo-400 to-violet-600",
    fields: [
      {
        type: "text",
        key: "plan_business",
        label: "Η εταιρεία μου θα ασχολείται με:",
        placeholder: "...",
      },
      {
        type: "text",
        key: "plan_name",
        label: "Το όνομα της εταιρείας μου είναι:",
        placeholder: "...",
      },
      {
        type: "textarea",
        key: "plan_differentiation",
        label: "Πώς διαφοροποιείται η εταιρεία μου από τις άλλες;",
        placeholder: "...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "plan_customer",
        label: "Ποιος είναι ο πελάτης μου;",
        placeholder: "...",
        rows: 2,
      },
      {
        type: "textarea",
        key: "plan_advertising",
        label: "Πώς μπορώ να διαφημίσω το προϊόν μου;",
        placeholder: "...",
        rows: 3,
      },
      {
        type: "textarea",
        key: "plan_sell_where",
        label: "Που μπορώ να το πουλήσω;",
        placeholder: "...",
        rows: 2,
      },
      {
        type: "text",
        key: "plan_price",
        label: "Πόσο θα πουλάω το προϊόν μου;",
        placeholder: "€...",
      },
      {
        type: "text",
        key: "plan_expenses",
        label: "Ποια είναι τα έξοδά μου;",
        placeholder: "€...",
      },
      {
        type: "text",
        key: "plan_profit",
        label: "Ποιο είναι το κέρδος μου;",
        placeholder: "€...",
      },
    ],
  },
  {
    id: "weekly_plan",
    emoji: "📅",
    title: "Εβδομαδιαίο Πλάνο",
    subtitle: "Κατέγραψε τα βήματα που πρέπει να κάνεις κάθε ημέρα για να ξεκινήσεις την εταιρία σου.",
    color: "from-pink-400 to-fuchsia-600",
    fields: [
      {
        type: "week",
        key: "weekly",
        label: "Εβδομαδιαίο Πλάνο",
      },
    ],
  },
];

const WEEK_DAYS = [
  { day: "Δευτέρα", emoji: "😊" },
  { day: "Τρίτη", emoji: "⭐" },
  { day: "Τετάρτη", emoji: "☀️" },
  { day: "Πέμπτη", emoji: "🤍" },
  { day: "Παρασκευή", emoji: "🌸" },
  { day: "Σάββατο", emoji: "👑" },
  { day: "Κυριακή", emoji: "💡" },
];

const STORAGE_KEY = "kib_workbook_v1";

// ─── Component ──────────────────────────────────────────────────────────────

const StudentWorkbook = () => {
  const [data, setData] = useState<Record<string, any>>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set([SECTIONS[0].id]));
  const [saved, setSaved] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setData(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Auto-save with debounce
  const handleChange = (key: string, value: any) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    setSaved(false);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Count filled fields for progress
  const totalFields = SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
  const filledFields = SECTIONS.reduce((acc, s) => {
    return acc + s.fields.filter((f) => {
      const val = data[f.key];
      if (!val) return false;
      if (typeof val === "string") return val.trim().length > 0;
      if (typeof val === "object") return Object.values(val).some((v) => v && String(v).trim());
      return false;
    }).length;
  }, 0);
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/student" className="flex items-center gap-1 text-muted-foreground hover:text-primary text-sm">
            <ArrowLeft className="w-4 h-4" /> Πίσω
          </Link>
          <img src={logo} alt="KidsInBusiness" className="h-8" />
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-600 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Αποθηκεύτηκε!
            </span>
          )}
          <div className="text-sm text-muted-foreground hidden sm:block">
            {progress}% ολοκληρωμένο
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Title */}
        <div className="text-center py-4">
          <div className="text-5xl mb-3">📓</div>
          <h1 className="text-3xl font-bold">Kids in Business Workbook</h1>
          <p className="text-muted-foreground mt-1">Συμπλήρωσε κάθε ενότητα για να χτίσεις την επιχείρησή σου!</p>
          <div className="mt-4 max-w-sm mx-auto">
            <Progress value={progress} className="h-3 rounded-full" />
            <p className="text-xs text-muted-foreground mt-1">{filledFields} από {totalFields} ενότητες συμπληρωμένες</p>
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => {
          const isOpen = openSections.has(section.id);
          const hasContent = section.fields.some((f) => {
            const val = data[f.key];
            if (typeof val === "string") return val.trim().length > 0;
            if (typeof val === "object" && val) return Object.values(val).some((v) => v && String(v).trim());
            return false;
          });

          return (
            <div key={section.id} className="rounded-2xl border-2 overflow-hidden shadow-sm bg-white">
              {/* Section header */}
              <button
                className={`w-full flex items-center justify-between p-4 text-left bg-gradient-to-r ${section.color} text-white`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.emoji}</span>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{section.title}</h2>
                    {hasContent && !isOpen && (
                      <span className="text-xs text-white/80">✓ Συμπληρωμένο</span>
                    )}
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
              </button>

              {/* Section content */}
              {isOpen && (
                <div className="p-5 space-y-5">
                  {section.subtitle && (
                    <p className="text-sm text-muted-foreground italic border-l-4 border-primary/30 pl-3">
                      {section.subtitle}
                    </p>
                  )}

                  {section.fields.map((field) => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={data[field.key]}
                      onChange={(val) => handleChange(field.key, val)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Parent Guide teaser */}
        <div className="bg-gradient-to-br from-violet-100 to-pink-100 rounded-2xl p-6 border border-violet-200 text-center">
          <div className="text-4xl mb-2">👨‍👩‍👧</div>
          <h3 className="font-bold text-lg mb-2">Οδηγίες για τον Γονέα</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Η δημιουργικότητα χρειάζεται χώρο, εμπιστοσύνη και υποστήριξη. Μη διορθώνεις — άκου και κάνε ανοιχτές ερωτήσεις!
          </p>
          <div className="bg-white rounded-xl p-4 text-left text-sm space-y-1">
            <p className="font-semibold text-violet-700 mb-2">Ερωτήσεις-Κλειδιά:</p>
            {[
              "Πώς σκέφτηκες αυτή την ιδέα;",
              "Σε ποιον θα άρεσε; Γιατί;",
              "Τι σου ήταν εύκολο; Τι σου φάνηκε δύσκολο;",
              "Τι έμαθες από αυτή τη δραστηριότητα;",
            ].map((q) => (
              <p key={q} className="flex gap-2"><span>✦</span><span>{q}</span></p>
            ))}
          </div>
        </div>

        {/* Share CTA */}
        <div className="bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-2">📸</div>
          <h3 className="font-bold text-lg mb-1">Μοιράσου μαζί μας τις ιδέες σου!</h3>
          <p className="text-white/80 text-sm">
            Κάνε tag @kidsinbusiness.gr και κέρδισε πλούσια δώρα!
          </p>
        </div>

        <div className="pb-10" />
      </main>
    </div>
  );
};

// ─── Field Renderer ─────────────────────────────────────────────────────────

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (val: any) => void;
}) {
  const baseInput =
    "w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-muted/20 transition-colors resize-none";

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-semibold block">{field.label}</label>
        <textarea
          className={baseInput}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "text") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-semibold block">{field.label}</label>
        <input
          type="text"
          className={baseInput}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "list") {
    const vals: string[] = value ?? Array(field.items.length).fill("");
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold block">{field.label}</label>
        {field.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-primary font-bold text-sm w-16 shrink-0">{item}</span>
            <input
              type="text"
              className={baseInput}
              placeholder={`${item}...`}
              value={vals[i] ?? ""}
              onChange={(e) => {
                const next = [...vals];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (field.type === "skills") {
    const vals: string[] = value ?? Array(field.questions.length).fill("");
    return (
      <div className="space-y-4">
        {field.questions.map((q, i) => (
          <div key={i} className="space-y-1.5">
            <label className="text-sm font-semibold block">{i + 1}. {q}</label>
            <textarea
              className={baseInput}
              rows={3}
              placeholder="Γράψε εδώ..."
              value={vals[i] ?? ""}
              onChange={(e) => {
                const next = [...vals];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (field.type === "week") {
    const vals: Record<string, string> = value ?? {};
    return (
      <div className="space-y-2">
        {WEEK_DAYS.map(({ day, emoji }) => (
          <div key={day} className="flex items-start gap-3 bg-muted/30 rounded-xl px-4 py-2">
            <div className="flex items-center gap-1.5 w-28 shrink-0 pt-1">
              <span>{emoji}</span>
              <span className="font-semibold text-sm">{day}</span>
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent border-b-2 border-muted focus:border-primary focus:outline-none text-sm py-1"
              placeholder="Τι θα κάνω..."
              value={vals[day] ?? ""}
              onChange={(e) => onChange({ ...vals, [day]: e.target.value })}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default StudentWorkbook;
