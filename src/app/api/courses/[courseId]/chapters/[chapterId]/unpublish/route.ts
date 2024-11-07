import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(req: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const ownCourse = await db.course.findFirst({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(unpublishedChapter);

    } catch (error) {
        console.error('[UNPUBLISH_COURSE_ERROR]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}




