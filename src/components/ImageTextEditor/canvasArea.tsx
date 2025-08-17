import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { forwardRef } from "react";

interface CanvasAreaProps {
  backgroundImage: string | null;
}
export const CanvasArea = forwardRef<HTMLCanvasElement, CanvasAreaProps>(
  ({ backgroundImage }, canvasRef) => {
    return (
      <div className="flex-1 m-4 ml-2">
        <Card
          className="h-full bg-editor-canvas border-editor-panel-border shadow-panel"
          style={{ overflowX: "auto" }}
        >
          <div className="h-full flex items-center justify-center p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border border-editor-panel-border shadow-md"
              />
              {!backgroundImage && backgroundImage !== "restored" && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-center space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Upload a PNG image to start editing
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

CanvasArea.displayName = "CanvasArea";
