import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { courseId, attachmentId } = params;
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                id: attachmentId,
                courseId
            }
        })

        return NextResponse.json({ attachment }, { status: 200 });

    } catch (error) {
        console.log("ATTACHMENT_ID", error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}