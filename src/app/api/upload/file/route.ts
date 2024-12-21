import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { unlinkSync } from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const POST = async (req: NextRequest) => {
    try {
        // Extract form data from the request
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No files received or invalid file." }, { status: 400 });
        }

        // Convert the file into a buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, "_");
        const filePath = path.join(process.cwd(), "public/files", filename);

        // Save file to the server
        await writeFile(filePath, buffer);

        // Upload the file to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
            // folder: "InternshipResumes",
            resource_type: 'raw'
        });


        if (!cloudinaryResponse) {
            return NextResponse.json(
                { success: false, message: "Unable to upload to Cloudinary!" },
                { status: 500 }
            );
        }

        // Remove the file from the server after uploading
        unlinkSync(filePath);

        // Return success response with Cloudinary data
        return NextResponse.json(
            { success: true, message: "File has been uploaded successfully!", cloudinaryResponse },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error occurred:", error);
        return NextResponse.json(
            { success: false, message: error?.message ?? "Internal Server Error" },
            { status: 500 }
        );
    }
};
