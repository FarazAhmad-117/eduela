import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(
    req: NextRequest,
    { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!ownCourse) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        for (let item of list) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            })
        }

        return new NextResponse("Chapters reordered successfully", { status: 200 });

    } catch (error) {
        console.log("CHAPTERS_REORDER", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}