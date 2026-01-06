import { Language } from "@/context/LanguageContext";

export type LangString = Record<Language, string>;
export type LangStringArray = Record<Language, string[]>;

export const translations = {
  actions: {
    pageTitle: {
      el: "Δράσεις & Challenges",
      en: "Actions & Challenges",
    } as LangString,
    pageSubtitle: {
      el: "Πρακτικές δραστηριότητες για εφαρμογή της γνώσης",
      en: "Hands-on activities to put learning into practice",
    } as LangString,
    breadcrumbLabel: {
      el: "Δράσεις",
      en: "Actions",
    } as LangString,
    resetProgressButton: {
      el: "Επαναφορά προόδου",
      en: "Reset progress",
    } as LangString,
    resetDialogTitle: {
      el: "Επαναφορά όλων των challenges;",
      en: "Reset all challenges?",
    } as LangString,
    resetDialogDescription: {
      el: "Αυτό θα διαγράψει όλη την έως τώρα πρόοδο (συμπεριλαμβανομένων badges και στατιστικών). Η ενέργεια δεν μπορεί να αναιρεθεί.",
      en: "This will clear all current progress (including badges and stats). This action cannot be undone.",
    } as LangString,
    overallProgressLabel: {
      el: "Συνολική Πρόοδος",
      en: "Overall progress",
    } as LangString,
    overallProgressOfLabel: {
      el: "από",
      en: "of",
    } as LangString,
    overallProgressActivitiesLabel: {
      el: "δράσεις",
      en: "activities",
    } as LangString,
    financialLiteracyBadge: {
      el: "Χρηματοοικονομικός Γραμματισμός",
      en: "Financial Literacy",
    } as LangString,
    financialLiteracyDescription: {
      el: "Το badge «Χρηματοοικονομικός Γραμματισμός» εμφανίζεται δίπλα στις δράσεις Budgeting Tool, Virtual Stock Market και Pricing Simulator που ανήκουν στο Chapter 6, ώστε τα παιδιά να αναγνωρίζουν δραστηριότητες χρηματοοικονομικού γραμματισμού.",
      en: "The ‘Financial Literacy’ badge appears next to the Budgeting Tool, Virtual Stock Market and Pricing Simulator activities in Chapter 6 so children can easily spot financial literacy activities.",
    } as LangString,
    statusFilterAll: {
      el: "Όλα",
      en: "All",
    } as LangString,
    statusFilterCompleted: {
      el: "Ολοκληρωμένα",
      en: "Completed",
    } as LangString,
    statusFilterIncomplete: {
      el: "Μη ολοκληρωμένα",
      en: "Incomplete",
    } as LangString,
    toastLoadErrorTitle: {
      el: "Σφάλμα φόρτωσης δράσεων",
      en: "Error loading activities",
    } as LangString,
    toastSeedErrorTitle: {
      el: "Σφάλμα αρχικοποίησης δράσεων",
      en: "Error initializing activities",
    } as LangString,
    toastChallengeCompletedTitle: {
      el: "Challenge Ολοκληρώθηκε!",
      en: "Challenge completed!",
    } as LangString,
    toastResetProgressTitle: {
      el: "Η πρόοδος επαναφέρθηκε",
      en: "Progress has been reset",
    } as LangString,
    toastResetProgressDescription: {
      el: "Όλα τα challenges είναι ξανά διαθέσιμα για όλες τις τάξεις.",
      en: "All challenges are now available again for all classes.",
    } as LangString,
    toastAuthRequiredTitle: {
      el: "Απαιτείται σύνδεση",
      en: "Sign-in required",
    } as LangString,
    toastAuthRequiredDeleteDescription: {
      el: "Συνδεθείτε ως εκπαιδευτικός για να διαγράψετε δράσεις.",
      en: "Sign in as a teacher to delete activities.",
    } as LangString,
    toastAuthRequiredEditDescription: {
      el: "Συνδεθείτε ως εκπαιδευτικός για να αποθηκεύσετε αλλαγές.",
      en: "Sign in as a teacher to save changes.",
    } as LangString,
    toastAuthRequiredCreateDescription: {
      el: "Συνδεθείτε ως εκπαιδευτικός για να δημιουργήσετε νέες δράσεις.",
      en: "Sign in as a teacher to create new activities.",
    } as LangString,
    toastDeleteFailureTitle: {
      el: "Αποτυχία διαγραφής",
      en: "Delete failed",
    } as LangString,
    toastDeleteSuccessTitle: {
      el: "Η δράση διαγράφηκε",
      en: "Activity deleted",
    } as LangString,
    toastDeleteSuccessDescription: {
      el: "Η δράση αφαιρέθηκε από όλες τις τάξεις.",
      en: "The activity was removed from all classes.",
    } as LangString,
    toastUpdateFailureTitle: {
      el: "Αποτυχία ενημέρωσης",
      en: "Update failed",
    } as LangString,
    toastUpdateSuccessTitle: {
      el: "Η δράση ενημερώθηκε",
      en: "Activity updated",
    } as LangString,
    toastUpdateSuccessDescription: {
      el: "Οι αλλαγές αποθηκεύτηκαν με επιτυχία.",
      en: "Your changes have been saved successfully.",
    } as LangString,
    toastCreateFailureTitle: {
      el: "Αποτυχία δημιουργίας",
      en: "Creation failed",
    } as LangString,
    toastCreateSuccessTitle: {
      el: "Νέα δράση δημιουργήθηκε",
      en: "New activity created",
    } as LangString,
    toastCreateSuccessDescription: {
      el: "Μπορείτε τώρα να προσαρμόσετε τα στοιχεία της.",
      en: "You can now customize its details.",
    } as LangString,
    motivationalMessages: {
      el: [
        "Συγχαρητήρια! Ένα βήμα πιο κοντά στο στόχο σου! 🎉",
        "Εξαιρετική δουλειά! Συνέχισε έτσι! 💪",
        "Μπράβο! Η επιμονή σου αποδίδει! 🌟",
        "Τέλεια! Είσαι πραγματικός επιχειρηματίας! 🚀",
        "Υπέροχα! Η προσπάθειά σου φαίνεται! ⭐",
        "Εκπληκτικό! Κάθε βήμα μετράει! 🎯",
        "Φανταστικό! Συνεχίζεις να εξελίσσεσαι! 💡",
        "Μεγάλη επιτυχία! Είσαι σε καλό δρόμο! 🏆",
      ],
      en: [
        "Congratulations! One step closer to your goal! 🎉",
        "Great job! Keep it up! 💪",
        "Well done! Your persistence is paying off! 🌟",
        "Awesome! You're a true entrepreneur! 🚀",
        "Amazing! Your effort is showing! ⭐",
        "Incredible! Every step counts! 🎯",
        "Fantastic! You keep improving! 💡",
        "Big success! You're on the right track! 🏆",
      ],
    } as LangStringArray,
  },
  teachers: {
    breadcrumbLabel: {
      el: "Για Εκπαιδευτικούς",
      en: "For Teachers",
    } as LangString,
    pageTitle: {
      el: "Υποστήριξη Εκπαιδευτικών",
      en: "Teacher Support",
    } as LangString,
    pageSubtitle: {
      el: "Όλα όσα χρειάζεστε για να διδάξετε επιχειρηματικότητα με εμπιστοσύνη",
      en: "Everything you need to teach entrepreneurship with confidence",
    } as LangString,
    howItWorksTitle: {
      el: "Πώς λειτουργεί το Kids in Business",
      en: "How Kids in Business works",
    } as LangString,
    howItWorksDescription: {
      el: "Μια πλήρης πλατφόρμα για τη διδασκαλία επιχειρηματικότητας",
      en: "A complete platform for teaching entrepreneurship",
    } as LangString,
    howItWorksIntro: {
      el: "Το Kids in Business είναι σχεδιασμένο να κάνει τη διδασκαλία της επιχειρηματικότητας εύκολη και αποτελεσματική, ακόμα κι αν δεν έχετε προηγούμενη εμπειρία στον τομέα.",
      en: "Kids in Business is designed to make teaching entrepreneurship easy and effective, even if you have no prior experience in the field.",
    } as LangString,
    programStructureTitle: {
      el: "Δομή Προγράμματος",
      en: "Program structure",
    } as LangString,
    programStructureItem1: {
      el: "5 Chapters - Κάθε ένα καλύπτει βασική έννοια",
      en: "5 chapters – each covers a core concept",
    } as LangString,
    programStructureItem2: {
      el: "Πρακτικές δραστηριότητες - Άμεση εφαρμογή της γνώσης",
      en: "Practical activities – immediate application of knowledge",
    } as LangString,
    programStructureItem3: {
      el: "Ευέλικτος ρυθμός - Προσαρμόστε το στις ανάγκες σας",
      en: "Flexible pacing – adapt it to your needs",
    } as LangString,
    includesTitle: {
      el: "Τι περιλαμβάνεται",
      en: "What’s included",
    } as LangString,
    includesItem1: {
      el: "Έτοιμα σχέδια μαθημάτων",
      en: "Ready-to-use lesson plans",
    } as LangString,
    includesItem2: {
      el: "Οδηγίες βήμα προς βήμα",
      en: "Step-by-step guidance",
    } as LangString,
    includesItem3: {
      el: "Δραστηριότητες και challenges",
      en: "Activities and challenges",
    } as LangString,
    includesItem4: {
      el: "Υλικό παρουσίασης",
      en: "Presentation materials",
    } as LangString,
    includesItem5: {
      el: "Υποστήριξη και tips",
      en: "Support and tips",
    } as LangString,
    philosophyTitle: {
      el: "Παιδαγωγική Φιλοσοφία",
      en: "Pedagogical philosophy",
    } as LangString,
    philosophyIntro: {
      el: "Η προσέγγισή μας βασίζεται σε τρεις πυλώνες:",
      en: "Our approach is built on three pillars:",
    } as LangString,
    philosophyPillar1Title: {
      el: "Βιωματική Μάθηση",
      en: "Experiential learning",
    } as LangString,
    philosophyPillar1Description: {
      el: "Τα παιδιά μαθαίνουν κάνοντας, όχι ακούγοντας",
      en: "Students learn by doing, not just by listening",
    } as LangString,
    philosophyPillar2Title: {
      el: "Ομαδική Εργασία",
      en: "Teamwork",
    } as LangString,
    philosophyPillar2Description: {
      el: "Συνεργασία και ανταλλαγή ιδεών",
      en: "Collaboration and idea sharing",
    } as LangString,
    philosophyPillar3Title: {
      el: "Δημιουργικότητα",
      en: "Creativity",
    } as LangString,
    philosophyPillar3Description: {
      el: "Ενθάρρυνση της ελεύθερης σκέψης",
      en: "Encouraging free thinking",
    } as LangString,
    faqTitle: {
      el: "Συχνές Ερωτήσεις",
      en: "Frequently asked questions",
    } as LangString,
    faqItem1Question: {
      el: "Πόσος χρόνος χρειάζεται ανά εβδομάδα;",
      en: "How much time is needed per week?",
    } as LangString,
    faqItem1Answer: {
      el: "Συνιστούμε 2-3 ώρες την εβδομάδα, αλλά μπορείτε να προσαρμόσετε το πρόγραμμα ανάλογα με το ωρολόγιό σας. Κάθε μάθημα είναι σχεδιασμένο να διαρκεί 45-60 λεπτά.",
      en: "We recommend 2–3 hours per week, but you can adapt the schedule to your timetable. Each lesson is designed to last 45–60 minutes.",
    } as LangString,
    faqItem2Question: {
      el: "Χρειάζομαι εμπειρία στην επιχειρηματικότητα;",
      en: "Do I need experience in entrepreneurship?",
    } as LangString,
    faqItem2Answer: {
      el: "Όχι! Το πρόγραμμα είναι σχεδιασμένο για εκπαιδευτικούς όλων των επιπέδων. Κάθε μάθημα περιλαμβάνει αναλυτικές οδηγίες και υποστήριξη.",
      en: "No! The program is designed for teachers of all levels. Each lesson includes detailed guidance and support.",
    } as LangString,
    faqItem3Question: {
      el: "Για ποιες ηλικίες είναι κατάλληλο;",
      en: "What ages is it suitable for?",
    } as LangString,
    faqItem3Answer: {
      el: "Το πρόγραμμα είναι σχεδιασμένο για μαθητές δημοτικού (8-12 ετών), αλλά μπορεί να προσαρμοστεί και για μεγαλύτερες ηλικίες.",
      en: "The program is designed for primary students (8–12 years old), but it can be adapted for older ages as well.",
    } as LangString,
    faqItem4Question: {
      el: "Τι υλικά χρειάζομαι;",
      en: "What materials do I need?",
    } as LangString,
    faqItem4Answer: {
      el: "Τα περισσότερα μαθήματα χρειάζονται μόνο βασικά υλικά (χαρτί, μαρκαδόροι, post-its). Συγκεκριμένα υλικά αναφέρονται σε κάθε δραστηριότητα.",
      en: "Most lessons only need basic materials (paper, markers, post-its). Specific materials are listed in each activity.",
    } as LangString,
    faqItem5Question: {
      el: "Μπορώ να προσαρμόσω το περιεχόμενο;",
      en: "Can I adapt the content?",
    } as LangString,
    faqItem5Answer: {
      el: "Απολύτως! Ενθαρρύνουμε την προσαρμογή του περιεχομένου στις ανάγκες και τα ενδιαφέροντα της τάξης σας.",
      en: "Absolutely! We encourage you to adapt the content to your class needs and interests.",
    } as LangString,
    globalTip: {
      el: "Η καλύτερη συμβουλή για νέους εκπαιδευτικούς: Ξεκινήστε απλά! Δεν χρειάζεται να είστε expert - το πάθος και η περιέργεια είναι αρκετά.",
      en: "Top tip for new teachers: start simple! You don't need to be an expert – passion and curiosity are enough.",
    } as LangString,
    classGuideTitle: {
      el: "Οδηγός Τάξης",
      en: "Class guide",
    } as LangString,
    classGuideBeforeTitle: {
      el: "Πριν το μάθημα",
      en: "Before the lesson",
    } as LangString,
    classGuideBeforeText: {
      el: "Διαβάστε το μάθημα και προετοιμάστε τα υλικά",
      en: "Read through the lesson and prepare materials",
    } as LangString,
    classGuideDuringTitle: {
      el: "Κατά τη διάρκεια",
      en: "During the lesson",
    } as LangString,
    classGuideDuringText: {
      el: "Ακολουθήστε τις οδηγίες και προσαρμόστε αν χρειάζεται",
      en: "Follow the guidance and adapt where needed",
    } as LangString,
    classGuideAfterTitle: {
      el: "Μετά το μάθημα",
      en: "After the lesson",
    } as LangString,
    classGuideAfterText: {
      el: "Κάντε αναλογισμό με τους μαθητές",
      en: "Reflect together with your students",
    } as LangString,
    helpTitle: {
      el: "Χρειάζεστε βοήθεια;",
      en: "Need help?",
    } as LangString,
    helpIntro: {
      el: "Επικοινωνήστε μαζί μας για υποστήριξη και συμβουλές:",
      en: "Get in touch with us for support and guidance:",
    } as LangString,
    helpEmail: {
      el: "📧 support@kidsinbusiness.gr",
      en: "📧 support@kidsinbusiness.gr",
    } as LangString,
    helpCommunity: {
      el: "💬 Community Forum",
      en: "💬 Community Forum",
    } as LangString,
    helpLibrary: {
      el: "📚 Βιβλιοθήκη Πόρων",
      en: "📚 Resource Library",
    } as LangString,
  },
  chapters: {
    breadcrumbLabel: {
      el: "Μαθήματα",
      en: "Chapters",
    } as LangString,
    pageTitle: {
      el: "Μαθήματα Επιχειρηματικότητας",
      en: "Entrepreneurship Lessons",
    } as LangString,
    pageSubtitle: {
      el: "6 Chapters που θα μετατρέψουν τους μαθητές σε επιχειρηματικούς στοχαστές",
      en: "6 chapters that help students think like young entrepreneurs",
    } as LangString,
    globalTip: {
      el: "Κάθε chapter είναι σχεδιασμένο να διαρκεί 1-2 εβδομάδες. Προσαρμόστε το ρυθμό ανάλογα με τις ανάγκες της τάξης σας!",
      en: "Each chapter is designed to last 1–2 weeks. Adjust the pace to your class needs!",
    } as LangString,
    lessonsLabel: {
      el: "μαθήματα",
      en: "lessons",
    } as LangString,
    progressCompleteLabel: {
      el: "ολοκληρωμένο",
      en: "complete",
    } as LangString,
    howToUseTitle: {
      el: "Πώς να χρησιμοποιήσετε τα Chapters",
      en: "How to use the chapters",
    } as LangString,
    howToUseStep1: {
      el: "Ξεκινήστε με μια εισαγωγική συζήτηση",
      en: "Start with an introductory discussion",
    } as LangString,
    howToUseStep2: {
      el: "Ακολουθήστε τα μαθήματα με τη σειρά",
      en: "Follow the lessons in order",
    } as LangString,
    howToUseStep3: {
      el: "Ολοκληρώστε με τις δραστηριότητες",
      en: "Finish with the activities",
    } as LangString,
  },
  community: {
    breadcrumbLabel: {
      el: "Κοινότητα",
      en: "Community",
    } as LangString,
    pageTitle: {
      el: "Κοινότητα Εκπαιδευτικών",
      en: "Teacher Community",
    } as LangString,
    pageSubtitle: {
      el: "Μοιραστείτε ιδέες και εμπνευστείτε από άλλους εκπαιδευτικούς",
      en: "Share ideas and get inspired by other teachers",
    } as LangString,
    comingSoonTitle: {
      el: "Έρχεται σύντομα! 🎉",
      en: "Coming soon! 🎉",
    } as LangString,
    comingSoonDescription: {
      el: "Η πλήρης κοινότητα βρίσκεται υπό κατασκευή. Σύντομα θα μπορείτε να συνδεθείτε με άλλους εκπαιδευτικούς, να μοιραστείτε τις δράσεις σας και να ανακαλύψετε νέες ιδέες.",
      en: "The full community is under construction. Soon you will connect with other teachers, share your activities and discover new ideas.",
    } as LangString,
    comingSoonButton: {
      el: "Ενημερώστε με",
      en: "Notify me",
    } as LangString,
    previewTitle: {
      el: "Προεπισκόπηση Κοινότητας",
      en: "Community preview",
    } as LangString,
    likesLabel: {
      el: "likes",
      en: "likes",
    } as LangString,
    commentsLabel: {
      el: "σχόλια",
      en: "comments",
    } as LangString,
    globalTip: {
      el: "Η κοινότητα θα σας επιτρέψει να μοιραστείτε τις επιτυχίες σας και να μάθετε από τις εμπειρίες άλλων!",
      en: "The community will let you share your wins and learn from other teachers' experiences!",
    } as LangString,
    whatWillIncludeTitle: {
      el: "Τι θα περιλαμβάνει;",
      en: "What will it include?",
    } as LangString,
    shareActivitiesTitle: {
      el: "Μοιραστείτε Δράσεις",
      en: "Share activities",
    } as LangString,
    shareActivitiesDescription: {
      el: "Δημοσιεύστε τις δικές σας δραστηριότητες",
      en: "Publish your own classroom activities",
    } as LangString,
    ideasInspirationTitle: {
      el: "Ιδέες & Έμπνευση",
      en: "Ideas & inspiration",
    } as LangString,
    ideasInspirationDescription: {
      el: "Ανακαλύψτε τι κάνουν άλλοι",
      en: "Discover what other teachers are doing",
    } as LangString,
    bestPracticesTitle: {
      el: "Best Practices",
      en: "Best practices",
    } as LangString,
    bestPracticesDescription: {
      el: "Μάθετε από τους καλύτερους",
      en: "Learn from the best",
    } as LangString,
    updatesTitle: {
      el: "Ενημερώσεις",
      en: "Updates",
    } as LangString,
    updatesDescription: {
      el: "Γίνετε από τους πρώτους που θα έχουν πρόσβαση στην κοινότητα. Θα σας ειδοποιήσουμε μόλις είναι έτοιμη!",
      en: "Be among the first to access the community. We’ll notify you as soon as it’s ready!",
    } as LangString,
    updatesButton: {
      el: "Εγγραφή για ενημερώσεις",
      en: "Sign up for updates",
    } as LangString,
  },
  dashboard: {
    loadingText: {
      el: "Φόρτωση...",
      en: "Loading...",
    } as LangString,
    welcomeTitle: {
      el: "Καλώς ήρθατε στο Kids in Business",
      en: "Welcome to Kids in Business",
    } as LangString,
    welcomeSubtitle: {
      el: "Εμπνεύστε τους μαθητές σας να γίνουν οι επιχειρηματίες του αύριο",
      en: "Inspire your students to become the entrepreneurs of tomorrow",
    } as LangString,
    renameClassesTitle: {
      el: "Μετονομασία τμημάτων",
      en: "Rename classes",
    } as LangString,
    newClassTitle: {
      el: "Νέο τμήμα",
      en: "New class",
    } as LangString,
    newClassNamePlaceholder: {
      el: "Όνομα τμήματος",
      en: "Class name",
    } as LangString,
    newClassSchoolPlaceholder: {
      el: "Σχολείο (προαιρετικό)",
      en: "School (optional)",
    } as LangString,
    newClassGradePlaceholder: {
      el: "Τάξη (προαιρετικό)",
      en: "Grade (optional)",
    } as LangString,
    newClassYearPlaceholder: {
      el: "Σχολικό έτος (προαιρετικό)",
      en: "School year (optional)",
    } as LangString,
  },
  navigation: {
    logoAlt: {
      el: "Kids in Business",
      en: "Kids in Business",
    } as LangString,
    chapters: {
      el: "Μαθήματα",
      en: "Chapters",
    } as LangString,
    actions: {
      el: "Δράσεις",
      en: "Actions",
    } as LangString,
    teachers: {
      el: "Για Εκπαιδευτικούς",
      en: "For Teachers",
    } as LangString,
    community: {
      el: "Κοινότητα",
      en: "Community",
    } as LangString,
    signIn: {
      el: "Σύνδεση",
      en: "Sign in",
    } as LangString,
    signOut: {
      el: "Αποσύνδεση",
      en: "Sign out",
    } as LangString,
  },
  auth: {
    pageTitleLogin: {
      el: "Σύνδεση Εκπαιδευτικού",
      en: "Teacher Login",
    } as LangString,
    pageTitleSignup: {
      el: "Εγγραφή Εκπαιδευτικού",
      en: "Teacher Sign Up",
    } as LangString,
    pageSubtitleLogin: {
      el: "Εισάγετε τα στοιχεία σας για να αποκτήσετε πρόσβαση στις τάξεις σας",
      en: "Enter your credentials to access your classes",
    } as LangString,
    pageSubtitleSignup: {
      el: "Δημιουργήστε λογαριασμό για να διαχειρίζεστε τις τάξεις σας",
      en: "Create an account to manage your classes",
    } as LangString,
    emailLabel: {
      el: "Email",
      en: "Email",
    } as LangString,
    emailPlaceholder: {
      el: "teacher@school.edu",
      en: "teacher@school.edu",
    } as LangString,
    passwordLabel: {
      el: "Κωδικός",
      en: "Password",
    } as LangString,
    passwordPlaceholder: {
      el: "••••••••",
      en: "••••••••",
    } as LangString,
    submitLogin: {
      el: "Σύνδεση",
      en: "Log In",
    } as LangString,
    submitSignup: {
      el: "Εγγραφή",
      en: "Sign Up",
    } as LangString,
    loadingButton: {
      el: "Παρακαλώ περιμένετε...",
      en: "Please wait...",
    } as LangString,
    toggleToSignup: {
      el: "Δεν έχετε λογαριασμό; ",
      en: "Don't have an account? ",
    } as LangString,
    toggleToLogin: {
      el: "Έχετε ήδη λογαριασμό; ",
      en: "Already have an account? ",
    } as LangString,
    toggleSignupButton: {
      el: "Εγγραφή",
      en: "Sign up",
    } as LangString,
    toggleLoginButton: {
      el: "Σύνδεση",
      en: "Log in",
    } as LangString,
    toastLoginFailedTitle: {
      el: "Αποτυχία σύνδεσης",
      en: "Login failed",
    } as LangString,
    toastSignupFailedTitle: {
      el: "Αποτυχία εγγραφής",
      en: "Sign up failed",
    } as LangString,
    toastGenericErrorTitle: {
      el: "Σφάλμα",
      en: "Error",
    } as LangString,
    toastGenericErrorDescription: {
      el: "Προέκυψε ένα απρόσμενο σφάλμα. Προσπαθήστε ξανά.",
      en: "An unexpected error occurred. Please try again.",
    } as LangString,
    toastWelcomeBackTitle: {
      el: "Καλώς ήρθατε και πάλι!",
      en: "Welcome back!",
    } as LangString,
    toastWelcomeBackDescription: {
      el: "Συνδεθήκατε με επιτυχία.",
      en: "You've successfully logged in.",
    } as LangString,
    toastAccountCreatedTitle: {
      el: "Ο λογαριασμός δημιουργήθηκε!",
      en: "Account created!",
    } as LangString,
    toastAccountCreatedDescription: {
      el: "Μπορείτε τώρα να συνδεθείτε με τα στοιχεία σας.",
      en: "You can now log in with your credentials.",
    } as LangString,
  },
  generic: {
    indexTitle: {
      el: "Καλώς ήρθατε στην εφαρμογή σας",
      en: "Welcome to Your Blank App",
    } as LangString,
    indexSubtitle: {
      el: "Ξεκινήστε να χτίζετε το project σας εδώ!",
      en: "Start building your amazing project here!",
    } as LangString,
    notFoundSubtitle: {
      el: "Ουπς! Η σελίδα δεν βρέθηκε",
      en: "Oops! Page not found",
    } as LangString,
    notFoundBackLink: {
      el: "Επιστροφή στην αρχική",
      en: "Return to Home",
    } as LangString,
  },
  chapterDetail: {
    breadcrumbChapterLabel: {
      el: "Chapter",
      en: "Chapter",
    } as LangString,
    sectionOpening: {
      el: "Opening / Brand Intro",
      en: "Opening / Brand Intro",
    } as LangString,
    sectionLesson11: {
      el: "Lesson 1.1",
      en: "Lesson 1.1",
    } as LangString,
    sectionWhatIsEntrepreneurship: {
      el: "Τι είναι η επιχειρηματικότητα;",
      en: "What is entrepreneurship?",
    } as LangString,
    sectionLesson12: {
      el: "Lesson 1.2",
      en: "Lesson 1.2",
    } as LangString,
    sectionLesson13: {
      el: "Lesson 1.3",
      en: "Lesson 1.3",
    } as LangString,
    sectionMiniChallenge: {
      el: "Mini Challenge",
      en: "Mini Challenge",
    } as LangString,
    sectionClosing: {
      el: "Closing Ritual",
      en: "Closing Ritual",
    } as LangString,
    sectionReflection: {
      el: "Chapter Reflection",
      en: "Chapter Reflection",
    } as LangString,
    forTeacherLabel: {
      el: "Για τον εκπαιδευτικό",
      en: "For the teacher",
    } as LangString,
    forKidsLabel: {
      el: "Για τα παιδιά",
      en: "For students",
    } as LangString,
    miniChallengeKidsLabel: {
      el: "Οδηγίες για τα παιδιά:",
      en: "Instructions for students:",
    } as LangString,
    miniChallengeButton: {
      el: "Δες σχετικές δράσεις",
      en: "See related activities",
    } as LangString,
    worksheetsTitle: {
      el: "Οπτικά Worksheets – Χρηματοοικονομικός Γραμματισμός",
      en: "Visual worksheets – Financial literacy",
    } as LangString,
    worksheetsIntro: {
      el: "Κατέβασε και εκτύπωσε τα παρακάτω worksheets για να δουλέψετε στην τάξη τα εργαλεία Budgeting Tool και Pricing Simulator.",
      en: "Download and print the worksheets below to work with the Budgeting Tool and Pricing Simulator in class.",
    } as LangString,
    budgetingWorksheetCaption: {
      el: "Budgeting Tool – Πίνακας Εσόδων / Εξόδων",
      en: "Budgeting Tool – Income / Expenses table",
    } as LangString,
    budgetingWorksheetDownload: {
      el: "Λήψη εικόνας",
      en: "Download image",
    } as LangString,
    pricingWorksheetCaption: {
      el: "Pricing Simulator – Πίνακας Τιμής & Κέρδους",
      en: "Pricing Simulator – Price & Profit table",
    } as LangString,
    pricingWorksheetDownload: {
      el: "Λήψη εικόνας",
      en: "Download image",
    } as LangString,
    worksheetsTip: {
      el: "Tip: Αν θέλεις σε μορφή PDF, μπορείς να εκτυπώσεις τις εικόνες ως PDF από τον υπολογιστή σου πριν τις μοιράσεις στα παιδιά.",
      en: "Tip: If you prefer PDF, you can print the images to PDF on your computer before sharing them with students.",
    } as LangString,
  },
} as const;
