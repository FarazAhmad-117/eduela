import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSignIcon,
  File,
  LayoutDashboard,
  ListCheck,
} from "lucide-react";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChapterForms from "./_components/chapters-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFileds = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFileds = requiredFileds.length;
  const completedFields = requiredFileds.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFileds})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-500">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16 max-w-[1200px] mx-auto">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2>Customize your course</h2>
          </div>
        </div>
        <TitleForm initalData={course} courseId={course.id} />
        <DescriptionForm initalData={course} courseId={course.id} />
        <ImageForm initalData={course} courseId={course.id} />
        <CategoryForm
          initalData={course}
          courseId={course.id}
          options={categories.map((prev) => ({
            label: prev.name,
            value: prev.id,
          }))}
        />
      </div>
      <div className="space-y-6 py-4">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListCheck} />
            <h2 className="text-xl">Course Chapters</h2>
          </div>
          <ChapterForms initalData={course} courseId={course.id} />
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSignIcon} />
            <h2 className="text-xl">Sell your course</h2>
          </div>
          <div>
            <PriceForm initalData={course} courseId={course.id} />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={File} />
            <h2 className="text-xl">Resources & Attachments</h2>
          </div>
          <AttachmentForm initalData={course} courseId={course.id} />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
