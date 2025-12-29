import { z } from "zod";

export const VALID_CHAPTER_IDS = ["1", "2", "3", "4", "5", "6"] as const;

export const MINI_DURATIONS: string[] = ["5 λεπτά", "10 λεπτά", "15 λεπτά", "30 λεπτά"];
export const CLASS_DURATIONS: string[] = ["15 λεπτά", "30 λεπτά", "45 λεπτά"];
export const ALL_DURATIONS: string[] = Array.from(new Set([...MINI_DURATIONS, ...CLASS_DURATIONS]));

export const normalizeNullable = (value?: string | null) => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export const activityEditSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Ο τίτλος της δράσης δεν μπορεί να είναι κενός.")
      .max(200, "Ο τίτλος δεν μπορεί να ξεπερνά τους 200 χαρακτήρες."),
    description: z
      .string()
      .trim()
      .max(1000, "Η περιγραφή δεν μπορεί να ξεπερνά τους 1000 χαρακτήρες.")
      .optional()
      .nullable(),
    duration: z
      .string()
      .trim()
      .max(50, "Η διάρκεια δεν μπορεί να ξεπερνά τους 50 χαρακτήρες.")
      .optional()
      .nullable(),
    chapter: z
      .string()
      .trim()
      .max(200, "Η ετικέτα κεφαλαίου δεν μπορεί να ξεπερνά τους 200 χαρακτήρες.")
      .optional()
      .nullable(),
    chapterId: z
      .string()
      .trim()
      .optional()
      .nullable(),
    difficulty: z
      .string()
      .trim()
      .max(100, "Η δυσκολία δεν μπορεί να ξεπερνά τους 100 χαρακτήρες.")
      .optional()
      .nullable(),
    participants: z
      .string()
      .trim()
      .max(100, "Οι συμμετέχοντες δεν μπορούν να ξεπερνούν τους 100 χαρακτήρες.")
      .optional()
      .nullable(),
    complexity: z
      .string()
      .trim()
      .max(100, "Η πολυπλοκότητα δεν μπορεί να ξεπερνά τους 100 χαρακτήρες.")
      .optional()
      .nullable(),
    category: z.enum(["mini", "class", "project"]).optional(),
  })
  .superRefine((data, ctx) => {
    // Chapter ID πρέπει να είναι από τις διαθέσιμες επιλογές
    if (data.chapterId && !VALID_CHAPTER_IDS.includes(data.chapterId as (typeof VALID_CHAPTER_IDS)[number])) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chapterId"],
        message: "Το chapter ID πρέπει να είναι μία από τις διαθέσιμες επιλογές.",
      });
    }

    // Business κανόνας: chapter και chapterId πρέπει να συμβαδίζουν
    const hasChapterId = !!data.chapterId && data.chapterId.trim() !== "";
    const hasChapterLabel = !!data.chapter && data.chapter.trim() !== "";

    if (hasChapterId && !hasChapterLabel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chapter"],
        message: "Όταν υπάρχει chapter ID, πρέπει να υπάρχει και ετικέτα κεφαλαίου.",
      });
    }

    if (hasChapterLabel && !hasChapterId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chapterId"],
        message: "Όταν υπάρχει ετικέτα κεφαλαίου, πρέπει να οριστεί και chapter ID.",
      });
    }

    // Business κανόνας: για mini & class η διάρκεια είναι υποχρεωτική
    const requiresDuration = data.category === "mini" || data.category === "class";
    if (requiresDuration && (!data.duration || data.duration.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["duration"],
        message: "Η διάρκεια είναι υποχρεωτική για αυτό τον τύπο δράσης.",
      });
      return; // δεν συνεχίζουμε με περαιτέρω ελέγχους διάρκειας
    }

    // Semantic έλεγχος διάρκειας ανά κατηγορία (επιλογές από presets)
    if (data.duration) {
      const allowedDurations: string[] =
        data.category === "mini" ? MINI_DURATIONS : data.category === "class" ? CLASS_DURATIONS : ALL_DURATIONS;
      if (!allowedDurations.includes(data.duration)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["duration"],
          message: "Η διάρκεια πρέπει να είναι μία από τις διαθέσιμες επιλογές για αυτό τον τύπο δράσης.",
        });
      }
    }
  });
