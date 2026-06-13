import { CreditCard, FileText, KeyRound, LucideIcon, Server, User, Wifi } from 'lucide-react-native';

/**
 * Canonical credential categories (Roadmap 3.2). A single source of truth for
 * the id stored on credentials plus its display labels and icon, reused by the
 * Dashboard category cards, Vault filters, and the Add/Edit/Generator forms so
 * the set never drifts between screens.
 */
export interface CredentialCategory {
  /** Stable id persisted on `Credential.category`. */
  id: string;
  /** Singular label for forms/chips. */
  label: string;
  /** Plural label for summary cards. */
  pluralLabel: string;
  icon: LucideIcon;
}

export const CREDENTIAL_CATEGORIES: CredentialCategory[] = [
  { id: 'Login', label: 'Login', pluralLabel: 'Logins', icon: KeyRound },
  { id: 'Card', label: 'Card', pluralLabel: 'Cards', icon: CreditCard },
  { id: 'Note', label: 'Note', pluralLabel: 'Notes', icon: FileText },
  { id: 'Identity', label: 'Identity', pluralLabel: 'Identity', icon: User },
  { id: 'Wi-Fi', label: 'Wi-Fi', pluralLabel: 'Wi-Fi', icon: Wifi },
  { id: 'API Keys', label: 'API Keys', pluralLabel: 'API Keys', icon: Server },
];

export const DEFAULT_CATEGORY = 'Login';

/** Category ids prefixed with the "All" pseudo-filter for chip rows. */
export const CATEGORY_FILTERS = ['All', ...CREDENTIAL_CATEGORIES.map((category) => category.id)];

export function getCategory(id: string): CredentialCategory | undefined {
  return CREDENTIAL_CATEGORIES.find((category) => category.id === id);
}

export function categoryIcon(id: string): LucideIcon {
  return getCategory(id)?.icon ?? KeyRound;
}
