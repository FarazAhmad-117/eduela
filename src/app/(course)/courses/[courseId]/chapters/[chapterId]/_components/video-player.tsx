"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  videoUrl: string;
}

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  videoUrl,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const confetti = useConfettiStore();
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }
        toast.success("Progress Update Success!");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }

      toast.success("Progress Updated!");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video ">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col gap-y-2 items-center justify-center bg-slate-800 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      <div className="absolute top-0 left-0 z-10 w-full bg-black/40 p-2 text-center text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {!isLocked && (
        <ReactPlayer
          title={title}
          url={videoUrl}
          onReady={() => setIsReady(true)}
          onEnded={onEnd}
          width="100%"
          height="100%"
          controls
          playing
        />
      )}
    </div>
  );
};

export default VideoPlayer;
