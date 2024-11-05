"use client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React from "react";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean | undefined;
}

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <Button
        size={"sm"}
        variant={"outline"}
        disabled={disabled}
        onClick={() => {}}
      >
        {isPublished ? "Unpublished" : "Published"}
      </Button>
      <Button size={"sm"}>
        <Trash className="h-4 w-4 " />
      </Button>
    </div>
  );
};

export default ChapterActions;
