"use client";

import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Pencil, PlusCircle, Video } from "lucide-react";
import FileUpload from "@/components/file-upload";

type ChapterVideoFormProps = {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
  className?: string;
  style?: React.CSSProperties;
};

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export default function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((currentValue) => !currentValue);

  const onSubmit = async (values: { videoUrl: string }) => {
    try {
      formSchema.safeParse(values);
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Something went wrong while updating course");
      }
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-cneter justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
        ))}

      {isEditing ? (
        <div>
          <FileUpload
            endPoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      ) : null}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-4">
          Videos can take a few minutes to process. Refresh the page if video
          doesnot appear
        </div>
      )}
    </div>
  );
}
