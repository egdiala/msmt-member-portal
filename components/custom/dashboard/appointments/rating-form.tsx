"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema with Zod
const formSchema = z.object({
  sessionRatings: z.object({
    great: z.boolean().default(false),
    neutral: z.boolean().default(false),
    notGreat: z.boolean().default(false),
    heListens: z.boolean().default(false),
    feelBetter: z.boolean().default(false),
  }),
  starRating: z.number().min(1, "Please rate with at least 1 star").max(5),
  feedback: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName?: string;
  onSubmit?: (data: FormValues) => void;
}

export function RatingDialog({
  open,
  onOpenChange,
  personName = "Jide",
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState<number>(3);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionRatings: {
        great: false,
        neutral: false,
        notGreat: false,
        heListens: false,
        feelBetter: false,
      },

      starRating: 3,
      feedback: "",
    },
  });

  // Handle form submission
  function handleSubmit(data: FormValues) {
    onSubmit?.(data);
    console.log("Form submitted:", data);
    onOpenChange(false);
  }

  // Update star rating in form when stars are clicked
  const handleStarClick = (value: number) => {
    setRating(value);
    form.setValue("starRating", value, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Rate your session
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-6"
          >
            <div className="space-y-4">
              <h3 className="text-base font-medium">
                How was your session with {personName}?
              </h3>

              <div className="flex flex-wrap gap-2">
                <FormField
                  control={form.control}
                  name="sessionRatings.great"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="great"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="sr-only peer"
                        />
                      </FormControl>
                      <label
                        htmlFor="great"
                        className="cursor-pointer rounded-full border border-muted bg-background px-4 py-2 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        Great
                      </label>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sessionRatings.neutral"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="neutral"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="sr-only peer"
                        />
                      </FormControl>
                      <label
                        htmlFor="neutral"
                        className="cursor-pointer rounded-full border border-muted bg-background px-4 py-2 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        Neutral
                      </label>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sessionRatings.notGreat"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="notGreat"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          // className="sr-only peer"
                        />
                      </FormControl>
                      <label
                        htmlFor="notGreat"
                        className="cursor-pointer rounded-full border border-muted bg-background px-4 py-2 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        Not so great
                      </label>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <FormField
                control={form.control}
                name="sessionRatings.heListens"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        id="heListens"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        // className="sr-only peer"
                      />
                    </FormControl>
                    <label
                      htmlFor="heListens"
                      className="cursor-pointer rounded-full border border-muted bg-background px-4 py-2 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      He listens
                    </label>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionRatings.feelBetter"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        id="feelBetter"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        // className="sr-only peer"
                      />
                    </FormControl>
                    <label
                      htmlFor="feelBetter"
                      className="cursor-pointer rounded-full border border-muted bg-background px-4 py-2 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      I feel better now
                    </label>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="starRating"
              render={() => (
                <FormItem className="space-y-3">
                  <div>
                    <h3 className="text-base font-medium">Rate {personName}</h3>
                    <FormControl>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            className="p-1"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= rating
                                  ? "fill-blue-500 text-blue-500"
                                  : "fill-blue-100 text-blue-100"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="The session was ...."
                      className="min-h-[120px] bg-muted/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              Submit Review
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
