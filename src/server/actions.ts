"use server";
import * as Minio from "minio";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { GenericResponse } from "@/types";

const minioClient =
  env.S3_ENDPOINT &&
  env.S3_ACCESS_KEY &&
  env.S3_SECRET_KEY &&
  env.S3_BUCKET_NAME
    ? new Minio.Client({
        endPoint: env.S3_ENDPOINT,
        port: env.S3_PORT || 9000,
        useSSL: false,
        accessKey: env.S3_ACCESS_KEY,
        secretKey: env.S3_SECRET_KEY,
      })
    : null;

export async function uploadScan(
  formData: FormData,
): Promise<GenericResponse<string>> {
  // Step 1: Check if user is authenticated (With NextAuth)
  const session = await auth();
  if (!session?.user) return { success: false, message: "Вы не авторизованы" };

  if (!minioClient)
    return {
      success: false,
      message: "Сервер не поддерживает загрузку сканов",
    };

  // Step 2: Get image from request (With Next.js server action)
  const scanBlob = formData.get("scan") as Blob | null;
  if (!scanBlob) {
    return { success: false, message: "Приложите скан к POST-запросу" };
  }

  //   const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

  // Step 3: Resize image (With Sharp)
  //   const editedImageBuffer = await sharp(imageBuffer)
  //     .resize({ height: 256, width: 256, fit: "cover" })
  //     .toBuffer();

  // Check if the bucket exists
  // If it doesn't, create it
  //   const exists = await minioClient.bucketExists(bucket);
  //   if (exists) {
  //     console.log("Bucket " + bucket + " exists.");
  //   } else {
  //     await minioClient.makeBucket(bucket, "us-east-1");
  //     console.log("Bucket " + bucket + ' created in "us-east-1".');
  //   }

  // Step 4: Upload image (With AWS SDK)
  //   const imageUrl = await uploadToS3({
  //     buffer: editedImageBuffer,
  //     key: `profile-images/${session.user.id}`,
  //     contentType: imageFile.type,
  //   });

  const arrayBuffer = await scanBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const metaData = {
    "Content-Type": "image/jpeg ",
    "X-Amz-Meta-External-Id": "pending",
  };
  const pathPrefix = "public/";
  const scanRandomName = `${crypto.randomUUID()}.jpg`;
  try {
    // Upload the Buffer with putObject
    const response = await minioClient.putObject(
      env.S3_BUCKET_NAME as string,
      //scanTitle || "scan_without_name",
      pathPrefix + scanRandomName,
      buffer,
      scanBlob.size,
      metaData,
    );
    console.log(
      "File " +
        buffer.length +
        " bytes uploaded as object " +
        response.etag +
        " in bucket " +
        env.S3_BUCKET_NAME,
    );
  } catch (err: any) {
    console.warn(
      `uploadScan: error scan uploading to minio server, userId: ${session.user.id}, error: ${err.message}`,
    );
    return {
      success: false,
      message: err.message,
    };
  }

  // list of bucket object
  // const stream = minioClient.listObjectsV2("mybucket", "", true, "");
  // stream.on("data", function (obj) {
  //   console.log(obj);
  // });
  // stream.on("error", function (err) {
  //   console.log(err);
  // });

  // Step 5: Update user in database (With Drizzle ORM)
  //   await db
  //     .update(users)
  //     .set({
  //       image: imageUrl,
  //     })
  //     .where(eq(users.id, session.user.id));

  // Step 6: Return new image URL
  return { success: true, payload: scanRandomName /*response.etag */ };
}
