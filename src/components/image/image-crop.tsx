"use client";
import { useRef, useState } from "react";
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "../ui/button";
import { ImageZoom } from "./image-zoom";
import { useDebounceEffect } from "@/hooks/use-debounce-effect";
import { canvasPreview } from "./canvasPreview";

interface ImageCropProps {
  src?: string;
}

export function ImageCrop({ src }: ImageCropProps) {
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedBlobUrl, setCroppedBlobUrl] = useState<string>("");

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(e.target.files[0] as File);
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          /*scale,
          rotate,*/
        );
      }
    },
    500,
    [completedCrop /*, scale, rotate*/],
  );

  async function onCreateCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      setCroppedBlob(null);
      setCroppedBlobUrl("");
      throw new Error("image-crop error: Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("image-crop error: No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    // or png:  type: 'image/png'
    const blob = await offscreen.convertToBlob({
      type: "image/jpeg",
      quality: 0.9,
    });
    console.log(
      `image-crop: cropped BLOB is ready, size=${Math.round(blob.size / 1024)}KB`,
    );
    setCroppedBlob(blob);
    var urlCreator = window.URL || window.webkitURL;
    setCroppedBlobUrl(urlCreator.createObjectURL(blob));
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full items-center justify-between">
        <input
          hidden={!!imgSrc}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />
        {!!imgSrc && <div></div>}
        <div className="flex gap-2">
          <Button
            variant={"secondary"}
            disabled={!imgSrc}
            onClick={() => {
              if (!!imgSrc) setImgSrc("");
              if (croppedBlob) setCroppedBlob(null);
              if (!!croppedBlobUrl) setCroppedBlobUrl("");
            }}
          >
            Отменить
          </Button>
          <Button
            disabled={!completedCrop || !imgSrc || !!croppedBlobUrl}
            onClick={onCreateCropClick}
          >
            Обрезать скан
          </Button>
        </div>
      </div>
      {!!imgSrc && (
        <div hidden={!!croppedBlobUrl}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            disabled={false}
            locked={false}
            onComplete={(c) => setCompletedCrop(c)}
            //   minWidth={160}
            //   minHeight={90}
          >
            <img ref={imgRef} alt="Crop me" src={imgSrc} />
          </ReactCrop>
        </div>
      )}
      {!!completedCrop && (
        <div hidden={true}>
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid black",
              objectFit: "contain",
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        </div>
      )}
      {!!croppedBlobUrl && <ImageZoom src={croppedBlobUrl} />}
    </div>
  );
}
