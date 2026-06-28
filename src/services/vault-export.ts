import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { createEncryptedBackup } from '@/services/vault-secure-backup';
import { Credential } from '@/types/credential';

/**
 * Exports the provided credentials to an encrypted .json file and opens the system share sheet.
 */
export async function exportVaultToFile(credentials: Credential[], password: string): Promise<void> {
  try {
    const backupData = await createEncryptedBackup(credentials, password);
    const fileName = `SecureVault_Encrypted_Backup_${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `${(FileSystem as any).documentDirectory}${fileName}`;

    // Write the encrypted backup string to a local file
    await FileSystem.writeAsStringAsync(filePath, backupData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Check if sharing is available on the platform
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error('Sharing is not available on this device');
    }

    // Open the system share sheet to allow the user to save the file
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Save Encrypted Vault Backup',
      UTI: 'public.json',
    });
  } catch (error) {
    console.error('[VaultExportError] Failed to export vault to file:', error);
    throw error;
  }
}
