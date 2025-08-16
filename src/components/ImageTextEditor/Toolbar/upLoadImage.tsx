import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadImageProps {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const UpLoadImage = ({ handleImageUpload }: UploadImageProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Upload</h2>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept=".png"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <Button asChild variant="outline" className="w-full">
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload PNG Image
          </label>
        </Button>
      </div>
    </div>
  );
};
