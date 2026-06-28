import { Credential } from '@/types/credential';

/**
 * Google Password Manager CSV format:
 * name,url,username,password,note
 */
export function parseGoogleCSV(csvText: string): Credential[] {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Remove header line
  const dataLines = lines.slice(1);
  const result: Credential[] = [];

  for (const line of dataLines) {
    // Simple CSV parser that handles quoted values (e.g., "Company, Inc", "password")
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    // Google CSV mapping:
    // 0: name (website)
    // 1: url
    // 2: username
    // 3: password
    // 4: note
    const [name, url, username, password, note] = values.map((v) => v?.trim().replace(/^"|"$/g, '') || '');

    if (name || username || password) {
      const now = new Date().toISOString();
      result.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        website: name,
        url: url,
        username: username,
        password: password,
        category: 'Login',
        accountLabel: '',
        notes: note,
        tags: [],
        isFavorite: false,
        isArchived: false,
        passwordHistory: [],
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return result;
}
