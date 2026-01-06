import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";
import budgetingWorksheet from "@/assets/worksheet-budgeting-tool.png";
import pricingWorksheet from "@/assets/worksheet-pricing-simulator.png";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const chapterTitles: Record<string, string> = {
  "1": "Τι είναι η Επιχειρηματικότητα;",
  "2": "Ιδέες & Δημιουργικότητα",
  "3": "Από την Ιδέα στη Δράση",
  "4": "Συνεργασία & Ρόλοι",
  "5": "Παρουσιάζω την Ιδέα μου",
  "6": "Χρηματοοικονομικός Γραμματισμός",
};

type ChapterContent = {
  openingParagraphs: string[];
  lesson1Title: string;
  storyParagraphs: string[];
  teacherStoryNote: string;
  definitionKids: string;
  definitionTeacher: string;
  lesson2Title: string;
  lesson2Paragraphs: string[];
  activityTitle: string;
  activitySteps: string[];
  activityTeacherNote: string;
  lesson3Title: string;
  lesson3Prompts: string[];
  lesson3Closing: string;
  miniChallengeTitle: string;
  miniChallengeInstructions: string[];
  closingTitle: string;
  closingText: string;
  reflectionTitle: string;
  reflectionQuestions: string[];
};

const chapterContent: Record<string, ChapterContent> = {
  "1": {
    openingParagraphs: [
      "Η επιχειρηματικότητα είναι η ικανότητα να δημιουργείς και να αναπτύσσεις νέες ιδέες που μπορούν να γίνουν πραγματικότητα.",
      "Είναι η διαδικασία να βρίσκεις λύσεις σε προβλήματα και να δημιουργείς αξία για τους άλλους.",
    ],
    lesson1Title: "Η Ιστορία της Επιχειρηματικότητας",
    storyParagraphs: [
      "Μια φορά κι έναν καιρό, υπήρχε ένα παιδί που είχε μια ιδέα για ένα νέο παιχνίδι.",
      "Αυτό το παιδί αποφάσισε να δημιουργήσει το παιχνίδι και να το μοιραστεί με τους φίλους του.",
    ],
    teacherStoryNote:
      "Αυτή η ιστορία δείχνει πώς μια απλή ιδέα μπορεί να γίνει κάτι μεγάλο με προσπάθεια και φαντασία.",
    definitionKids:
      "Η επιχειρηματικότητα σημαίνει να φτιάχνεις κάτι νέο και χρήσιμο.",
    definitionTeacher:
      "Η επιχειρηματικότητα είναι η διαδικασία δημιουργίας, ανάπτυξης και διαχείρισης μιας επιχείρησης ή ενός έργου με σκοπό την επίτευξη κέρδους ή κοινωνικού οφέλους.",
    lesson2Title: "Τι Είναι Επιχειρηματικότητα;",
    lesson2Paragraphs: [
      "Η επιχειρηματικότητα δεν είναι μόνο για μεγάλες εταιρείες, αλλά και για μικρές ιδέες που μπορούν να αλλάξουν τον κόσμο.",
      "Όλοι μπορούμε να είμαστε επιχειρηματίες αν έχουμε φαντασία και θέληση.",
    ],
    activityTitle: "Δραστηριότητα: Βρες μια Ιδέα",
    activitySteps: [
      "Σκέψου ένα πρόβλημα που βλέπεις γύρω σου.",
      "Σκέψου μια λύση που θα μπορούσε να βοηθήσει.",
      "Σχεδίασε πώς θα υλοποιήσεις αυτή τη λύση.",
    ],
    activityTeacherNote:
      "Ενθαρρύνετε τα παιδιά να σκεφτούν δημιουργικά και να μοιραστούν τις ιδέες τους με την ομάδα.",
    lesson3Title: "Σκέψεις και Ερωτήσεις",
    lesson3Prompts: [
      "Ποια ήταν η αγαπημένη σου στιγμή στην ιστορία;",
      "Τι θα ήθελες να δημιουργήσεις εσύ;",
    ],
    lesson3Closing:
      "Η επιχειρηματικότητα είναι μια περιπέτεια που ξεκινά με μια ιδέα και μπορεί να αλλάξει τον κόσμο.",
    miniChallengeTitle: "Mini Challenge: Δημιούργησε το δικό σου προϊόν",
    miniChallengeInstructions: [
      "Σχεδίασε ένα προϊόν που θα ήθελες να φτιάξεις.",
      "Γράψε πώς θα το προωθήσεις στους φίλους σου.",
    ],
    closingTitle: "Κλείσιμο",
    closingText:
      "Συγχαρητήρια που ολοκλήρωσες το πρώτο κεφάλαιο! Είσαι έτοιμος για την επόμενη πρόκληση.",
    reflectionTitle: "Αναστοχασμός",
    reflectionQuestions: [
      "Τι έμαθες για την επιχειρηματικότητα;",
      "Πώς μπορείς να χρησιμοποιήσεις αυτές τις γνώσεις στην καθημερινότητά σου;",
    ],
  },
  "2": {
    openingParagraphs: [
      "Η δημιουργικότητα είναι η ικανότητα να φαντάζεσαι νέες ιδέες και να τις κάνεις πραγματικότητα.",
      "Η επιχειρηματικότητα βασίζεται πολύ στη δημιουργικότητα και την καινοτομία.",
    ],
    lesson1Title: "Η Δύναμη της Δημιουργικότητας",
    storyParagraphs: [
      "Μια ομάδα παιδιών αποφάσισε να φτιάξει κάτι μοναδικό για το σχολείο τους.",
      "Χρησιμοποίησαν τη φαντασία τους και συνεργάστηκαν για να δημιουργήσουν ένα νέο παιχνίδι.",
    ],
    teacherStoryNote:
      "Η συνεργασία και η δημιουργικότητα είναι βασικά στοιχεία για την επιτυχία.",
    definitionKids:
      "Η δημιουργικότητα είναι να φτιάχνεις καινούργια πράγματα με τη φαντασία σου.",
    definitionTeacher:
      "Η δημιουργικότητα είναι η ικανότητα να παράγεις νέες και πρωτότυπες ιδέες, λύσεις ή έργα.",
    lesson2Title: "Πώς να Ενισχύσεις τη Δημιουργικότητά σου",
    lesson2Paragraphs: [
      "Προσπάθησε να βλέπεις τα πράγματα από διαφορετική οπτική.",
      "Μην φοβάσαι να κάνεις λάθη, γιατί από αυτά μαθαίνουμε.",
    ],
    activityTitle: "Δραστηριότητα: Δημιουργικό Brainstorming",
    activitySteps: [
      "Σκέψου 10 διαφορετικές χρήσεις για ένα απλό αντικείμενο, όπως ένα μολύβι.",
      "Μοιράσου τις ιδέες σου με την ομάδα και συζητήστε ποιες είναι οι πιο πρωτότυπες.",
    ],
    activityTeacherNote:
      "Ενθαρρύνετε την ελεύθερη σκέψη και την αποδοχή όλων των ιδεών χωρίς κριτική.",
    lesson3Title: "Σκέψεις και Ερωτήσεις",
    lesson3Prompts: [
      "Ποια ιδέα σου άρεσε περισσότερο;",
      "Πώς μπορείς να χρησιμοποιήσεις τη δημιουργικότητά σου στην καθημερινή ζωή;",
    ],
    lesson3Closing:
      "Η δημιουργικότητα είναι το κλειδί για να φέρεις νέες ιδέες στον κόσμο.",
    miniChallengeTitle: "Mini Challenge: Δημιούργησε κάτι νέο",
    miniChallengeInstructions: [
      "Χρησιμοποίησε υλικά που έχεις στο σπίτι για να φτιάξεις ένα πρωτότυπο αντικείμενο.",
      "Περιέγραψε τη διαδικασία και το αποτέλεσμα.",
    ],
    closingTitle: "Κλείσιμο",
    closingText:
      "Συγχαρητήρια! Έμαθες πώς να χρησιμοποιείς τη δημιουργικότητά σου για να φέρεις αλλαγές.",
    reflectionTitle: "Αναστοχασμός",
    reflectionQuestions: [
      "Πώς ένιωσες όταν δημιουργούσες;",
      "Ποια ήταν η πιο δύσκολη στιγμή και πώς την ξεπέρασες;",
    ],
  },
  "3": {
    openingParagraphs: [
      "Η μετάβαση από την ιδέα στη δράση είναι το πιο σημαντικό βήμα στην επιχειρηματικότητα.",
      "Χρειάζεται θάρρος, οργάνωση και επιμονή για να υλοποιήσεις τα όνειρά σου.",
    ],
    lesson1Title: "Από την Ιδέα στη Δράση",
    storyParagraphs: [
      "Ένα παιδί είχε μια ιδέα για μια εφαρμογή που βοηθά τους συμμαθητές του.",
      "Άρχισε να σχεδιάζει, να μαθαίνει και να δουλεύει σκληρά για να την υλοποιήσει.",
    ],
    teacherStoryNote:
      "Η υλοποίηση μιας ιδέας απαιτεί πλάνο και προσπάθεια, όχι μόνο φαντασία.",
    definitionKids:
      "Η δράση σημαίνει να κάνεις πράγματα για να πραγματοποιήσεις την ιδέα σου.",
    definitionTeacher:
      "Η μετάβαση από την ιδέα στη δράση περιλαμβάνει τον σχεδιασμό, την υλοποίηση και την αξιολόγηση των βημάτων για την επίτευξη ενός στόχου.",
    lesson2Title: "Προγραμματισμός και Οργάνωση",
    lesson2Paragraphs: [
      "Κάνε ένα σχέδιο με τα βήματα που πρέπει να ακολουθήσεις.",
      "Οργάνωσε τον χρόνο και τους πόρους σου για να πετύχεις το στόχο σου.",
    ],
    activityTitle: "Δραστηριότητα: Σχεδίασε το Πλάνο σου",
    activitySteps: [
      "Γράψε τα βήματα που χρειάζονται για να υλοποιήσεις μια ιδέα σου.",
      "Σκέψου τι χρειάζεσαι για κάθε βήμα και πώς θα το κάνεις.",
    ],
    activityTeacherNote:
      "Βοηθήστε τα παιδιά να κατανοήσουν τη σημασία του σχεδιασμού και της οργάνωσης.",
    lesson3Title: "Σκέψεις και Ερωτήσεις",
    lesson3Prompts: [
      "Ποιο βήμα σου φαίνεται πιο δύσκολο;",
      "Πώς θα αντιμετωπίσεις τις δυσκολίες που μπορεί να προκύψουν;",
    ],
    lesson3Closing:
      "Η δράση είναι το κλειδί για να κάνεις τις ιδέες σου πραγματικότητα.",
    miniChallengeTitle: "Mini Challenge: Υλοποίησε μια μικρή ιδέα",
    miniChallengeInstructions: [
      "Επίλεξε μια απλή ιδέα και κάνε το πρώτο βήμα για να την υλοποιήσεις.",
      "Κατέγραψε την εμπειρία σου και τι έμαθες.",
    ],
    closingTitle: "Κλείσιμο",
    closingText:
      "Μπράβο! Έκανες το πρώτο βήμα για να γίνεις επιχειρηματίας.",
    reflectionTitle: "Αναστοχασμός",
    reflectionQuestions: [
      "Τι σε ενθουσίασε περισσότερο στη διαδικασία;",
      "Πώς θα συνεχίσεις από εδώ και πέρα;",
    ],
  },
  "4": {
    openingParagraphs: [
      "Η συνεργασία και οι ρόλοι είναι σημαντικά για να πετύχει μια ομάδα.",
      "Κάθε μέλος έχει κάτι μοναδικό να προσφέρει.",
    ],
    lesson1Title: "Η Δύναμη της Ομάδας",
    storyParagraphs: [
      "Μια ομάδα παιδιών αποφάσισε να φτιάξει μια επιχείρηση μαζί.",
      "Ο καθένας ανέλαβε διαφορετικό ρόλο και συνεργάστηκαν για να πετύχουν.",
    ],
    teacherStoryNote:
      "Η συνεργασία και ο σεβασμός στους ρόλους βοηθούν στην επιτυχία.",
    definitionKids:
      "Η συνεργασία σημαίνει να δουλεύουμε μαζί για έναν κοινό στόχο.",
    definitionTeacher:
      "Η συνεργασία είναι η διαδικασία όπου άτομα με διαφορετικές δεξιότητες και ρόλους συνεργάζονται για να πετύχουν έναν κοινό στόχο.",
    lesson2Title: "Ρόλοι και Ευθύνες",
    lesson2Paragraphs: [
      "Κάθε μέλος της ομάδας έχει συγκεκριμένες ευθύνες.",
      "Η καλή επικοινωνία βοηθά να δουλεύουμε καλύτερα μαζί.",
    ],
    activityTitle: "Δραστηριότητα: Καθορισμός Ρόλων",
    activitySteps: [
      "Σχημάτισε μια ομάδα και συζητήστε ποιος θα κάνει τι.",
      "Γράψτε τους ρόλους και τις ευθύνες κάθε μέλους.",
    ],
    activityTeacherNote:
      "Ενθαρρύνετε την ανοιχτή συζήτηση και την αποδοχή διαφορετικών απόψεων.",
    lesson3Title: "Σκέψεις και Ερωτήσεις",
    lesson3Prompts: [
      "Ποιος ρόλος σου ταιριάζει περισσότερο;",
      "Πώς μπορείς να βοηθήσεις την ομάδα σου καλύτερα;",
    ],
    lesson3Closing:
      "Η συνεργασία κάνει την ομάδα πιο δυνατή και επιτυχημένη.",
    miniChallengeTitle: "Mini Challenge: Δούλεψε σε Ομάδα",
    miniChallengeInstructions: [
      "Οργάνωσε μια μικρή ομάδα για να κάνετε μια δραστηριότητα μαζί.",
      "Καταγράψτε πώς συνεργαστήκατε και τι μάθατε.",
    ],
    closingTitle: "Κλείσιμο",
    closingText:
      "Συγχαρητήρια! Έμαθες πόσο σημαντική είναι η συνεργασία.",
    reflectionTitle: "Αναστοχασμός",
    reflectionQuestions: [
      "Πώς ένιωσες όταν συνεργάστηκες με άλλους;",
      "Τι θα ήθελες να βελτιώσεις στην ομάδα σου;",
    ],
  },
  "5": {
    openingParagraphs: [
      "Η παρουσίαση της ιδέας σου είναι σημαντική για να την καταλάβουν οι άλλοι.",
      "Πρέπει να είσαι σαφής, ενθουσιώδης και προετοιμασμένος.",
    ],
    lesson1Title: "Πώς να Παρουσιάσεις την Ιδέα σου",
    storyParagraphs: [
      "Ένα παιδί παρουσίασε την ιδέα του σε μια ομάδα και κέρδισε το ενδιαφέρον τους.",
      "Χρησιμοποίησε εικόνες και παραδείγματα για να εξηγήσει καλύτερα.",
    ],
    teacherStoryNote:
      "Η καλή παρουσίαση μπορεί να κάνει τη διαφορά στην αποδοχή μιας ιδέας.",
    definitionKids:
      "Η παρουσίαση είναι να λες την ιδέα σου με τρόπο που να την καταλαβαίνουν όλοι.",
    definitionTeacher:
      "Η παρουσίαση είναι η διαδικασία επικοινωνίας μιας ιδέας ή προϊόντος με σαφήνεια και πειστικότητα σε ένα κοινό.",
    lesson2Title: "Τεχνικές Παρουσίασης",
    lesson2Paragraphs: [
      "Χρησιμοποίησε απλά λόγια και παραδείγματα.",
      "Κράτα επαφή με το κοινό και μίλα με ενθουσιασμό.",
    ],
    activityTitle: "Δραστηριότητα: Προετοιμασία Παρουσίασης",
    activitySteps: [
      "Ετοίμασε μια σύντομη παρουσίαση για μια ιδέα σου.",
      "Πρόβαρε την παρουσίαση μπροστά σε φίλους ή οικογένεια.",
    ],
    activityTeacherNote:
      "Βοηθήστε τα παιδιά να νιώσουν άνετα και να εκφραστούν ελεύθερα.",
    lesson3Title: "Σκέψεις και Ερωτήσεις",
    lesson3Prompts: [
      "Ποιο μέρος της παρουσίασης σου άρεσε περισσότερο;",
      "Πώς θα βελτίωνες την παρουσίασή σου την επόμενη φορά;",
    ],
    lesson3Closing:
      "Η καλή παρουσίαση ανοίγει πόρτες και φέρνει νέες ευκαιρίες.",
    miniChallengeTitle: "Mini Challenge: Κάνε μια Μικρή Παρουσίαση",
    miniChallengeInstructions: [
      "Επίλεξε μια ιδέα και παρουσίασέ την σε μια μικρή ομάδα.",
      "Ζήτα ανατροφοδότηση και σκέψου πώς θα βελτιωθείς.",
    ],
    closingTitle: "Κλείσιμο",
    closingText:
      "Μπράβο! Έκανες το πρώτο βήμα για να γίνεις ένας καλός παρουσιαστής.",
    reflectionTitle: "Αναστοχασμός",
    reflectionQuestions: [
      "Πώς ένιωσες όταν παρουσίαζες;",
      "Τι θα ήθελες να δοκιμάσεις την επόμενη φορά;",
    ],
  },
  "6": {
    openingParagraphs: [
      "Ο χρηματοοικονομικός γραμματισμός είναι η γνώση για το πώς να διαχειρίζεσαι τα χρήματά σου.",
      "Είναι σημαντικό να ξέρεις πώς να προγραμματίζεις και να εξοικονομείς.",
    ],
    lesson1Title: "Τι Είναι τα Χρήματα;",
    storyParagraphs: [
      "Ένα παιδί έμαθε πώς να διαχειρίζεται τα χρήματά του για να αγοράσει κάτι που ήθελε.",
      "Έμαθε να κάνει προϋπολογισμό και να αποταμιεύει.",
    ],
    teacherStoryNote:
      "Η εκμάθηση της διαχείρισης χρημάτων από μικρή ηλικία βοηθά στη μελλοντική οικονομική ευημερία.",
    definitionKids:
      "Τα χρήματα είναι κάτι που χρησιμοποιούμε για να αγοράζουμε πράγματα.",
    definitionTeacher:
      "Ο χρηματοοικονομικός γραμματισμός είναι η ικανότητα να κατανοείς και να διαχειρίζεσαι τα οικονομικά σου με υπευθυνότητα.",
    lesson2Title: "Προϋπολογισμός και Αποταμίευση",
    lesson2Paragraphs: [
      "Φτιάξε έναν προϋπολογισμό για τα χρήματά σου.",
      "Μάθε να αποταμιεύεις για τα πράγματα που θέλεις.",
    ],
    activityTitle: "Δραστηριότητα: Φτιάξε τον Προϋπολογισμό σου",
    activitySteps: [
      "Κατέγραψε τα χρήματα που έχεις και τα έξοδά σου.",
      "Σχεδίασε πώς θα ξοδέψεις και τι θα αποταμιεύσεις.",
    ],
    activityTeacherNote:
      "Βοηθήστε τα παιδιά να κατανοήσουν τη σημασία της οικονομικής διαχείρισης.",
    lesson3Title: "Σκέψεις και Ερωτήσεις",
    lesson3Prompts: [
      "Πώς νιώθεις όταν διαχειρίζεσαι τα χρήματά σου;",
      "Τι θα ήθελες να μάθεις περισσότερο για τα χρήματα;",
    ],
    lesson3Closing:
      "Ο χρηματοοικονομικός γραμματισμός σε βοηθά να παίρνεις σωστές αποφάσεις.",
    miniChallengeTitle: "Mini Challenge: Προγραμματισμός Χρημάτων",
    miniChallengeInstructions: [
      "Κάνε έναν προϋπολογισμό για την επόμενη εβδομάδα.",
      "Κατέγραψε πώς τα πήγες και τι έμαθες.",
    ],
    closingTitle: "Κλείσιμο",
    closingText:
      "Συγχαρητήρια! Έμαθες τα βασικά για τη διαχείριση των χρημάτων σου.",
    reflectionTitle: "Αναστοχασμός",
    reflectionQuestions: [
      "Πώς θα χρησιμοποιήσεις αυτά που έμαθες στην καθημερινότητά σου;",
      "Ποιο είναι το πιο σημαντικό μάθημα για σένα;",
    ],
  },
};

const ChapterDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const chapterId = id ?? "1";
  const chapterTitle = chapterTitles[chapterId] ?? `Chapter ${chapterId}`;
  const content = chapterContent[chapterId] ?? chapterContent["1"];

  const sectionAnchors = [
    { id: "opening", label: translations.chapterDetail.sectionOpening[language] },
    { id: "lesson-1-1", label: translations.chapterDetail.sectionLesson11[language] },
    { id: "what-is-entrepreneurship", label: translations.chapterDetail.sectionWhatIsEntrepreneurship[language] },
    { id: "lesson-1-2", label: translations.chapterDetail.sectionLesson12[language] },
    { id: "lesson-1-3", label: translations.chapterDetail.sectionLesson13[language] },
    { id: "mini-challenge", label: translations.chapterDetail.sectionMiniChallenge[language] },
    { id: "closing-ritual", label: translations.chapterDetail.sectionClosing[language] },
    { id: "reflection", label: translations.chapterDetail.sectionReflection[language] },
  ];

  const [activeSectionId, setActiveSectionId] = useState<string>(sectionAnchors[0]?.id ?? "opening");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const sections = sectionAnchors
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.4,
        rootMargin: "0px 0px -40% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: translations.chapters.breadcrumbLabel[language], path: "/chapters" },
            { label: `${translations.chapterDetail.breadcrumbChapterLabel[language]} ${chapterId}` },
          ]}
        />

        {/* Page Header */}
        <header className="mb-6 flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground flex-shrink-0">
            {chapterId}
          </div>
          <div>
            <Badge variant="secondary" className="mb-2">
              {translations.chapterDetail.breadcrumbChapterLabel[language]} {chapterId}
            </Badge>
            <h1 className="text-4xl font-bold mb-2">
              {translations.chapterDetail.breadcrumbChapterLabel[language]} {chapterId} – {chapterTitle}
            </h1>
          </div>
        </header>

        {/* Small visual chapter index */}
        <nav
          aria-label="Chapter section index"
          className="mb-8 rounded-xl border border-border bg-card/60 backdrop-blur-sm px-4 py-3 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 overflow-x-auto">
            {sectionAnchors.map((section, index) => {
              const isActive = activeSectionId === section.id;

              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex flex-1 min-w-[3rem] flex-col items-center gap-1 text-center hover-scale"
                >
                  <span className="relative flex h-3 w-3 items-center justify-center">
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        isActive ? "bg-primary" : "bg-muted"
                      }`}
                    />
                    {isActive && (
                      <span className="absolute -inset-1 rounded-full border border-primary/60" />
                    )}
                  </span>
                  <span
                    className={`hidden text-[11px] font-medium md:block transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}. {section.label}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <section id="opening" className="scroll-mt-20">
              {content.openingParagraphs.map((para, idx) => (
                <p key={idx} className="mb-4 leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </section>

            <section id="lesson-1-1" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">{content.lesson1Title}</h2>
              {content.storyParagraphs.map((para, idx) => (
                <p key={idx} className="mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
              <p className="italic text-sm text-muted-foreground">{content.teacherStoryNote}</p>
            </section>

            <section id="what-is-entrepreneurship" className="scroll-mt-20">
              <h3 className="text-xl font-semibold mb-2">
                {translations.chapterDetail.forKidsLabel[language]}
              </h3>
              <p className="mb-4">{content.definitionKids}</p>
              <h3 className="text-xl font-semibold mb-2">
                {translations.chapterDetail.forTeacherLabel[language]}
              </h3>
              <p className="mb-4">{content.definitionTeacher}</p>
            </section>

            <section id="lesson-1-2" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">{content.lesson2Title}</h2>
              {content.lesson2Paragraphs.map((para, idx) => (
                <p key={idx} className="mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
            </section>

            <section id="lesson-1-3" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">{content.activityTitle}</h2>
              <ol className="list-decimal list-inside mb-4 space-y-2">
                {content.activitySteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <p className="italic text-sm text-muted-foreground">{content.activityTeacherNote}</p>
            </section>

            <section id="mini-challenge" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">{content.miniChallengeTitle}</h2>
              <ol className="list-decimal list-inside mb-4 space-y-2">
                {content.miniChallengeInstructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ol>
            </section>

            <section id="closing-ritual" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">{content.closingTitle}</h2>
              <p>{content.closingText}</p>
            </section>

            <section id="reflection" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">{content.reflectionTitle}</h2>
              <ul className="list-disc list-inside space-y-2">
                {content.reflectionQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <GlobalTip tip="Κάθε Chapter ακολουθεί την ίδια ροή: ιστορία, έννοιες, δραστηριότητα, mini challenge και αναστοχασμός. Το περιεχόμενο προσαρμόζεται στο θέμα του κάθε κεφαλαίου." />

            <Card>
              <CardHeader>
                <CardTitle>{translations.chapterDetail.worksheetsTitle[language]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href={budgetingWorksheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-accent hover:text-accent-foreground"
                >
                  {translations.chapterDetail.budgetingWorksheetCaption[language]}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={pricingWorksheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-accent hover:text-accent-foreground"
                >
                  {translations.chapterDetail.pricingWorksheetCaption[language]}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{translations.navigation.teachers[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <Link to="/teachers" className="text-primary hover:underline">
                      {translations.navigation.teachers[language]}
                    </Link>
                  </li>
                  <li>
                    <Link to="/chapters" className="text-primary hover:underline">
                      {translations.navigation.chapters[language]}
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        className={`fixed bottom-8 right-8 rounded-full shadow-lg transition-all duration-300 z-50 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChapterDetail;
