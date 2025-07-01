import React, { useState } from "react";

interface ImagePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (urls: string[]) => void;
}

const ImagePickerDialog: React.FC<ImagePickerDialogProps> = ({
  isOpen,
  onClose,
  onImageSelect,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setIsLoading(true);
    try {
      // Validate the image URL
      const response = await fetch(imageUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error("Invalid image URL or image not accessible");
      }

      onImageSelect([imageUrl]);
      setImageUrl("");
      onClose();
    } catch (error) {
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Failed to load image"
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      urls.push(url);
    });

    onImageSelect(urls);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="image-dialog-overlay" onClick={onClose}>
      <div className="image-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Insert Image</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isLoading}
          />

          <div className="image-dialog-buttons">
            <button type="submit" disabled={!imageUrl.trim() || isLoading}>
              {isLoading ? "Loading..." : "Insert"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <p style={{ marginBottom: "10px", color: "#666" }}>
            Or upload from your device:
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
          <p>
            <strong>Supported formats:</strong> JPG, PNG, GIF, WebP
          </p>
          <p>
            <strong>Tip:</strong> You can also paste image URLs directly into
            the editor
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImagePickerDialog;
