export interface IAvatarStorage {
  uploadAvatar(file: File, userId: string): Promise<string>;
  getAvatarUrl(path: string): string;
}

export class LocalAvatarStorage implements IAvatarStorage {
  async uploadAvatar(file: File, userId: string): Promise<string> {
    // Simulate network delay for uploading to a storage bucket
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real local server, we would send the file FormData to a backend route.
    // For this local simulation, we mock the path using the file's name.
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `assets/avatars/${userId}_${safeName}`;
  }

  getAvatarUrl(path: string): string {
    // In Vite, items positioned in the public/ folder are served from the root.
    if (!path) return '';
    return path.startsWith('/') ? path : `/${path}`;
  }
}

// Export singleton mapping to the local storage provider
// To migrate to Supabase, implement SupabaseAvatarStorage and assign it here
export const avatarService: IAvatarStorage = new LocalAvatarStorage();
