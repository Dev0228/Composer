import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";

interface ButtonToolbarProps {
  addTextLayer: () => void;
}

export const ButtonToolbar = ({ addTextLayer }: ButtonToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Text Tools</h2>
      <Button onClick={addTextLayer} size="sm">
        <Type className="w-4 h-4 mr-2" />
        Add Text
      </Button>
    </div>
  );
};
