"use client";

import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type ChaptersFormProps = {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
  className?: string;
  style?: React.CSSProperties;
};

const formSchema = z.object({
  title: z.string().min(1),
});

export default function ChaptersForm({
  initialData,
  courseId,
}: ChaptersFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => setIsCreating((currentValue) => !currentValue);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created successfully");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating course");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-cneter justify-between">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating ? (
        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-white-700"
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction of the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={!isValid || isSubmitting}>Create</Button>
          </form>
        </Form>
      ) : null}

      {!isCreating ? (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length
            ? "No chapters"
            : initialData.chapters.map((chapter) => <div>{chapter.title}</div>)}
        </div>
      ) : null}
      {!isCreating ? (
        <p className="text-sx text-muted-foreground mt-4">
          drag and drop to reorder the chapters
        </p>
      ) : null}
    </div>
  );
}
