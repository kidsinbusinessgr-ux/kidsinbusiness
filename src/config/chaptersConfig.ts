export interface Chapter {
  id: number;
  slug: string;
  titleEl: string;
  titleEn: string;
  descriptionEl: string;
  descriptionEn: string;
  lessons: number;
  duration: string;
  color: string;
  emoji: string;
}

export const BUSINESS_PLAN_CHAPTERS: Chapter[] = [
  {
    id: 1,
    slug: "ti-einai-h-epicheirematikothta",
    titleEl: "Τι είναι η Επιχειρηματικότητα",
    titleEn: "What is Entrepreneurship",
    descriptionEl: "Εισαγωγή στον κόσμο της επιχειρηματικότητας και πώς συνδέεται με την καθημερινή ζωή",
    descriptionEn: "Introduction to the world of entrepreneurship and how it connects to everyday life",
    lessons: 4,
    duration: "45 λεπτά",
    color: "from-primary to-accent",
    emoji: "🚀",
  },
  {
    id: 2,
    slug: "idees-kai-dhmioyrgikothta",
    titleEl: "Ιδέες & Δημιουργικότητα",
    titleEn: "Ideas & Creativity",
    descriptionEl: "Ανακαλύψτε πώς να εντοπίζετε ευκαιρίες και να αναπτύσσετε καινοτόμες ιδέες",
    descriptionEn: "Discover how to spot opportunities and develop innovative ideas",
    lessons: 5,
    duration: "60 λεπτά",
    color: "from-accent to-secondary",
    emoji: "💡",
  },
  {
    id: 3,
    slug: "apo-thn-idea-sth-drash",
    titleEl: "Από την Ιδέα στη Δράση",
    titleEn: "From Idea to Action",
    descriptionEl: "Μετατρέψτε τις ιδέες σε συγκεκριμένα βήματα και σχέδια δράσης",
    descriptionEn: "Turn ideas into concrete steps and action plans",
    lessons: 6,
    duration: "75 λεπτά",
    color: "from-secondary to-primary",
    emoji: "⚡",
  },
  {
    id: 4,
    slug: "synergasia-kai-roloi",
    titleEl: "Συνεργασία & Ρόλοι",
    titleEn: "Collaboration & Roles",
    descriptionEl: "Κατανοήστε τη σημασία της ομαδικής εργασίας και των διαφορετικών ρόλων",
    descriptionEn: "Understand the importance of teamwork and different roles",
    lessons: 5,
    duration: "60 λεπτά",
    color: "from-primary to-secondary",
    emoji: "🤝",
  },
  {
    id: 5,
    slug: "paroysiazw-thn-idea-moy",
    titleEl: "Παρουσιάζω την Ιδέα μου",
    titleEn: "Presenting My Idea",
    descriptionEl: "Αναπτύξτε δεξιότητες παρουσίασης και επικοινωνίας των ιδεών σας",
    descriptionEn: "Develop presentation and communication skills for your ideas",
    lessons: 4,
    duration: "50 λεπτά",
    color: "from-accent to-primary",
    emoji: "🎤",
  },
  {
    id: 6,
    slug: "xrhmato-oikonomikos-alfavhtismos",
    titleEl: "Χρηματοοικονομικός Αλφαβητισμός",
    titleEn: "Financial Literacy",
    descriptionEl: "Μαθαίνουμε για έσοδα, έξοδα, κέρδη και βασικές οικονομικές αποφάσεις",
    descriptionEn: "Learn about revenue, expenses, profit and basic financial decisions",
    lessons: 5,
    duration: "60 λεπτά",
    color: "from-secondary to-accent",
    emoji: "💰",
  },
];
