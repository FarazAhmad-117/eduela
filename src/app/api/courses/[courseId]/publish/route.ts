import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
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

        if (!ownCourse.title || !ownCourse.description || !ownCourse.price || !ownCourse.categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: true,
            }
        })

        return NextResponse.json(publishedCourse);

    } catch (error) {
        console.error('[PUBLISH_COURSE_ERROR]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}




