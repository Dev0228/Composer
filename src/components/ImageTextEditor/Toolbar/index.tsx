"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ButtonToolbar } from "@/components/ImageTextEditor/Toolbar/buttonToolbar";

import { Canvas, FabricObject, IText, FabricImage } from "fabric";
import { ActionToolbar } from "@/components/ImageTextEditor/Toolbar/actionToolbar";
import { TextProperties } from "@/components/ImageTextEditor/Toolbar/textProperties";
import { UpLoadImage } from "@/components/ImageTextEditor/Toolbar/upLoadImage";
import { LayerList } from "@/components/ImageTextEditor/Toolbar/layerList";

interface SideLayoutProps {
  historyIndex: number;
  selectedLayers: FabricObject[] | undefined;
  history: string[];
  canvas: Canvas | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addTextLayer: () => void;
  undo: () => void;
  redo: () => void;
  exportImage: () => void;
  resetEditor: () => void;
  updateTextProperty: (property: string, value: unknown) => void;
  moveLayerUp: (index: number) => void;
  moveLayerDown: (index: number) => void;
  bringLayerToBottom: (index: number) => void;
  sendLayerToTop: (index: number) => void;
  onLayerSelect: (layer: IText | FabricImage) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerDuplicate: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
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
  bringLayerToBottom,
  sendLayerToTop,
  historyIndex,
  selectedLayers,
  history,
  canvas,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerDuplicate,
  onLayerDelete,
}) => {
  return (
    <Card className="w-120 m-4 mr-2 bg-editor-panel border-editor-panel-border shadow-panel h-auto min-w-120">
      <div className="p-4 space-y-6 h-auto overflow-y-auto">
        <UpLoadImage handleImageUpload={handleImageUpload} />

        <Separator />

        <ButtonToolbar addTextLayer={addTextLayer} />

        <Separator />

        <LayerList
          canvas={canvas}
          selectedLayers={selectedLayers || []}
          onLayerSelect={onLayerSelect}
          onLayerToggleVisibility={onLayerToggleVisibility}
          onLayerToggleLock={onLayerToggleLock}
          onLayerDuplicate={onLayerDuplicate}
          onLayerDelete={onLayerDelete}
          moveLayerDown={moveLayerDown}
          moveLayerUp={moveLayerUp}
          sendLayerToTop={sendLayerToTop}
          bringLayerToBottom={bringLayerToBottom}
        />

        {selectedLayers && selectedLayers[0]?.type === "i-text" && (
          <TextProperties
            selectedLayer={selectedLayers[0] as IText}
            updateTextProperty={updateTextProperty}
          />
        )}

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
