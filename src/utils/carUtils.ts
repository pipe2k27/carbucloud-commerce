/**
 * Formats model and version for display
 * @param model - The car model
 * @param version - The car version (optional)
 * @returns Formatted string with model and version concatenated
 */
export function formatModelVersion(model: string, version?: string | null): string {
  if (!version) {
    return model;
  }
  return `${model} ${version}`;
}
