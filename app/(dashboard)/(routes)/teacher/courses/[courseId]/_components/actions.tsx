"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type ActionsProps = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};

export default function Actions({
  disabled,
  courseId,
  isPublished,
}: ActionsProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);

        toast.success("Course unpublished successfully");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);

        toast.success("Course published successfully");
        confetti.onOpen();
      }
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch {
      toast.error("Error in publishing/unpublishing course");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Course deleted successfully");
      router.push(`/teacher/courses `);
      router.refresh();
    } catch {
      toast.error("Error deleting course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" variant="outline" disabled={isLoading}>
          <Trash color="red" className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
