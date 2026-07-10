import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    secure: true,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
    public_id: string,
    created_at: string,
    bytes: number,
    secure_url: string,
}
export async function POST(req: Request) {

    const file = (await req.formData()).get("file");

    if (!file || !(file instanceof File) || file.size >= (5 * 1024 * 1024))
        return Response.json({ message: "Invalid file upload" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "Documents" },
            (err, result) => {
                if (err) reject(err)
                else resolve(result as CloudinaryUploadResult)
            }
        ).end(buffer)
    })

    const fileDetails = {
        fileName: file.name,
        fileURL: result.secure_url,
        mimeType: file.type,
        fileSize: result.bytes,
        publicId: result.public_id
    }

    return Response.json({ fileDetails }, { status: 201 })

}