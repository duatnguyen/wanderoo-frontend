/**
 * Get full image URL from relative path or return full URL as is
 * @param imageUrl - Image URL from backend (can be relative path like /static/... or full URL)
 * @returns Full URL for image display
 */
export const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined;
  
  // If already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative path starting with /, add base URL
  // Backend returns paths like /static/products/xxx.jpg
  if (imageUrl.startsWith('/')) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${baseUrl}${imageUrl}`;
  }
  
  // If relative path not starting with /, assume it's from uploads
  // This handles cases where backend might return just "products/xxx.jpg"
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${baseUrl}/static/${imageUrl}`;
};

