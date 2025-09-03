import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Converts a file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Converts multiple files to base64 strings
 */
export async function filesToBase64(files: File[]): Promise<Array<{ data: string; fileName: string; contentType: string }>> {
  const results = await Promise.all(
    files.map(async (file) => ({
      data: await fileToBase64(file),
      fileName: file.name,
      contentType: file.type
    }))
  );
  return results;
}
