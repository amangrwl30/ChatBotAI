// Utility for lazy loading images
export const lazyLoadImage = (imageRef: HTMLImageElement) => {
  if ('loading' in HTMLImageElement.prototype) {
    imageRef.loading = 'lazy';
  }
};

// Utility for code splitting
export const dynamicImport = async (path: string) => {
  return await import(path);
}; 