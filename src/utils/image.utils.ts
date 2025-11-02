import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compress and resize image for avatar upload
 */
export async function compressImage(uri: string): Promise<string> {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 400, height: 400 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri;
  }
}

/**
 * Validate image file size (max 2MB)
 */
export function validateImageSize(uri: string): Promise<boolean> {
  return new Promise((resolve) => {
    fetch(uri)
      .then((response) => response.blob())
      .then((blob) => {
        const sizeInMB = blob.size / (1024 * 1024);
        resolve(sizeInMB <= 2);
      })
      .catch(() => resolve(false));
  });
}

/**
 * Get file extension from URI
 */
export function getFileExtension(uri: string): string {
  const parts = uri.split('.');
  return parts[parts.length - 1] || 'jpg';
}
