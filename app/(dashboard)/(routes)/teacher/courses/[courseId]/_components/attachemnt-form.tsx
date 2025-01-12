"use client";

import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import FileUpload from "@/components/file-upload";

type AttachmentFormProps = {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
  className?: string;
  style?: React.CSSProperties;
};

const formSchema = z.object({
  url: z.string().min(1),
});

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((currentValue) => !currentValue);

  const onSubmit = async (values: { url: string }) => {
    try {
      formSchema.safeParse(values);

      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course attachment added successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Something went wrong while adding course attachemnt");
      }
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch {
      toast.error("Something went wrong while deleting attachemnt");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-cneter justify-between">
        Course attachemnt
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}

          {!isEditing ? (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          ) : null}
        </Button>
      </div>

      {!isEditing ? (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachemnts yet !
            </p>
          )}

          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 bordder text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>

                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}

                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" color="red" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}

      {isEditing ? (
        <div>
          <FileUpload
            endPoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </div>
        </div>
      ) : null}
    </div>
  );
}
