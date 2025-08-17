import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontPicker } from "@/components/ui/font-picker";
import { useDebouncedCallback } from "use-debounce";
import { useCallback } from "react";

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
import { Card } from "@/components/ui/card";

interface TextPropertiesProps {
  selectedLayer: IText;
  updateTextProperty: (property: string, value: unknown) => void;
}
export const TextProperties = ({
  selectedLayer,
  updateTextProperty,
}: TextPropertiesProps) => {
  const debouncedUpdateTextProperty = useDebouncedCallback(
    (property: string, value: unknown) => updateTextProperty(property, value),
    300
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div>
          <Label className="mb-2">Text Content</Label>
          <Input
            value={selectedLayer.text}
            onChange={(e) =>
              debouncedUpdateTextProperty("text", e.target.value)
            }
            placeholder="Enter text..."
          />
        </div>

        <div>
          <Label className="mb-2">Font Family</Label>
          <FontPicker
            value={selectedLayer.fontFamily}
            onChange={(value) =>
              debouncedUpdateTextProperty("fontFamily", value)
            }
            showFilters={true}
          />
        </div>

        <div>
          <Label className="mb-2">Font Size: {selectedLayer.fontSize}px</Label>
          <Slider
            value={[selectedLayer.fontSize]}
            onValueChange={([value]) =>
              debouncedUpdateTextProperty("fontSize", value)
            }
            min={8}
            max={200}
            step={1}
          />
        </div>

        <div>
          <Label className="mb-2">Font Weight</Label>
          <Select
            value={String(selectedLayer.fontWeight)}
            onValueChange={(value) =>
              debouncedUpdateTextProperty("fontWeight", value)
            }
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
          <Label>Line Height: {selectedLayer.lineHeight || 1.16}</Label>
          <Slider
            value={[selectedLayer.lineHeight || 1.16]}
            onValueChange={([value]) =>
              debouncedUpdateTextProperty("lineHeight", value)
            }
            min={0.5}
            max={3}
            step={0.01}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Letter Spacing: {selectedLayer.charSpacing || 0}px</Label>
          <Slider
            value={[selectedLayer.charSpacing || 0]}
            onValueChange={([value]) =>
              debouncedUpdateTextProperty("charSpacing", value)
            }
            min={-10}
            max={50}
            step={0.5}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Color</Label>
          <Input
            type="color"
            value={String(selectedLayer.fill)}
            onChange={(e) =>
              debouncedUpdateTextProperty("fill", e.target.value)
            }
            className="h-10 mt-2"
          />
        </div>

        <div>
          <Label>Opacity: {Math.round(selectedLayer.opacity * 100)}%</Label>
          <Slider
            value={[selectedLayer.opacity]}
            onValueChange={([value]) =>
              debouncedUpdateTextProperty("opacity", value)
            }
            min={0}
            max={1}
            step={0.01}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="mb-2">Text Align</Label>
          <Select
            value={selectedLayer.textAlign}
            onValueChange={(value) =>
              debouncedUpdateTextProperty("textAlign", value)
            }
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
      </Card>
      <Card className="p-4">
        {/* Text Shadow Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Text Shadow</Label>

          {/* Shadow Color */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Shadow Color
            </Label>
            <Input
              type="color"
              value={selectedLayer.shadow?.color || "#000000"}
              onChange={(e) => {
                const currentShadow = selectedLayer.shadow || {};
                debouncedUpdateTextProperty("shadow", {
                  ...currentShadow,
                  color: e.target.value,
                });
              }}
              className="h-8 mt-1"
            />
          </div>

          {/* Shadow Blur */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Blur: {selectedLayer.shadow?.blur || 0}px
            </Label>
            <Slider
              value={[selectedLayer.shadow?.blur || 0]}
              onValueChange={([value]) => {
                const currentShadow = selectedLayer.shadow || {};
                debouncedUpdateTextProperty("shadow", {
                  ...currentShadow,
                  blur: value,
                });
              }}
              min={0}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>

          {/* Shadow Offset X */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Offset X: {selectedLayer.shadow?.offsetX || 0}px
            </Label>
            <Slider
              value={[selectedLayer.shadow?.offsetX || 0]}
              onValueChange={([value]) => {
                const currentShadow = selectedLayer.shadow || {};
                debouncedUpdateTextProperty("shadow", {
                  ...currentShadow,
                  offsetX: value,
                });
              }}
              min={-50}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>

          {/* Shadow Offset Y */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Offset Y: {selectedLayer.shadow?.offsetY || 0}px
            </Label>
            <Slider
              value={[selectedLayer.shadow?.offsetY || 0]}
              onValueChange={([value]) => {
                const currentShadow = selectedLayer.shadow || {};
                debouncedUpdateTextProperty("shadow", {
                  ...currentShadow,
                  offsetY: value,
                });
              }}
              min={-50}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
