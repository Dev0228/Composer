"use client";

import toast from "react-hot-toast";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Canvas as FabricCanvas,
  IText,
  FabricImage,
  FabricObject,
} from "fabric";
import { Toolbar } from "@/components/ImageTextEditor/Toolbar/index";
import { CanvasArea } from "./canvasArea";

import { useRefState } from "@/hooks/useRefState";
import { loadSavedState } from "@/utils/loadSavedState";

export const ImageTextEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndexRef, setHistoryIndex] = useRefState(0);

  const reRender = useCallback(() => {
    setHistory((prevData) => [...prevData]);
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const savedState = loadSavedState();

    const canvas = new FabricCanvas(canvasRef.current, {
      width: savedState ? savedState?.backgroundImage?.width : 800,
      height: savedState ? savedState?.backgroundImage?.height : 600,
      backgroundColor: "#ffffff",
    });

    if (savedState) {
      canvas.loadFromJSON(savedState).then(() => {
        canvas.renderAll();
        setBackgroundImage("restored");
        saveToHistory();
        toast.success("Canvas restored from previous session!");
      });
    } else {
      toast.success("Canvas initialized! Upload an image to get started.");
    }

    // Enable object controls
    canvas.selection = true;
    canvas.preserveObjectStacking = true;

    canvas.on("selection:updated", reRender);
    canvas.on("selection:created", reRender);
    canvas.on("selection:cleared", reRender);
    canvas.on("text:changed", reRender);

    canvas.on("object:modified", () => {
      const activeObjects = canvas.getActiveObjects() as IText[];
      if (activeObjects) {
        activeObjects.map((activeObject) => {
          if (activeObject.scaleX && activeObject.scaleX !== 1) {
            const newFontSize = Math.round(
              (activeObject.fontSize || 20) * activeObject.scaleX
            );
            activeObject.set({
              fontSize: newFontSize,
              scaleX: 1,
              scaleY: 1,
            });
          }
        });

        canvas.renderAll();
      }
      saveToHistory();
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  const saveToHistory = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    setHistory((history) => {
      const state = JSON.stringify(fabricCanvasRef.current!.toJSON());
      const newHistory = history.slice(0, historyIndexRef.current + 1);
      newHistory.push(state);

      // Keep only last 20 states
      if (newHistory.length > 20) {
        newHistory.shift();
      }

      historyIndexRef.current = newHistory.length - 1;

      // Save to localStorage
      localStorage.setItem("imageTextEditor", state);

      return newHistory;
    });
  }, [history]);

  const bringLayerToBottom = useCallback(
    (index: number) => {
      if (!fabricCanvasRef.current) return;

      const obj = fabricCanvasRef.current.getObjects()[index];

      fabricCanvasRef.current!.bringObjectToFront(obj);

      saveToHistory();
    },
    [saveToHistory]
  );

  const sendLayerToTop = useCallback(
    (index: number) => {
      if (!fabricCanvasRef.current) return;

      const obj = fabricCanvasRef.current.getObjects()[index];

      fabricCanvasRef.current!.sendObjectToBack(obj);
      saveToHistory();
    },
    [saveToHistory]
  );

  const moveLayerUp = useCallback(
    (index: number) => {
      if (!fabricCanvasRef.current) return;

      const obj = fabricCanvasRef.current.getObjects()[index];

      fabricCanvasRef.current!.bringObjectForward(obj);
      saveToHistory();
    },
    [saveToHistory]
  );

  const moveLayerDown = useCallback(
    (index: number) => {
      if (!fabricCanvasRef.current) return;
      const obj = fabricCanvasRef.current.getObjects()[index];

      fabricCanvasRef.current!.sendObjectBackwards(obj);
      saveToHistory();
    },
    [saveToHistory]
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !fabricCanvasRef.current) return;

      if (!file.type.includes("png")) {
        toast.error("Please upload a PNG image.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Update canvas size to match image
          fabricCanvasRef.current?.setDimensions({
            width: img.width,
            height: img.height,
          });

          // Set background image
          FabricImage.fromURL(e.target?.result as string).then(
            (img: FabricImage) => {
              if (!fabricCanvasRef.current) return;
              img.customId = `background-${Date.now()}`;
              img.selectable = false;
              img.evented = false;
              img.lockScalingX = true;
              img.lockScalingY = true;
              img.lockRotation = true;
              img.lockUniScaling = true;
              fabricCanvasRef.current.backgroundImage = img;
              fabricCanvasRef.current.renderAll();
            }
          );

          setBackgroundImage(e.target?.result as string);
          saveToHistory();
          toast.success("Image uploaded successfully!");
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [saveToHistory]
  );

  const addTextLayer = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const textObject = new IText("Double click to edit", {
      left: fabricCanvasRef.current.width! / 2,
      top: fabricCanvasRef.current.height! / 2,
      fontSize: 24,
      fontWeight: 500,
      fill: "#000000",
      textAlign: "center",
      originX: "center",
      originY: "center",
      lineHeight: 1.16,
      charSpacing: 0,
    });

    textObject.customId = `text-${Date.now()}`;
    fabricCanvasRef.current.add(textObject);
    fabricCanvasRef.current.setActiveObject(textObject);
    fabricCanvasRef.current.requestRenderAll();
    saveToHistory();
    reRender();
    toast.success("Text layer added!");
  }, [saveToHistory, reRender]);

  const updateTextProperty = useCallback((property: string, value: unknown) => {
    const activeObjects =
      fabricCanvasRef.current?.getActiveObjects() as IText[];
    if (!activeObjects || activeObjects[0].type !== "i-text") return;

    activeObjects.map((activeObjects) => {
      activeObjects.set(property, value);
    });

    fabricCanvasRef.current?.requestRenderAll();

    saveToHistory();
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) {
      fabricCanvasRef.current?.clear();
    }

    const prevState = history[historyIndexRef.current - 1];
    fabricCanvasRef.current
      ?.loadFromJSON(prevState ? prevState : {})
      .then(() => {
        fabricCanvasRef.current?.renderAll();
        historyIndexRef.current = historyIndexRef.current - 1;
        reRender();
      });
  }, [history]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= history.length - 1) return;

    const nextState = history[historyIndexRef.current + 1];
    fabricCanvasRef.current?.loadFromJSON(nextState).then(() => {
      fabricCanvasRef.current?.renderAll();
      historyIndexRef.current = historyIndexRef.current + 1;
      reRender();
    });
  }, [history]);

  const exportImage = useCallback(() => {
    if (!fabricCanvasRef.current || !backgroundImage) {
      toast.error("Please upload an image first.");
      return;
    }

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.download = "image-with-text.png";
    link.href = dataURL;
    link.click();

    toast.success("Image exported successfully!");
  }, [backgroundImage]);

  const resetEditor = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.clear();
    fabricCanvasRef.current.backgroundColor = "#ffffff";
    fabricCanvasRef.current.renderAll();
    setBackgroundImage(null);
    setHistory([]);
    setHistoryIndex(-1);

    // Clear localStorage
    localStorage.removeItem("imageTextEditor");
    toast.success("Editor reset successfully!");
  }, []);

  // Layer management functions
  const handleLayerSelect = useCallback(
    (layer: FabricObject) => {
      if (!fabricCanvasRef.current) return;
      fabricCanvasRef.current.setActiveObject(layer);
      fabricCanvasRef.current.requestRenderAll();
      reRender();
    },
    [reRender]
  );

  const handleLayerToggleVisibility = useCallback(
    (layerId: string) => {
      if (!fabricCanvasRef.current) return;

      const objects = fabricCanvasRef.current.getObjects();
      const layer = objects.find((obj) => obj.customId === layerId);

      if (layer) {
        layer.visible = !layer.visible;
        fabricCanvasRef.current.requestRenderAll();
        saveToHistory();
        reRender();
      }
    },
    [saveToHistory, reRender]
  );

  const handleLayerToggleLock = useCallback(
    (layerId: string) => {
      if (!fabricCanvasRef.current) return;

      const objects = fabricCanvasRef.current.getObjects();
      const layer = objects.find((obj) => obj.customId === layerId);

      if (layer) {
        layer.selectable = !layer.selectable;
        layer.evented = !layer.evented;
        fabricCanvasRef.current.requestRenderAll();
        saveToHistory();
        reRender();
      }
    },
    [saveToHistory, reRender]
  );

  const handleLayerDuplicate = useCallback(
    async (layerId: string) => {
      if (!fabricCanvasRef.current) return;

      const objects = fabricCanvasRef.current.getObjects();
      const layer = objects.find((obj) => obj.customId === layerId);

      if (layer) {
        try {
          const clonedLayer = await layer.clone();
          clonedLayer.customId = `layer-${Date.now()}`;

          // Offset the duplicated layer slightly
          clonedLayer.left = (clonedLayer.left || 0) + 20;
          clonedLayer.top = (clonedLayer.top || 0) + 20;

          fabricCanvasRef.current.add(clonedLayer);
          fabricCanvasRef.current.setActiveObject(clonedLayer);
          fabricCanvasRef.current.requestRenderAll();
          saveToHistory();
          reRender();
          toast.success("Layer duplicated!");
        } catch (error) {
          console.error("Error duplicating layer:", error);
          toast.error("Failed to duplicate layer");
        }
      }
    },
    [saveToHistory, reRender]
  );

  const handleLayerDelete = useCallback(
    (layerId: string) => {
      if (!fabricCanvasRef.current) return;

      const objects = fabricCanvasRef.current.getObjects();
      const layer = objects.find((obj) => obj.customId === layerId);

      if (layer) {
        fabricCanvasRef.current.remove(layer);
        fabricCanvasRef.current.requestRenderAll();
        saveToHistory();
        reRender();
        toast.success("Layer deleted!");
      }
    },
    [saveToHistory, reRender]
  );

  return (
    <div className="h-screen bg-editor-bg flex">
      <Toolbar
        handleImageUpload={handleImageUpload}
        addTextLayer={addTextLayer}
        undo={undo}
        redo={redo}
        exportImage={exportImage}
        resetEditor={resetEditor}
        updateTextProperty={updateTextProperty}
        moveLayerUp={moveLayerUp}
        moveLayerDown={moveLayerDown}
        bringLayerToBottom={bringLayerToBottom}
        sendLayerToTop={sendLayerToTop}
        historyIndex={historyIndexRef.current}
        selectedLayers={fabricCanvasRef.current?.getActiveObjects()}
        history={history}
        canvas={fabricCanvasRef.current}
        onLayerSelect={handleLayerSelect}
        onLayerToggleVisibility={handleLayerToggleVisibility}
        onLayerToggleLock={handleLayerToggleLock}
        onLayerDuplicate={handleLayerDuplicate}
        onLayerDelete={handleLayerDelete}
      />
      <CanvasArea ref={canvasRef} backgroundImage={backgroundImage} />
    </div>
  );
};
