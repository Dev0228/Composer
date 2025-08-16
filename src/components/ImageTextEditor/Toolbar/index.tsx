"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Type } from "lucide-react";

import { FabricObject, IText } from "fabric";
import { ActionToolbar } from "@/components/ImageTextEditor/Toolbar/actionToolbar";
import { TextProperties } from "@/components/ImageTextEditor/Toolbar/textProperties";
import { LayerToolBar } from "@/components/ImageTextEditor/Toolbar/layerToolbar";
import { UpLoadImage } from "@/components/ImageTextEditor/Toolbar/upLoadImage";

interface SideLayoutProps {
  historyIndex: number;
  selectedLayer: FabricObject | undefined;
  history: any[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addTextLayer: () => void;
  undo: () => void;
  redo: () => void;
  exportImage: () => void;
  resetEditor: () => void;
  updateTextProperty: (property: string, value: any) => void;
  moveLayerUp: () => void;
  moveLayerDown: () => void;
  bringLayerToFront: () => void;
  sendLayerToBack: () => void;
}

export const Toolbar: React.FC<SideLayoutProps> = ({
  handleImageUpload,
  addTextLayer,
  undo,
  redo,
  exportImage,
  resetEditor,
  updateTextProperty,
  moveLayerUp,
  moveLayerDown,
  bringLayerToFront,
  sendLayerToBack,
  historyIndex,
  selectedLayer,
  history,
}) => {
  return (
    <Card className="w-80 m-4 mr-2 bg-editor-panel border-editor-panel-border shadow-panel h-auto">
      <div className="p-4 space-y-6 h-auto overflow-y-auto">
        <UpLoadImage handleImageUpload={handleImageUpload} />

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Text Tools</h2>
            <Button onClick={addTextLayer} size="sm">
              <Type className="w-4 h-4 mr-2" />
              Add Text
            </Button>
          </div>

          {selectedLayer && (
            <>
              <LayerToolBar
                moveLayerDown={moveLayerDown}
                moveLayerUp={moveLayerUp}
                sendLayerToBack={sendLayerToBack}
                bringLayerToFront={bringLayerToFront}
              />

              {selectedLayer.type === "i-text" && (
                <TextProperties
                  selectedLayer={selectedLayer as IText}
                  updateTextProperty={updateTextProperty}
                />
              )}
            </>
          )}
        </div>

        <Separator />

        <ActionToolbar
          undo={undo}
          redo={redo}
          resetEditor={resetEditor}
          history={history}
          historyIndex={historyIndex}
          exportImage={exportImage}
        />
      </div>
    </Card>
  );
};
