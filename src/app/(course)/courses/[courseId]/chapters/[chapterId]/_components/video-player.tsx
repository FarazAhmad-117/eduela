"use client";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(videoUrl);
  }, []);

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
          onEnded={() => console.log("Ended!")}
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
