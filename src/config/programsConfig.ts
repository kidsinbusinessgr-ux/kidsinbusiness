import { BUSINESS_PLAN_CHAPTERS } from "@/config/chaptersConfig";

export interface Lesson {
  id: number;
  titleEl: string;
  titleEn: string;
  durationMin: number;
  objectiveEl?: string;
  objectiveEn?: string;
  warmupEl?: string;
  warmupEn?: string;
  activitiesEl?: string[];
  activitiesEn?: string[];
  tipEl?: string;
  tipEn?: string;
  reflectionEl?: string;
  reflectionEn?: string;
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
    descriptionEn: "The programme that helps children speak confidently in front of an audience, organise their thoughts and present ideas powerfully.",
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
          {
            id: 1,
            titleEl: "Τι κάνει μια καλή φωνή;",
            titleEn: "What makes a good voice?",
            durationMin: 15,
            objectiveEl: "Να καταλάβεις ότι η φωνή σου αξίζει να ακουστεί — χωρίς άγχος.",
            objectiveEn: "Understand that your voice deserves to be heard — without anxiety.",
            warmupEl: "3 βαθιές αναπνοές μαζί. Στάση όρθια, χαλαροί ώμοι, χαμόγελο. Είσαι έτοιμος/η!",
            warmupEn: "3 deep breaths together. Stand tall, relax your shoulders, smile. You're ready!",
            activitiesEl: [
              "🃏 Κάρτα 1: Πες το όνομά σου και 3 αγαπημένα σου χόμπι.",
              "🃏 Κάρτα 2: Περίγραψε τον εαυτό σου με ακριβώς 5 λέξεις.",
              "🃏 Κάρτα 3: Τι σε κάνει χαρούμενο/η; Εξήγησε γιατί."
            ],
            activitiesEn: [
              "🃏 Card 1: Say your name and 3 favourite hobbies.",
              "🃏 Card 2: Describe yourself in exactly 5 words.",
              "🃏 Card 3: What makes you happy? Explain why."
            ],
            tipEl: "💡 Το πρώτο βήμα δεν είναι να μιλήσεις τέλεια — είναι να μιλήσεις χωρίς φόβο. Μην διορθώνεις, απλώς άκου με ενδιαφέρον και κάνε 1 ερώτηση στο τέλος κάθε απάντησης.",
            tipEn: "💡 The first step is not to speak perfectly — it's to speak without fear. Don't correct, just listen with interest and ask 1 question after each answer.",
            reflectionEl: "Πώς ένιωσες όταν μιλούσες; Τι σου φάνηκε πιο εύκολο;",
            reflectionEn: "How did you feel when you spoke? What felt easiest?"
          },
          {
            id: 2,
            titleEl: "Ρυθμός και τόνος",
            titleEn: "Rhythm and tone",
            durationMin: 15,
            objectiveEl: "Να εξασκηθείς στον τόνο, την ένταση και τον ρυθμό της φωνής σου.",
            objectiveEn: "Practise tone, volume and rhythm in your voice.",
            warmupEl: "Πες τη λέξη «γεια» με 3 διαφορετικούς τρόπους: χαρούμενα, θυμωμένα, μυστηριωδώς.",
            warmupEn: "Say 'hello' in 3 different ways: happily, angrily, mysteriously.",
            activitiesEl: [
              "🃏 Κάρτα 11: Πες 'Μου αρέσει η σοκολάτα!' με 3 τρόπους: χαρούμενα, λυπημένα, ενθουσιασμένα.",
              "🃏 Κάρτα 12: Πες 'Σήμερα είναι Σάββατο!' σαν να είναι η καλύτερη μέρα της ζωής σου.",
              "🃏 Κάρτα 19: Πες μια πρόταση πολύ αργά και μετά πολύ γρήγορα — ποια ακούγεται καλύτερα;"
            ],
            activitiesEn: [
              "🃏 Card 11: Say 'I love chocolate!' in 3 ways: happily, sadly, enthusiastically.",
              "🃏 Card 12: Say 'Today is Saturday!' as if it's the best day of your life.",
              "🃏 Card 19: Say a sentence very slowly then very fast — which sounds better?"
            ],
            tipEl: "💡 Παίξτε το ίδιο παιχνίδι στο αυτοκίνητο ή στο τραπέζι. Η εξάσκηση σε καθημερινές στιγμές μετράει περισσότερο από ένα επίσημο 'μάθημα'.",
            tipEn: "💡 Play the same game in the car or at dinner. Practising in everyday moments counts more than a formal 'lesson'.",
            reflectionEl: "Ποια φωνή σου άρεσε να χρησιμοποιείς περισσότερο; Γιατί;",
            reflectionEn: "Which voice did you enjoy using most? Why?"
          },
          {
            id: 3,
            titleEl: "Εξάσκηση αναπνοής",
            titleEn: "Breathing exercises",
            durationMin: 15,
            objectiveEl: "Να μάθεις πώς η αναπνοή βοηθά στην ομιλία και μειώνει το άγχος.",
            objectiveEn: "Learn how breathing helps with speaking and reduces anxiety.",
            warmupEl: "Βαθιά αναπνοή: εισπνοή 4 δευτερόλεπτα → κράτα 4 → εκπνοή 4. Επανέλαβε 3 φορές.",
            warmupEn: "Deep breath: inhale 4 seconds → hold 4 → exhale 4. Repeat 3 times.",
            activitiesEl: [
              "🃏 Κάρτα 13: Μίλα για 30 δευτερόλεπτα με υπερβολικό ενθουσιασμό — μη σταματάς!",
              "🃏 Κάρτα 9: Μίλα για 1 λεπτό χωρίς να χρησιμοποιήσεις τη λέξη 'και'.",
              "🃏 Κάρτα 15: Μίλα για 10 δευτερόλεπτα σαν να είσαι πολύ κουρασμένος/η."
            ],
            activitiesEn: [
              "🃏 Card 13: Talk for 30 seconds with over-the-top enthusiasm — don't stop!",
              "🃏 Card 9: Talk for 1 minute without using the word 'and'.",
              "🃏 Card 15: Talk for 10 seconds as if you're very tired."
            ],
            tipEl: "💡 Μια αργή αναπνοή πριν μιλήσεις μειώνει το άγχος. Δοκίμασε αυτή την τεχνική πριν από κάθε παρουσίαση — έχει αποδειχθεί επιστημονικά!",
            tipEn: "💡 A slow breath before speaking reduces anxiety. Try this technique before every presentation — it's scientifically proven!",
            reflectionEl: "Πώς αισθάνεσαι μετά τις ασκήσεις αναπνοής; Νιώθεις διαφορά;",
            reflectionEn: "How do you feel after the breathing exercises? Do you notice a difference?"
          },
          {
            id: 4,
            titleEl: "Πρακτική: Διαβάζω δυνατά",
            titleEn: "Practice: Reading aloud",
            durationMin: 15,
            objectiveEl: "Να συνδυάσεις τόνο, ρυθμό και αναπνοή σε πραγματική ομιλία.",
            objectiveEn: "Combine tone, rhythm and breathing in real speech.",
            warmupEl: "Επανέλαβε γρήγορα: 'Πέτρος πήρε πέτρα, πέτρα πήρε ο Πέτρος'. Πόσες φορές το λες χωρίς λάθος;",
            warmupEn: "Say quickly: 'She sells seashells by the seashore'. How many times without mistakes?",
            activitiesEl: [
              "🃏 Κάρτα 14: Πες κάτι ψιθυρίζοντας — κάνε τους άλλους να σε ακούσουν χωρίς να σηκώσεις τη φωνή σου.",
              "🃏 Κάρτα 16: Διάβασε μια φράση σαν να είσαι θυμωμένος/η.",
              "🃏 Κάρτα 49: Μίλα για κάτι που αγαπάς χωρίς να χρησιμοποιήσεις τις λέξεις 'μου αρέσει'."
            ],
            activitiesEn: [
              "🃏 Card 14: Say something whispering — make others hear you without raising your voice.",
              "🃏 Card 16: Read a sentence as if you're angry.",
              "🃏 Card 49: Talk about something you love without using the words 'I like'."
            ],
            tipEl: "💡 Χρησιμοποίησε διαφορετικές ταχύτητες και τόνους για να κρατάς το κοινό ζωντανό. Η ποικιλία στη φωνή είναι το μυστικό των καλών ομιλητών.",
            tipEn: "💡 Use different speeds and tones to keep your audience engaged. Vocal variety is the secret of great speakers.",
            reflectionEl: "Ποια τεχνική φωνής σου ήρθε πιο φυσικά σήμερα;",
            reflectionEn: "Which voice technique felt most natural today?"
          }
        ]
      },
      {
        id: 2,
        titleEl: "Γλώσσα του Σώματος",
        titleEn: "Body Language",
        descriptionEl: "Πώς η στάση και οι κινήσεις μας επηρεάζουν το κοινό",
        descriptionEn: "How posture and movement affect the audience",
        emoji: "🕴️",
        lessons: [
          {
            id: 1,
            titleEl: "Στάση σώματος",
            titleEn: "Posture",
            durationMin: 15,
            objectiveEl: "Να καταλάβεις πώς η στάση σώματος επικοινωνεί αυτοπεποίθηση πριν πεις μια λέξη.",
            objectiveEn: "Understand how posture communicates confidence before you say a word.",
            warmupEl: "Στάση 'υπερήρωα': πόδια ανοιχτά, χέρια στη μέση, κεφάλι ψηλά — κράτα για 10 δευτερόλεπτα. Πώς νιώθεις;",
            warmupEn: "Superhero pose: feet wide, hands on hips, head high — hold for 10 seconds. How do you feel?",
            activitiesEl: [
              "🃏 Κάρτα 22: Στάσου όρθιος/α και δείξε αυτοπεποίθηση χωρίς να μιλάς καθόλου.",
              "🃏 Κάρτα 25: Αντίγραψε τις κινήσεις και τη γλώσσα σώματος κάποιου δίπλα σου.",
              "🃏 Συζήτηση: Ποια στάση δείχνει σιγουριά και ποια δείχνει άγχος; Δείξε και τις δύο."
            ],
            activitiesEn: [
              "🃏 Card 22: Stand up and show confidence without speaking at all.",
              "🃏 Card 25: Copy the movements and body language of someone next to you.",
              "🃏 Discussion: Which posture shows confidence and which shows anxiety? Demonstrate both."
            ],
            tipEl: "💡 Μην λες 'μην κοιτάς κάτω' σαν διόρθωση. Πες τι κάνει σωστά όταν συμβαίνει, ώστε να το επαναλάβει από μόνο του.",
            tipEn: "💡 Don't say 'don't look down' as a correction. Say what they're doing right when it happens, so they repeat it on their own.",
            reflectionEl: "Τι πρόσεξες στο σώμα σου όσο μιλούσες;",
            reflectionEn: "What did you notice about your body while you were speaking?"
          },
          {
            id: 2,
            titleEl: "Επαφή με τα μάτια",
            titleEn: "Eye contact",
            durationMin: 15,
            objectiveEl: "Να μάθεις πώς η επαφή με τα μάτια δημιουργεί σύνδεση με το κοινό.",
            objectiveEn: "Learn how eye contact creates a connection with the audience.",
            warmupEl: "Κοίτα ένα σημείο στον τοίχο για 10 δευτερόλεπτα χωρίς να ανοιγοκλείσεις τα μάτια. Δύσκολο;",
            warmupEn: "Stare at a point on the wall for 10 seconds without blinking. Hard?",
            activitiesEl: [
              "🃏 Κάρτα 17: Κάνε μια ερώτηση χρησιμοποιώντας μόνο την έκφραση του προσώπου σου — χωρίς λέξεις!",
              "🃏 Κάρτα 23: Παίξε παντομίμα — κάνε τους άλλους να μαντέψουν τι λες.",
              "🃏 Παιχνίδι καθρέφτη: ένας δείχνει στάση/έκφραση, ο άλλος αντιγράφει — μετά αντίστροφα."
            ],
            activitiesEn: [
              "🃏 Card 17: Ask a question using only your facial expression — no words!",
              "🃏 Card 23: Play mime — make others guess what you're saying.",
              "🃏 Mirror game: one person shows a pose/expression, the other copies — then swap."
            ],
            tipEl: "💡 Η επαφή με τα μάτια δεν είναι 'κοίταγμα' — είναι σύνδεση. Εναλλαγή βλέμματος κάθε 3-4 δευτερόλεπτα κάνει τον ομιλητή να φαίνεται φυσικός.",
            tipEn: "💡 Eye contact isn't 'staring' — it's connecting. Shifting your gaze every 3-4 seconds makes a speaker look natural.",
            reflectionEl: "Πότε ήταν πιο εύκολο να κοιτάς στα μάτια; Τι σε βοήθησε;",
            reflectionEn: "When was it easiest to make eye contact? What helped you?"
          },
          {
            id: 3,
            titleEl: "Χειρονομίες",
            titleEn: "Gestures",
            durationMin: 15,
            objectiveEl: "Να χρησιμοποιείς τα χέρια σου για να ενισχύεις αυτά που λες.",
            objectiveEn: "Use your hands to reinforce what you're saying.",
            warmupEl: "Πες 'μεγάλο', 'μικρό', 'δεξιά', 'αριστερά' μόνο με τα χέρια σου — χωρίς λόγια!",
            warmupEn: "Say 'big', 'small', 'right', 'left' only with your hands — no words!",
            activitiesEl: [
              "🃏 Κάρτα 20: Χρησιμοποίησε τα χέρια σου για να δώσεις έμφαση σε αυτά που λες.",
              "🃏 Κάρτα 26: Κάνε μια πρόταση χρησιμοποιώντας υπερβολικές κινήσεις χεριών.",
              "🃏 Κάρτα 27: Πες κάτι κουνώντας τα χέρια και μετά χωρίς χειρονομίες — υπάρχει διαφορά;"
            ],
            activitiesEn: [
              "🃏 Card 20: Use your hands to emphasise what you're saying.",
              "🃏 Card 26: Make a sentence using exaggerated hand gestures.",
              "🃏 Card 27: Say something with gestures then try without — is there a difference?"
            ],
            tipEl: "💡 Οι χειρονομίες ενισχύουν τα λόγια — αλλά μην τις κάνεις υπερβολικές. Φυσικές κινήσεις = φυσική επικοινωνία.",
            tipEn: "💡 Gestures reinforce words — but don't overdo them. Natural movements = natural communication.",
            reflectionEl: "Πώς άλλαξε η ομιλία σου όταν πρόσθεσες χειρονομίες;",
            reflectionEn: "How did your speech change when you added gestures?"
          },
          {
            id: 4,
            titleEl: "Εξάσκηση μπροστά στον καθρέφτη",
            titleEn: "Mirror practice",
            durationMin: 15,
            objectiveEl: "Να δεις τον εαυτό σου να μιλά και να ανακαλύψεις τι θέλεις να βελτιώσεις.",
            objectiveEn: "See yourself speak and discover what you want to improve.",
            warmupEl: "Κοίτα τον εαυτό σου στον καθρέφτη και χαμογέλα για 10 δευτερόλεπτα. Πώς νιώθεις;",
            warmupEn: "Look at yourself in the mirror and smile for 10 seconds. How do you feel?",
            activitiesEl: [
              "🃏 Κάρτα 18: Παρουσίασε το αγαπημένο σου φαγητό σαν να ήταν το πιο νόστιμο γεύμα του κόσμου!",
              "🃏 Κάρτα 29: Προσπάθησε να πεις 'είμαι θυμωμένος/η' χωρίς να μιλάς — μόνο με το σώμα σου.",
              "🃏 Κάρτα 30: Παρουσίασε κάτι σαν να είσαι ενθουσιασμένος/η, αλλά κράτα το πρόσωπό σου σοβαρό."
            ],
            activitiesEn: [
              "🃏 Card 18: Present your favourite food as if it's the most delicious meal in the world!",
              "🃏 Card 29: Try to say 'I am angry' without speaking — only with your body.",
              "🃏 Card 30: Present something as if you're excited, but keep your face completely serious."
            ],
            tipEl: "💡 Βιντεοσκόπησε τον εαυτό σου αν θέλεις — είναι το καλύτερο feedback! Δεν χρειάζεται να το δείξεις σε κανέναν.",
            tipEn: "💡 Record yourself if you want — it's the best feedback! You don't have to show it to anyone.",
            reflectionEl: "Τι πρόσεξες που θέλεις να αλλάξεις; Τι σου φάνηκε καλό;",
            reflectionEn: "What did you notice that you want to change? What seemed good?"
          }
        ]
      },
      {
        id: 3,
        titleEl: "Δομώ την Παρουσίασή μου",
        titleEn: "Structuring My Presentation",
        descriptionEl: "Αρχή, μέση, τέλος — πώς να οργανώνω αυτά που θέλω να πω",
        descriptionEn: "Beginning, middle, end — how to organise what I want to say",
        emoji: "📋",
        lessons: [
          {
            id: 1,
            titleEl: "Πώς ξεκινώ;",
            titleEn: "How do I start?",
            durationMin: 15,
            objectiveEl: "Να μάθεις να φτιάχνεις μια δυνατή αρχή που τραβά την προσοχή αμέσως.",
            objectiveEn: "Learn to create a strong opening that grabs attention immediately.",
            warmupEl: "Πείτε μαζί μια φανταστική ιστορία, εναλλάξ, μια πρόταση ο καθένας. Πού φτάσατε;",
            warmupEn: "Tell a fantasy story together, alternating one sentence each. Where did you end up?",
            activitiesEl: [
              "🃏 Κάρτα 5: Αφηγήσου μια ιστορία για μια διασκεδαστική μέρα σου — ξεκίνα με κάτι εντυπωσιακό!",
              "🃏 Κάρτα 31: Αφηγήσου ιστορία που ξεκινά: 'Μια φορά κι έναν καιρό, βρήκα έναν μαγικό χάρτη...'",
              "🃏 Κάρτα 32: Αν ήσουν σούπερ ήρωας, ποιο θα ήταν το όνομά σου και ποιες οι δυνάμεις σου;"
            ],
            activitiesEn: [
              "🃏 Card 5: Tell a story about a fun day — start with something impressive!",
              "🃏 Card 31: Tell a story that starts: 'Once upon a time, I found a magic map...'",
              "🃏 Card 32: If you were a superhero, what would your name be and what powers would you have?"
            ],
            tipEl: "💡 Η αρχή είναι η πιο σημαντική στιγμή — πρέπει να 'πιάσεις' το κοινό στα πρώτα 10 δευτερόλεπτα. Μια ερώτηση, μια αστεία παρατήρηση ή ένα εκπληκτικό γεγονός κάνουν θαύματα.",
            tipEn: "💡 The opening is the most important moment — you need to 'hook' the audience in the first 10 seconds. A question, funny observation or surprising fact works wonders.",
            reflectionEl: "Ποιο άνοιγμα σου φάνηκε πιο ελκυστικό; Γιατί;",
            reflectionEn: "Which opening felt most engaging? Why?"
          },
          {
            id: 2,
            titleEl: "Πώς αναπτύσσω τη σκέψη μου;",
            titleEn: "How do I develop my thought?",
            durationMin: 15,
            objectiveEl: "Να μάθεις να οργανώνεις ιδέες με αρχή–μέση–τέλος.",
            objectiveEn: "Learn to organise ideas with a beginning–middle–end.",
            warmupEl: "Εξάσκηση δομής: Πού ήμουν; → Τι συνέβη; → Τι έκανα; → Πώς τελείωσε; Δοκίμασε με μια πρόσφατη μέρα σου.",
            warmupEn: "Structure practice: Where was I? → What happened? → What did I do? → How did it end? Try with a recent day.",
            activitiesEl: [
              "🃏 Κάρτα 33: Διάλεξε 3 αντικείμενα και φτιάξε ιστορία όπου θα είναι οι πρωταγωνιστές!",
              "🃏 Κάρτα 34: Πες μια αστεία ιστορία από τη ζωή σου — με αρχή, μέση, τέλος.",
              "🃏 Κάρτα 35: Περίγραψε το αγαπημένο σου παραμύθι/βιβλίο με δικά σου λόγια."
            ],
            activitiesEn: [
              "🃏 Card 33: Choose 3 objects and create a story where they are the main characters!",
              "🃏 Card 34: Tell a funny story from your life — with beginning, middle, end.",
              "🃏 Card 35: Describe your favourite fairy tale/book in your own words."
            ],
            tipEl: "💡 Αν κολλήσει, ρώτα 'και μετά τι έγινε;' αντί να δώσεις την απάντηση. Ιστορίες από πραγματικά περιστατικά (σχολείο, φίλοι) βοηθούν περισσότερο.",
            tipEn: "💡 If they get stuck, ask 'and then what happened?' instead of giving the answer. Stories from real events (school, friends) help more.",
            reflectionEl: "Ποιο κομμάτι της ιστορίας σου ήταν το πιο σημαντικό για σένα;",
            reflectionEn: "Which part of your story was most important to you?"
          },
          {
            id: 3,
            titleEl: "Πώς κλείνω δυνατά;",
            titleEn: "How do I close strongly?",
            durationMin: 15,
            objectiveEl: "Να φτιάξεις ένα τέλος που μένει στη μνήμη του κοινού.",
            objectiveEn: "Create an ending that stays in the audience's memory.",
            warmupEl: "Σκέψου την τελευταία ταινία/βιβλίο που είδες/διάβασες — ποιο ήταν το πιο αξέχαστο κομμάτι;",
            warmupEn: "Think about the last film/book you watched/read — what was the most memorable part?",
            activitiesEl: [
              "🃏 Κάρτα 36: Αν μπορούσες να εφεύρεις κάτι, τι θα ήταν και πώς θα το παρουσίαζες στον κόσμο;",
              "🃏 Κάρτα 37: Αν μπορούσες να αλλάξεις ένα πράγμα στον κόσμο, τι θα ήταν;",
              "🃏 Κάρτα 39: Πες μια ιστορία με ένα πρόβλημα και μια λύση — τελείωσε δυνατά!"
            ],
            activitiesEn: [
              "🃏 Card 36: If you could invent something, what would it be and how would you present it to the world?",
              "🃏 Card 37: If you could change one thing in the world, what would it be?",
              "🃏 Card 39: Tell a story with a problem and a solution — end strongly!"
            ],
            tipEl: "💡 Το τέλος πρέπει να αφήνει κάτι στο κοινό: ένα συναίσθημα, μια σκέψη, ή μια αξέχαστη εικόνα. Ποτέ μην τελειώνεις με 'εντάξει, τελείωσα'!",
            tipEn: "💡 The ending must leave something with the audience: a feeling, a thought, or an unforgettable image. Never end with 'OK, I'm done'!",
            reflectionEl: "Πώς θα ήθελες το κοινό να νιώθει στο τέλος της ομιλίας σου;",
            reflectionEn: "How do you want the audience to feel at the end of your speech?"
          },
          {
            id: 4,
            titleEl: "Γράφω το δικό μου σενάριο",
            titleEn: "Writing my own script",
            durationMin: 15,
            objectiveEl: "Να φτιάξεις μια ολοκληρωμένη μικρή παρουσίαση από την αρχή ως το τέλος.",
            objectiveEn: "Create a complete short presentation from beginning to end.",
            warmupEl: "Δώσε στον εαυτό σου 2 λεπτά για προετοιμασία πριν μιλήσεις. Η προετοιμασία μειώνει το άγχος!",
            warmupEn: "Give yourself 2 minutes to prepare before speaking. Preparation reduces anxiety!",
            activitiesEl: [
              "🃏 Κάρτα 38: Διάλεξε ένα ζώο και πες μια ιστορία με τη δική του 'ματιά'.",
              "🃏 Κάρτα 48: Ετοίμασε παρουσίαση 30 δευτερολέπτων για ένα φανταστικό προϊόν.",
              "🃏 Κάρτα 8: Φτιάξε μια πρόταση χρησιμοποιώντας 3 τυχαίες λέξεις που θα σου δοθούν!"
            ],
            activitiesEn: [
              "🃏 Card 38: Choose an animal and tell a story from its point of view.",
              "🃏 Card 48: Prepare a 30-second presentation for an imaginary product.",
              "🃏 Card 8: Create a sentence using 3 random words you'll be given!"
            ],
            tipEl: "💡 Μια καλή παρουσίαση: δυνατή αρχή + σαφές μέσο + αξέχαστο τέλος. Αν θέλει να ξαναδοκιμάσει, αφήστε το — η επανάληψη με ευχαρίστηση χτίζει άνεση!",
            tipEn: "💡 A good presentation: strong opening + clear middle + memorable end. If they want to try again, let them — repetition with pleasure builds confidence!",
            reflectionEl: "Τι θα άλλαζες στο σενάριό σου αν το έκανες ξανά;",
            reflectionEn: "What would you change in your script if you did it again?"
          }
        ]
      },
      {
        id: 4,
        titleEl: "Ομιλώ Μπροστά σε Κοινό",
        titleEn: "Speaking in Front of an Audience",
        descriptionEl: "Πρακτικές παρουσιάσεις, feedback και αντιμετώπιση του άγχους",
        descriptionEn: "Practical presentations, feedback and managing nerves",
        emoji: "🏆",
        lessons: [
          {
            id: 1,
            titleEl: "Αντιμετωπίζω το άγχος μου",
            titleEn: "Managing my nerves",
            durationMin: 15,
            objectiveEl: "Να μάθεις τεχνικές για να μετατρέψεις το άγχος σε ενέργεια.",
            objectiveEn: "Learn techniques to turn nerves into energy.",
            warmupEl: "Θυμήσου 1 πράγμα που πήγε καλά σε κάποια από τις προηγούμενες ασκήσεις. Πες το δυνατά!",
            warmupEn: "Remember 1 thing that went well in a previous exercise. Say it out loud!",
            activitiesEl: [
              "🃏 Κάρτα 41: Πείσε μας γιατί το παγωτό είναι το καλύτερο φαγητό στον κόσμο!",
              "🃏 Κάρτα 42: Είσαι πωλητής και πρέπει να πουλήσεις ένα αόρατο προϊόν — πείσε μας!",
              "🃏 Κάρτα 43: Ανάφερε 3 λόγους για τους οποίους το σχολείο θα έπρεπε να έχει διάλειμμα 2 ωρών."
            ],
            activitiesEn: [
              "🃏 Card 41: Convince us why ice cream is the best food in the world!",
              "🃏 Card 42: You're a salesperson who must sell an invisible product — convince us!",
              "🃏 Card 43: Give 3 reasons why school should have a 2-hour break."
            ],
            tipEl: "💡 Το άγχος πριν την ομιλία είναι φυσιολογικό — ακόμα και οι επαγγελματίες το νιώθουν. Η διαφορά είναι ότι χρησιμοποιούν αυτή την ενέργεια για να μιλήσουν με πάθος.",
            tipEn: "💡 Nerves before speaking are normal — even professionals feel them. The difference is they use that energy to speak with passion.",
            reflectionEl: "Πώς ένιωσες πριν, κατά τη διάρκεια και μετά; Τι άλλαξε;",
            reflectionEn: "How did you feel before, during, and after? What changed?"
          },
          {
            id: 2,
            titleEl: "Πρόβα γενική",
            titleEn: "Full rehearsal",
            durationMin: 15,
            objectiveEl: "Να συνδυάσεις φωνή, σώμα και ιστορία σε μία ολοκληρωμένη παρουσίαση.",
            objectiveEn: "Combine voice, body and story in one complete presentation.",
            warmupEl: "Επανέλαβε τη στάση 'υπερήρωα' (Κεφ. 2) και 3 αναπνοές (Κεφ. 1). Είσαι έτοιμος/η!",
            warmupEn: "Repeat the 'superhero' pose (Ch. 2) and 3 deep breaths (Ch. 1). You're ready!",
            activitiesEl: [
              "🃏 Κάρτα 44: Μίλα για 1 λεπτό χωρίς να χρησιμοποιήσεις τις λέξεις 'ναι' ή 'όχι'.",
              "🃏 Κάρτα 45: Περίγραψε το αγαπημένο σου βιβλίο/ταινία σαν να το διαφημίζεις!",
              "🃏 Κάρτα 47: Φαντάσου ότι πρέπει να πείσεις τους γονείς σου να σου αγοράσουν κάτι — πώς;"
            ],
            activitiesEn: [
              "🃏 Card 44: Talk for 1 minute without using the words 'yes' or 'no'.",
              "🃏 Card 45: Describe your favourite book/film as if you're advertising it!",
              "🃏 Card 47: Imagine you have to convince your parents to buy you something — how?"
            ],
            tipEl: "💡 Αν θέλει να ξαναδοκιμάσει, αφήστε το. Η επανάληψη με ευχαρίστηση χτίζει άνεση πολύ πιο γρήγορα από μία 'τέλεια' προσπάθεια.",
            tipEn: "💡 If they want to try again, let them. Repetition with pleasure builds confidence much faster than one 'perfect' attempt.",
            reflectionEl: "Ποια δεξιότητα (φωνή, σώμα, ιστορία) ένιωσες πιο δυνατή σήμερα;",
            reflectionEn: "Which skill (voice, body, story) felt strongest today?"
          },
          {
            id: 3,
            titleEl: "Ζωντανή παρουσίαση",
            titleEn: "Live presentation",
            durationMin: 15,
            objectiveEl: "Να κάνεις την πρώτη σου πλήρη παρουσίαση μπροστά σε πραγματικό κοινό.",
            objectiveEn: "Do your first full presentation in front of a real audience.",
            warmupEl: "Μάζεψε 'κοινό' 2-3 ατόμων (οικογένεια, φίλους ή ακόμα και λούτρινα ζωάκια!). Χειροκρότα τον εαυτό σου πριν ξεκινήσεις!",
            warmupEn: "Gather an 'audience' of 2-3 (family, friends or stuffed animals!). Clap for yourself before you start!",
            activitiesEl: [
              "🃏 Κάρτα 46: Αν ήσουν ο δήμαρχος της πόλης σου, ποιο το πρώτο πράγμα που θα άλλαζες;",
              "🃏 Κάρτα 50: Παρουσίασε τον εαυτό σου σαν να είσαι υποψήφιος/α για αρχηγός ομάδας!",
              "🎤 Τελική πρόκληση: Παρουσίαση 1 λεπτού για οτιδήποτε αγαπάς. Μίλα στο κοινό σου!"
            ],
            activitiesEn: [
              "🃏 Card 46: If you were the mayor, what would be the first thing you'd change?",
              "🃏 Card 50: Present yourself as a candidate to lead a team!",
              "🎤 Final challenge: 1-minute presentation about anything you love. Speak to your audience!"
            ],
            tipEl: "💡 Χειροκρότημα στο τέλος, ό,τι κι αν έγινε. Το μήνυμα: 'άξιζε που προσπάθησες', όχι 'ήταν τέλειο'.",
            tipEn: "💡 Applause at the end, regardless of the outcome. The message: 'it was worth trying', not 'it was perfect'.",
            reflectionEl: "Στάθηκες μπροστά σε όλους και μίλησες — αυτό είναι θάρρος! Πώς ένιωσες;",
            reflectionEn: "You stood in front of everyone and spoke — that's courage! How did you feel?"
          },
          {
            id: 4,
            titleEl: "Ανατροφοδότηση & βελτίωση",
            titleEn: "Feedback & improvement",
            durationMin: 15,
            objectiveEl: "Να δεις την πρόοδό σου και να γιορτάσεις αυτά που κατάφερες.",
            objectiveEn: "See your progress and celebrate what you have achieved.",
            warmupEl: "Θυμήσου μία στιγμή από κάθε κεφάλαιο που σου άρεσε. Μοιράσου την με τους άλλους!",
            warmupEn: "Remember one moment from each chapter that you liked. Share it with others!",
            activitiesEl: [
              "⭐ Διάλεξε την αγαπημένη σου κάρτα από όλο το πρόγραμμα και κάνε την ξανά — πόσο διαφορετικά νιώθεις τώρα;",
              "🎤 Τελική παρουσίαση: Ετοίμασε μια 'τελική παρουσίαση' 1-2 λεπτών για την οικογένεια.",
              "🏆 Γιόρτασε: Δώσε έναν έπαινο στον εαυτό σου για κάθε πράγμα που βελτιώθηκες!"
            ],
            activitiesEn: [
              "⭐ Choose your favourite card from the whole programme and do it again — how different do you feel now?",
              "🎤 Final presentation: Prepare a 1-2 minute 'final presentation' for the family.",
              "🏆 Celebrate: Give yourself a compliment for every thing you improved!"
            ],
            tipEl: "💡 Κλείστε με εορταστικό κλίμα, όχι αξιολόγηση. Η αυτοπεποίθηση χτίζεται με μικρές, συνεπείς στιγμές. Θυμήσου πού ήσουν στο Μάθημα 1!",
            tipEn: "💡 Close with a celebratory mood, not evaluation. Confidence is built with small, consistent moments. Remember where you were in Lesson 1!",
            reflectionEl: "Τι θα ήθελες να πεις την επόμενη φορά που θα μιλήσεις μπροστά σε κοινό;",
            reflectionEn: "What would you like to say the next time you speak in front of an audience?"
          }
        ]
      }
    ]
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
