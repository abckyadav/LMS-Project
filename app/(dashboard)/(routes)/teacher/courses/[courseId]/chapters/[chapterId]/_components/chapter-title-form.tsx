"use client";

import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";

type ChapterTitleFormProps = {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
  className?: string;
  style?: React.CSSProperties;
};

const formSchema = z.object({
  title: z.string().min(2),
});

export default function ChapterTitleForm({
  initialData,
  courseId,
  chapterId,
}: ChapterTitleFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((currentValue) => !currentValue);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated successfully");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating chapter");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-cneter justify-between">
        Chapter title
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing ? <p className="text-sm mt-2">{initialData.title}</p> : null}

      {isEditing ? (
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
                      placeholder="e.g 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting}>Save</Button>
            </div>
          </form>
        </Form>
      ) : null}
    </div>
  );
}
