import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "../ui/button";

interface ImageZoomProps {
  src: string;
}

export const ImageZoom = ({ src }: ImageZoomProps) => {
  return (
    <div className="relative w-full max-w-4xl bg-secondary">
      <TransformWrapper
        limitToBounds={true}
        disablePadding={false}
        initialScale={1}
        initialPositionX={200}
        initialPositionY={100}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            {/* <ImageZoomControls /> */}
            <div className="absolute top-0 z-10 ml-2 mt-2 flex items-center justify-start gap-2">
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={() => zoomIn()}
              >
                <ZoomIn />
              </Button>
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={() => zoomOut()}
              >
                <ZoomOut />
              </Button>
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={() => resetTransform()}
              >
                <RotateCcw />
              </Button>
            </div>
            <TransformComponent>
              <img src={src} alt="cropped image to zoom" />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
};
