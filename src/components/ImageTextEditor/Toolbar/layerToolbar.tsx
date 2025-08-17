import { Button } from "@/components/ui/button";

interface LayerToolBarProps {
  moveLayerUp: () => void;
  moveLayerDown: () => void;
  bringLayerToFront: () => void;
  sendLayerToBack: () => void;
}

export const LayerToolBar = ({
  moveLayerDown,
  moveLayerUp,
  bringLayerToFront,
  sendLayerToBack,
}: LayerToolBarProps) => {
  return (
    <div className="space-y-2 border p-4 rounded bg-editor-panel-bg">
      <Button onClick={moveLayerUp} variant="outline">
        Move Layer Up
      </Button>
      <Button onClick={moveLayerDown} variant="outline">
        Move Layer Down
      </Button>
      <Button onClick={bringLayerToFront} variant="outline">
        Bring Layer to Front
      </Button>
      <Button onClick={sendLayerToBack} variant="outline">
        Send Layer to Back
      </Button>
    </div>
  );
};
