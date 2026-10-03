import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

// Getting the backup file out of the app and back in. On a phone it goes
// through the share sheet (Save to Files, iCloud Drive, AirDrop to his own
// Mac); on the web it downloads. Nothing is uploaded anywhere by Rise.

/** Hands the file to him. Resolves once the share sheet closes. */
export async function saveBackupFile(name: string, contents: string): Promise<void> {
  if (Platform.OS === 'web') {
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return;
  }
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(contents);
  try {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      UTI: 'public.json',
      dialogTitle: 'Save your Rise backup',
    });
  } finally {
    // The copy he saved is the backup; this one was only for handing over.
    if (file.exists) file.delete();
  }
}

/** Lets him pick a backup file. Null if he backs out. */
export async function pickBackupFile(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'public.json', '*/*'],
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  if (Platform.OS === 'web') {
    return asset.file ? asset.file.text() : (await fetch(asset.uri)).text();
  }
  return new File(asset.uri).text();
}
