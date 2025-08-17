"use client";

import React, { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Unlock,
  Copy,
  Type,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import {
  Canvas as FabricCanvas,
  IText,
  FabricImage,
  FabricObject,
} from "fabric";

interface Layer {
  id: string;
  name: string;
  type: "text" | "image";
  visible: boolean;
  locked: boolean;
  color?: string;
  text?: string;
  object: IText | FabricImage;
}

interface LayerListProps {
  canvas: FabricCanvas | null;
  selectedLayers: FabricObject[] | undefined;
  onLayerSelect: (layer: IText | FabricImage) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerDuplicate: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
  moveLayerDown: (index: number) => void;
  moveLayerUp: (index: number) => void;
  sendLayerToTop: (index: number) => void;
  bringLayerToBottom: (index: number) => void;
}

export const LayerList: React.FC<LayerListProps> = ({
  canvas,
  selectedLayers,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerDuplicate,
  onLayerDelete,
  moveLayerDown,
  moveLayerUp,
  sendLayerToTop,
  bringLayerToBottom,
}) => {
  const getLayers = useCallback((): Layer[] => {
    if (!canvas) return [];

    const objects = canvas.getObjects() as IText[];
    return objects.map((obj, index) => {
      const isText = obj.type === "i-text";

      if (!obj.customId) {
        obj.customId = `layer-${Date.now()}-${index}`;
      }

      return {
        id: obj.customId,
        name: isText ? obj.text || "Text Layer" : "Image Layer",
        type: isText ? "text" : "image",
        visible: obj.visible !== false,
        locked: obj.selectable === false,
        color: isText ? (obj.fill as string) : undefined,
        text: isText ? obj.text : undefined,
        object: obj,
      };
    });
  }, [canvas]);

  const layers = getLayers();

  const isLayerSelected = (layerId: string) => {
    return selectedLayers?.some((layer) => layer.customId === layerId) || false;
  };

  const handleLayerClick = (layer: Layer) => {
    if (layer.locked) return;

    canvas?.discardActiveObject();
    canvas?.setActiveObject(layer.object);
    onLayerSelect(layer.object);
  };

  const handleToggleVisibility = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onLayerToggleVisibility(layerId);
  };

  const handleToggleLock = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onLayerToggleLock(layerId);
  };

  const handleDuplicate = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onLayerDuplicate(layerId);
  };

  const handleDelete = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onLayerDelete(layerId);
  };

  if (!canvas) {
    return (
      <Card className="p-4">
        <Label className="text-sm font-medium">Layers</Label>
        <div className="text-xs text-muted-foreground mt-2">
          No canvas available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">Layers ({layers.length})</Label>
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4">
            No layers available
          </div>
        ) : (
          layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`
                group relative flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all
                ${
                  isLayerSelected(layer.id)
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }
                ${layer.locked ? "opacity-60" : ""}
              `}
              onClick={() => handleLayerClick(layer)}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                {layers.length - index}
              </div>

              <div className="flex-shrink-0">
                {layer.type === "text" ? (
                  <Type className="w-4 h-4 text-blue-600" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-green-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{layer.name}</div>
                {layer.type === "text" && layer.text && (
                  <div className="text-xs text-gray-500 truncate">
                    {layer.text}
                  </div>
                )}
              </div>

              {layer.type === "text" && layer.color && (
                <div
                  className="flex-shrink-0 w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: layer.color }}
                />
              )}

              <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => moveLayerDown(index)}
                  title="Move Up"
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => moveLayerUp(index)}
                  title="Move Down"
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => sendLayerToTop(index)}
                  title="Send to Top"
                >
                  <ArrowUpCircle className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => bringLayerToBottom(index)}
                  title="Send to Bottom"
                >
                  <ArrowDownCircle className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => handleToggleVisibility(e, layer.id)}
                  title={layer.visible ? "Hide Layer" : "Show Layer"}
                >
                  {layer.visible ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => handleToggleLock(e, layer.id)}
                  title={layer.locked ? "Unlock Layer" : "Lock Layer"}
                >
                  {layer.locked ? (
                    <Lock className="w-3 h-3 text-red-500" />
                  ) : (
                    <Unlock className="w-3 h-3 text-green-500" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => handleDuplicate(e, layer.id)}
                  title="Duplicate Layer"
                >
                  <Copy className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  onClick={(e) => handleDelete(e, layer.id)}
                  title="Delete Layer"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
