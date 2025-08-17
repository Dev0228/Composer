import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RotateCcw } from "lucide-react";
interface ActionToolbarProps {
  undo: () => void;
  redo: () => void;
  exportImage: () => void;
  resetEditor: () => void;
  historyIndex: number;
  history: string[];
}
export const ActionToolbar = ({
  undo,
  redo,
  exportImage,
  resetEditor,
  historyIndex,
  history,
}: ActionToolbarProps) => {
  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Actions</h2>
      <div className="flex gap-2">
        <Button
          onClick={undo}
          disabled={historyIndex < 0}
          variant="outline"
          size="sm"
        >
          Undo
        </Button>
        <Button
          onClick={redo}
          disabled={historyIndex >= history?.length - 1}
          variant="outline"
          size="sm"
        >
          Redo
        </Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={exportImage} variant="default" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Export PNG
        </Button>
        <Button onClick={resetEditor} variant="outline" size="icon">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
