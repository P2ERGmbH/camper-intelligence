export function generateProviderSlug(name: string | null | undefined, id: number): string {
  const slugifiedName = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
  return `${slugifiedName}-${id}`;
}

export function getProviderIdFromSlug(slug: string): number {
  const slugParts = slug.split('-');
  const id = parseInt(slugParts[slugParts.length - 1]);
  return isNaN(id) ? -1 : id;
}
