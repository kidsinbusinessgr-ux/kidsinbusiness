import { BUSINESS_PLAN_CHAPTERS } from "@/config/chaptersConfig";

export interface Lesson {
  id: number;
  titleEl: string;
  titleEn: string;
  durationMin: number;
}

export interface ProgramChapter {
  id: number;
  titleEl: string;
  titleEn: string;
  descriptionEl: string;
  descriptionEn: string;
  lessons: Lesson[];
  emoji: string;
}

export interface Program {
  id: string;
  titleEl: string;
  titleEn: string;
  descriptionEl: string;
  descriptionEn: string;
  taglineEl: string;
  taglineEn: string;
  color: string;
  bgColor: string;
  emoji: string;
  ageRange: string;
  chaptersCount: number;
  lessonsCount: number;
  durationEl: string;
  durationEn: string;
  chapters: ProgramChapter[];
  route: string;
  badge?: string;
}

export const PROGRAMS: Program[] = [
  {
    id: "business-plan",
    titleEl: "Business Plan",
    titleEn: "Business Plan",
    descriptionEl: "Τα παιδιά μαθαίνουν να σκέφτονται σαν επιχειρηματίες, να δημιουργούν ιδέες και να χτίζουν το δικό τους επιχειρηματικό σχέδιο.",
    descriptionEn: "Children learn to think like entrepreneurs, create ideas and build their own business plan.",
    taglineEl: "Επιχειρηματική σκέψη βήμα–βήμα",
    taglineEn: "Entrepreneurial thinking step by step",
    color: "from-primary to-accent",
    bgColor: "bg-primary/10",
    emoji: "🚀",
    ageRange: "9–14",
    chaptersCount: 6,
    lessonsCount: 29,
    durationEl: "6 εβδομάδες",
    durationEn: "6 weeks",
    route: "/chapters",
    chapters: BUSINESS_PLAN_CHAPTERS.map((ch) => ({
      id: ch.id,
      titleEl: ch.titleEl,
      titleEn: ch.titleEn,
      descriptionEl: ch.descriptionEl,
      descriptionEn: ch.descriptionEn,
      emoji: ch.emoji,
      lessons: Array.from({ length: ch.lessons }, (_, i) => ({
        id: i + 1,
        titleEl: `Μάθημα ${i + 1}`,
        titleEn: `Lesson ${i + 1}`,
        durationMin: 15,
      })),
    })),
  },
  {
    id: "public-speaking",
    titleEl: "Public Speaking για Παιδιά",
    titleEn: "Public Speaking for Kids",
    descriptionEl: "Το πρόγραμμα που βοηθά τα παιδιά να μιλάνε με αυτοπεποίθηση μπροστά σε κοινό, να οργανώνουν τις σκέψεις τους και να παρουσιάζουν ιδέες με δύναμη.",
    descriptionEn: "The program that helps children speak confidently in front of an audience, organise their thoughts and present ideas powerfully.",
    taglineEl: "Μιλώ με αυτοπεποίθηση",
    taglineEn: "Speak with confidence",
    color: "from-orange-400 to-pink-500",
    bgColor: "bg-orange-50",
    emoji: "🎤",
    ageRange: "9–12",
    chaptersCount: 4,
    lessonsCount: 16,
    durationEl: "4 εβδομάδες",
    durationEn: "4 weeks",
    route: "/programs/public-speaking",
    badge: "Νέο",
    chapters: [
      {
        id: 1,
        titleEl: "Η Φωνή μου, το Εργαλείο μου",
        titleEn: "My Voice, My Tool",
        descriptionEl: "Ανακαλύπτουμε τη δύναμη της φωνής και πώς να την ελέγχουμε",
        descriptionEn: "Discovering the power of the voice and how to control it",
        emoji: "🔊",
        lessons: [
          { id: 1, titleEl: "Τι κάνει μια καλή φωνή;", titleEn: "What makes a good voice?", durationMin: 15 },
          { id: 2, titleEl: "Ρυθμός και τόνος", titleEn: "Rhythm and tone", durationMin: 15 },
          { id: 3, titleEl: "Εξάσκηση αναπνοής", titleEn: "Breathing exercises", durationMin: 15 },
          { id: 4, titleEl: "Πρακτική: Διαβάζω δυνατά", titleEn: "Practice: Reading aloud", durationMin: 15 },
        ],
      },
      {
        id: 2,
        titleEl: "Γλώσσα του Σώματος",
        titleEn: "Body Language",
        descriptionEl: "Πώς η στάση και οι κινήσεις μας επηρεάζουν το κοινό",
        descriptionEn: "How posture and movement affect the audience",
        emoji: "🕴️",
        lessons: [
          { id: 1, titleEl: "Στάση σώματος", titleEn: "Posture", durationMin: 15 },
          { id: 2, titleEl: "Επαφή με τα μάτια", titleEn: "Eye contact", durationMin: 15 },
          { id: 3, titleEl: "Χειρονομίες", titleEn: "Gestures", durationMin: 15 },
          { id: 4, titleEl: "Εξάσκηση μπροστά στον καθρέφτη", titleEn: "Mirror practice", durationMin: 15 },
        ],
      },
      {
        id: 3,
        titleEl: "Δομώ την Παρουσίασή μου",
        titleEn: "Structuring My Presentation",
        descriptionEl: "Αρχή, μέση, τέλος — πώς να οργανώνω αυτά που θέλω να πω",
        descriptionEn: "Beginning, middle, end — how to organise what I want to say",
        emoji: "📋",
        lessons: [
          { id: 1, titleEl: "Πώς ξεκινώ;", titleEn: "How do I start?", durationMin: 15 },
          { id: 2, titleEl: "Πώς αναπτύσσω τη σκέψη μου;", titleEn: "How do I develop my thought?", durationMin: 15 },
          { id: 3, titleEl: "Πώς κλείνω δυνατά;", titleEn: "How do I close strongly?", durationMin: 15 },
          { id: 4, titleEl: "Γράφω το δικό μου σενάριο", titleEn: "Writing my own script", durationMin: 15 },
        ],
      },
      {
        id: 4,
        titleEl: "Ομιλώ Μπροστά σε Κοινό",
        titleEn: "Speaking in Front of an Audience",
        descriptionEl: "Πρακτικές παρουσιάσεις, feedback και αντιμετώπιση του άγχους",
        descriptionEn: "Practical presentations, feedback and managing nerves",
        emoji: "🏆",
        lessons: [
          { id: 1, titleEl: "Αντιμετωπίζω το άγχος μου", titleEn: "Managing my nerves", durationMin: 15 },
          { id: 2, titleEl: "Πρόβα γενική", titleEn: "Full rehearsal", durationMin: 15 },
          { id: 3, titleEl: "Ζωντανή παρουσίαση", titleEn: "Live presentation", durationMin: 15 },
          { id: 4, titleEl: "Ανατροφοδότηση & βελτίωση", titleEn: "Feedback & improvement", durationMin: 15 },
        ],
      },
    ],
  },
  {
    id: "financial-literacy",
    titleEl: "Χρηματοοικονομικός Γραμματισμός",
    titleEn: "Financial Literacy",
    descriptionEl: "Τα παιδιά μαθαίνουν τι είναι χρήματα, πώς να τα διαχειρίζονται, να αποταμιεύουν και να παίρνουν έξυπνες οικονομικές αποφάσεις από νωρίς.",
    descriptionEn: "Children learn what money is, how to manage it, save it and make smart financial decisions from an early age.",
    taglineEl: "Έξυπνος με τα χρήματα",
    taglineEn: "Smart with money",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    emoji: "💰",
    ageRange: "9–14",
    chaptersCount: 3,
    lessonsCount: 12,
    durationEl: "3 εβδομάδες",
    durationEn: "3 weeks",
    route: "/programs/financial-literacy",
    badge: "Νέο",
    chapters: [
      {
        id: 1,
        titleEl: "Τι είναι τα Χρήματα;",
        titleEn: "What is Money?",
        descriptionEl: "Η ιστορία του χρήματος, αξία και ανταλλαγή",
        descriptionEn: "The history of money, value and exchange",
        emoji: "🪙",
        lessons: [
          { id: 1, titleEl: "Από το αντάλλαγμα στο νόμισμα", titleEn: "From barter to currency", durationMin: 15 },
          { id: 2, titleEl: "Αξία vs Τιμή", titleEn: "Value vs Price", durationMin: 15 },
          { id: 3, titleEl: "Ψηφιακά χρήματα", titleEn: "Digital money", durationMin: 15 },
          { id: 4, titleEl: "Πρακτική: Το δικό μου πορτοφόλι", titleEn: "Practice: My own wallet", durationMin: 15 },
        ],
      },
      {
        id: 2,
        titleEl: "Έσοδα, Έξοδα & Αποταμίευση",
        titleEn: "Income, Expenses & Saving",
        descriptionEl: "Πώς λειτουργεί ο προϋπολογισμός και γιατί η αποταμίευση μετράει",
        descriptionEn: "How budgeting works and why saving matters",
        emoji: "📊",
        lessons: [
          { id: 1, titleEl: "Τι είναι έσοδα;", titleEn: "What is income?", durationMin: 15 },
          { id: 2, titleEl: "Τι είναι έξοδα;", titleEn: "What are expenses?", durationMin: 15 },
          { id: 3, titleEl: "Ο κανόνας 50/30/20", titleEn: "The 50/30/20 rule", durationMin: 15 },
          { id: 4, titleEl: "Φτιάχνω προϋπολογισμό", titleEn: "Making a budget", durationMin: 15 },
        ],
      },
      {
        id: 3,
        titleEl: "Έξυπνες Οικονομικές Αποφάσεις",
        titleEn: "Smart Financial Decisions",
        descriptionEl: "Ανάγκη vs. επιθυμία, επενδύσεις και μελλοντικός σχεδιασμός",
        descriptionEn: "Need vs. want, investments and future planning",
        emoji: "🧠",
        lessons: [
          { id: 1, titleEl: "Ανάγκη vs Επιθυμία", titleEn: "Need vs Want", durationMin: 15 },
          { id: 2, titleEl: "Τι είναι επένδυση;", titleEn: "What is investment?", durationMin: 15 },
          { id: 3, titleEl: "Ο στόχος μου σε 1 χρόνο", titleEn: "My goal in 1 year", durationMin: 15 },
          { id: 4, titleEl: "Παρουσίαση: Το χρηματοοικονομικό μου πλάνο", titleEn: "Presentation: My financial plan", durationMin: 15 },
        ],
      },
    ],
  },
];
