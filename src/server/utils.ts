import { env } from "@/env";

export function storageUrlPrefix() {
  if (env.S3_ENDPOINT && env.S3_BUCKET_NAME)
    return `http${env.NODE_ENV === "production" ? "s" : ""}://${env.S3_ENDPOINT}${env.S3_PORT ? ":" + (env.S3_PORT + 1) : ""}/api/v1/buckets/${env.S3_BUCKET_NAME}/objects/download?preview=true&prefix=public%2F`;
  else return "/";
}
