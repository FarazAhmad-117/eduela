import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


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
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!ownCourse) {
            return new NextResponse("Forbidden", { status: 403 });
        }
        await db.course.delete({
            where: {
                id: params.courseId
            }
        });
        return new NextResponse("Course deleted successfully", { status: 200 });
    } catch (error) {
        console.log("[DELETE_COURSES]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}