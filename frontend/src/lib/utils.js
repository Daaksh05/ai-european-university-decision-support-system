/**
 * Utility function to merge Tailwind CSS classes conditionally
 * Used in shadcn-style component structure
 * 
 * @param {...(string|object|undefined|null|boolean)} classes - CSS classes to merge
 * @returns {string} Merged class string with conflict resolution
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}
