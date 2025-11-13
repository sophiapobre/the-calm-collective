// Utility function to get the correct image URL
// Handles both Cloudinary URLs (new products) and local URLs (old products)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, it's a local image path
  return `http://localhost:4000/images/${imagePath}`;
};
