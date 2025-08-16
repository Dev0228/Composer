import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontPicker } from "@/components/ui/font-picker";

import { FONT_WEIGHTS } from "@/constants/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { IText } from "fabric";

interface TextPropertiesProps {
  selectedLayer: IText;
  updateTextProperty: (property: string, value: any) => void;
}
export const TextProperties = ({
  selectedLayer,
  updateTextProperty,
}: TextPropertiesProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Text Content</Label>
        <Input
          value={selectedLayer.text}
          onChange={(e) => updateTextProperty("text", e.target.value)}
          placeholder="Enter text..."
        />
      </div>

      <div>
        <Label>Font Family</Label>
        <FontPicker
          value={selectedLayer.fontFamily}
          onChange={(value) => updateTextProperty("fontFamily", value)}
          showFilters={true}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Font Size: {selectedLayer.fontSize}px</Label>
        <Slider
          value={[selectedLayer.fontSize]}
          onValueChange={([value]) => updateTextProperty("fontSize", value)}
          min={8}
          max={200}
          step={1}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Font Weight</Label>
        <Select
          value={String(selectedLayer.fontWeight)}
          onValueChange={(value) => updateTextProperty("fontWeight", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_WEIGHTS.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                {weight.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Color</Label>
        <Input
          type="color"
          value={String(selectedLayer.fill)}
          onChange={(e) => updateTextProperty("fill", e.target.value)}
          className="h-10 mt-1"
        />
      </div>

      <div>
        <Label>Opacity: {Math.round(selectedLayer.opacity * 100)}%</Label>
        <Slider
          value={[selectedLayer.opacity]}
          onValueChange={([value]) => updateTextProperty("opacity", value)}
          min={0}
          max={1}
          step={0.01}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Text Align</Label>
        <Select
          value={selectedLayer.textAlign}
          onValueChange={(value) => updateTextProperty("textAlign", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
