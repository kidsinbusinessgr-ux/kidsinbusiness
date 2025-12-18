export type MiniChallenge = {
  id: string;
  title: string;
  description: string;
  duration: string;
  chapter: string;
  chapterId: string;
  difficulty: string;
};

export type ClassActivity = {
  id: string;
  title: string;
  description: string;
  duration: string;
  chapter: string;
  chapterId: string;
  participants: string;
};

export type ProjectActivity = {
  id: string;
  title: string;
  description: string;
  duration: string;
  chapter: string;
  chapterId: string;
  complexity: string;
};

export const miniChallenges: MiniChallenge[] = [
  {
    id: "mini-1",
    title: "Ιδέα σε 5 λεπτά",
    description: "Brainstorming δραστηριότητα για γρήγορη παραγωγή ιδεών",
    duration: "5 λεπτά",
    chapter: "Chapter 2",
    chapterId: "2",
    difficulty: "Εύκολο",
  },
  {
    id: "mini-2",
    title: "Λύσε το πρόβλημα",
    description: "Εντοπίστε προβλήματα και προτείνετε λύσεις",
    duration: "10 λεπτά",
    chapter: "Chapter 1",
    chapterId: "1",
    difficulty: "Μέτριο",
  },
  {
    id: "mini-3",
    title: "Pitch σε 30 δευτερόλεπτα",
    description: "Παρουσιάστε μια ιδέα με σαφήνεια και ταχύτητα",
    duration: "15 λεπτά",
    chapter: "Chapter 5",
    chapterId: "5",
    difficulty: "Προχωρημένο",
  },
];

export const classActivities: ClassActivity[] = [
  {
    id: "class-1",
    title: "Ο ρόλος του ηγέτη",
    description: "Ομαδική δραστηριότητα για κατανόηση ηγεσίας",
    duration: "30 λεπτά",
    chapter: "Chapter 4",
    chapterId: "4",
    participants: "4-6 μαθητές",
  },
  {
    id: "class-2",
    title: "Η επιχείρησή μου",
    description: "Δημιουργήστε μια επιχειρηματική ιδέα ως ομάδα",
    duration: "45 λεπτά",
    chapter: "Chapter 3",
    chapterId: "3",
    participants: "Όλη η τάξη",
  },
];

export const projects: ProjectActivity[] = [
  {
    id: "project-1",
    title: "Business Plan Junior",
    description: "Πλήρες επιχειρηματικό σχέδιο για παιδιά",
    duration: "3-5 μέρες",
    chapter: "Chapters 3-5",
    chapterId: "3",
    complexity: "Υψηλό",
  },
  {
    id: "project-2",
    title: "Παρουσίαση ομάδας",
    description: "Τελική παρουσίαση επιχειρηματικής ιδέας",
    duration: "2-3 μέρες",
    chapter: "Chapter 5",
    chapterId: "5",
    complexity: "Μέτριο",
  },
];
