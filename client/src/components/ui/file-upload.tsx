import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  placeholder?: string;
  description?: string;
  className?: string;
  "data-testid"?: string;
}

export function FileUpload({
  onFileSelect,
  accept = "*",
  maxSize = 10 * 1024 * 1024,
  placeholder = "Загрузите файл",
  description = "",
  className,
  "data-testid": testId,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEvents = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize) {
      alert(`Файл слишком большой. Максимальный размер: ${maxSize / 1024 / 1024}MB`);
      return;
    }
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "upload-zone rounded-lg p-8 text-center cursor-pointer transition-all",
        isDragOver && "dragover",
        className
      )}
      onClick={() => inputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEvents}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={testId}
    >
      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-foreground font-medium mb-2">{placeholder}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleInputChange}
      />
    </div>
  );
}
