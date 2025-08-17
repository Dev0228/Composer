"use client";

import toast from "react-hot-toast";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, IText, FabricImage } from "fabric";
import { Toolbar } from "@/components/ImageTextEditor/Toolbar/index";
import { CanvasArea } from "./canvasArea";

import { useRefState } from "@/hooks/useRefState";

export const ImageTextEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndexRef, setHistoryIndex] = useRefState(-1);

  const reRender = () => {
    setHistory((prevData) => [...prevData]);
  };

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Load from localStorage on initialization
    const savedState = localStorage.getItem("imageTextEditor");

    const canvas = new FabricCanvas(canvasRef.current, {
      width: savedState ? JSON.parse(savedState)?.backgroundImage.width : 800,
      height: savedState ? JSON.parse(savedState)?.backgroundImage.height : 600,
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

    canvas.on("selection:updated", () => {
      reRender();
    });
    canvas.on("selection:created", () => {
      reRender();
    });
    canvas.on("selection:cleared", () => {
      reRender();
    });
    canvas.on("text:changed", () => {
      reRender();
    });

    canvas.on("object:modified", (e) => {
      const activeObject = e.target as IText;
      if (activeObject && activeObject.type === "i-text") {
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

        canvas.renderAll();
      }
      saveToHistory();
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  // Bring Layer to Front
  const bringLayerToFront = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();

    if (!activeObject) return;

    fabricCanvasRef.current.bringObjectToFront(activeObject);
  }, []);

  // Send Layer to Back
  const sendLayerToBack = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();

    if (!activeObject) return;

    fabricCanvasRef.current.sendObjectBackwards(activeObject);
  }, []);

  // Move Layer Up
  const moveLayerUp = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();

    if (!activeObject) return;

    fabricCanvasRef.current.bringObjectForward(activeObject);
  }, []);

  // Move Layer Down
  const moveLayerDown = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();

    if (!activeObject) return;

    fabricCanvasRef.current.sendObjectToBack(activeObject);
  }, []);

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
          FabricImage.fromURL(e.target?.result as string).then((img) => {
            if (!fabricCanvasRef.current) return;
            fabricCanvasRef.current.backgroundImage = img;
            fabricCanvasRef.current.renderAll();
          });

          setBackgroundImage(e.target?.result as string);
          saveToHistory();
          toast.success("Image uploaded successfully!");
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    []
  );

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

      setHistoryIndex(newHistory.length - 1);

      // Save to localStorage
      localStorage.setItem("imageTextEditor", state);

      return newHistory;
    });
  }, [history]);

  const addTextLayer = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const textObject = new IText("Double click to edit", {
      left: fabricCanvasRef.current.width! / 2,
      top: fabricCanvasRef.current.height! / 2,
      fontSize: 24,
      fill: "#000000",
      textAlign: "center",
      originX: "center",
      originY: "center",
    });

    (textObject as any).customId = `text-${Date.now()}`;
    fabricCanvasRef.current.add(textObject);
    fabricCanvasRef.current.setActiveObject(textObject);
    saveToHistory();
    toast.success("Text layer added!");
  }, [saveToHistory]);

  const updateTextProperty = useCallback((property: string, value: any) => {
    const activeObject = fabricCanvasRef.current?.getActiveObject() as IText;
    if (!activeObject || activeObject.type !== "i-text") return;

    activeObject.set(property, value);
    activeObject.dirty = true;

    fabricCanvasRef.current?.requestRenderAll();

    saveToHistory();
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) {
      fabricCanvasRef.current?.clear();
      return;
    }

    const prevState = history[historyIndexRef.current - 1];
    fabricCanvasRef.current?.loadFromJSON(prevState).then(() => {
      fabricCanvasRef.current?.renderAll();
      setHistoryIndex((historyIndex) => historyIndex - 1);
      reRender();
    });
  }, [history]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= history.length - 1) return;

    const nextState = history[historyIndexRef.current + 1];
    fabricCanvasRef.current?.loadFromJSON(nextState).then(() => {
      fabricCanvasRef.current?.renderAll();
      setHistoryIndex((historyIndex) => historyIndex + 1);
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
        bringLayerToFront={bringLayerToFront}
        sendLayerToBack={sendLayerToBack}
        historyIndex={historyIndexRef.current}
        selectedLayer={fabricCanvasRef.current?.getActiveObject()}
        history={history}
      />
      <CanvasArea ref={canvasRef} backgroundImage={backgroundImage} />
    </div>
  );
};
