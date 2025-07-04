import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";



const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
})



export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        const values = await req.json();
        const { courseId } = params;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: { ...values }
        });
        return NextResponse.json({ course }, { status: 200 });
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });
        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter?.muxData?.assetId) {
                await video.assets.delete(chapter.muxData?.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
                userId
            }
        });

        return new NextResponse("Course deleted successfully", { status: 200 });
    } catch (error) {
        console.log("[DELETE_COURSES]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}