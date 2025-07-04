import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Not Authorized", { status: 403 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastChapter?.position ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition
            }
        })

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("COURSE_ID_CHAPTERS", error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}



