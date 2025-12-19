import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { activityEditSchema, MINI_DURATIONS, CLASS_DURATIONS, ALL_DURATIONS, VALID_CHAPTER_IDS } from "@/lib/activityValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export type ActivityCategory = "mini" | "class" | "project";

export type ActivityEditFormValues = z.infer<typeof activityEditSchema>;

interface ActivityEditFormProps {
  category: ActivityCategory;
  initialValues: {
    title: string;
    description: string | null;
    duration: string | null;
    chapter: string | null;
    chapterId: string | null;
    difficulty: string | null;
    participants: string | null;
    complexity: string | null;
  };
  onSubmit: (values: ActivityEditFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export function ActivityEditForm({ category, initialValues, onSubmit, onCancel }: ActivityEditFormProps) {
  const form = useForm<ActivityEditFormValues>({
    resolver: zodResolver(activityEditSchema),
    defaultValues: {
      title: initialValues.title ?? "",
      description: initialValues.description ?? null,
      duration: initialValues.duration ?? null,
      chapter: initialValues.chapter ?? null,
      chapterId: initialValues.chapterId ?? null,
      difficulty: initialValues.difficulty ?? null,
      participants: initialValues.participants ?? null,
      complexity: initialValues.complexity ?? null,
      category,
    },
  });

  const handleSubmit = (values: ActivityEditFormValues) => {
    onSubmit(values);
  };

  const durationOptions =
    category === "mini" ? MINI_DURATIONS : category === "class" ? CLASS_DURATIONS : ALL_DURATIONS;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 text-sm">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τίτλος</FormLabel>
              <FormControl>
                <Input {...field} className="h-8 text-xs" placeholder="Τίτλος" />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Περιγραφή</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="Περιγραφή"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Διάρκεια</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Διάρκεια" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-50 bg-popover">
                    {durationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {(category === "mini" || category === "project") && (
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Δυσκολία</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-8 text-xs flex-1"
                      placeholder="Δυσκολία"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}

          {category === "class" && (
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Συμμετέχοντες</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-8 text-xs flex-1"
                      placeholder="Συμμετέχοντες (π.χ. 4-6 μαθητές)"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="chapterId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Chapter ID</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("chapter", value ? `Chapter ${value}` : null);
                  }}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Chapter ID" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-50 bg-popover">
                    {VALID_CHAPTER_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        Chapter {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chapter"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ετικέτα chapter</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="h-8 text-xs flex-1"
                    placeholder="Ετικέτα chapter"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {category === "project" && (
          <FormField
            control={form.control}
            name="complexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Πολυπλοκότητα</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="h-8 text-xs flex-1"
                    placeholder="Πολυπλοκότητα"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
          >
            Άκυρο
          </Button>
          <Button type="submit" size="sm">
            Αποθήκευση
          </Button>
        </div>
      </form>
    </Form>
  );
}
