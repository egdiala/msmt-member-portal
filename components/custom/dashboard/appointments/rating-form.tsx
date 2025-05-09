"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { Loader } from "@/components/shared/loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui";
import { AnimatePresence, motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { useSubmitSessionRating } from "@/services/hooks/mutations/use-appointment";

// Define the form schema with Zod
const formSchema = z.object({
  provider_on_time: z.string().min(1, "Please select an option"),
  starRating: z.number().min(1, "Please rate with at least 1 star").max(5),
  feedback: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName?: string;
}

export function RatingDialog({
  open,
  onOpenChange,
  personName = "Jide",
}: RatingDialogProps) {
  const { slug } = useParams();
  const [rating, setRating] = useState<number>(0);
  const { mutate, isPending } = useSubmitSessionRating(() =>
    onOpenChange(false)
  );

  const buttonCopy = {
    idle: " Submit Review",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider_on_time: "",

      starRating: 3,
      feedback: "",
    },
  });

  function handleSubmit(data: FormValues) {
    mutate({
      provider_on_time: data.provider_on_time,
      comment: data.feedback!,
      rating: `${data?.starRating.toString()} - 5`,
      appointment_id: slug as string ,
    });
  }
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
              <div className="flex flex-wrap gap-2">
                <FormField
                  control={form.control}
                  name="provider_on_time"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <h3 className="text-base font-medium">
                        Was {personName} on time?
                      </h3>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <label
                              htmlFor="on-time-yes"
                              className="flex items-center space-x-2 cursor-pointer rounded-full border border-muted bg-background px-4 py-2 text-sm font-medium peer-data-[state=checked]:border-brand-accent-2 peer-data-[state=checked]:bg-primary/5"
                            >
                              <FormControl>
                                <RadioGroupItem value="yes" id="on-time-yes" />
                              </FormControl>
                              Yes
                            </label>
                          </FormItem>

                          <FormItem className="flex items-center space-x-2">
                            <label
                              htmlFor="on-time-no"
                              className="flex items-center space-x-2 cursor-pointer rounded-full border border-muted bg-background px-4 py-2 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                            >
                              <FormControl>
                                <RadioGroupItem value="no" id="on-time-no" />
                              </FormControl>
                              No
                            </label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                                  ? "fill-brand-accent-2 text-brand-accent-2"
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

            <motion.div layout className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-full"
                size={"lg"}
                disabled={isPending}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    initial={{ opacity: 0, y: -25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 25 }}
                    key={buttonState}
                  >
                    {buttonCopy[buttonState]}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </motion.div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
