import { Image } from 'expo-image';
import { LucideIcon } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useVaultColors } from '@/contexts/color-theme-context';
import { faviconUrl, getLogoStatus, resolveDomain, setLogoStatus } from '@/services/site-branding';
import type { VaultColorsShape } from '@/theme/color-themes';

interface CredentialAvatarProps {
  /** Fallback icon when no logo is available. */
  icon: LucideIcon;
  /** Website name or URL used to resolve a brand favicon. */
  website?: string;
  url?: string;
  /** User-uploaded logo that overrides the fetched favicon (TASK-007). */
  customLogoUri?: string;
  size?: number;
  iconSize?: number;
  accent?: string;
}

/**
 * Renders a credential's brand logo with graceful fallbacks:
 * 1. user-uploaded custom logo, 2. cached/fetched site favicon, 3. category
 * icon. Favicons are disk-cached by `expo-image` (offline-friendly) and the
 * per-domain load result is persisted so known-bad domains skip the network
 * and show the icon immediately (TASK-006).
 */
export function CredentialAvatar({
  icon: Icon,
  website,
  url,
  customLogoUri,
  size = 48,
  iconSize = 20,
  accent,
}: CredentialAvatarProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const resolvedAccent = accent ?? c.accent;
  const domain = resolveDomain(url) ?? resolveDomain(website);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setFailed(false);
    if (domain) {
      void getLogoStatus(domain).then((status) => {
        if (active && status === 'fail') setFailed(true);
      });
    }
    return () => {
      active = false;
    };
  }, [domain]);

  const showCustom = Boolean(customLogoUri);
  const showFavicon = !showCustom && Boolean(domain) && !failed;

  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size / 2, borderColor: resolvedAccent + '55' }]}>
      {showCustom ? (
        <Image
          source={{ uri: customLogoUri }}
          style={[styles.image, { borderRadius: size / 2 }]}
          contentFit="cover"
          transition={150}
        />
      ) : showFavicon && domain ? (
        <Image
          source={{ uri: faviconUrl(domain, 64) }}
          style={[styles.image, { borderRadius: size / 2 }]}
          contentFit="contain"
          cachePolicy="disk"
          transition={150}
          onLoad={() => void setLogoStatus(domain, 'ok')}
          onError={() => {
            setFailed(true);
            void setLogoStatus(domain, 'fail');
          }}
        />
      ) : (
        <Icon size={iconSize} color={resolvedAccent} strokeWidth={1.75} />
      )}
    </View>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    tile: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.glassBackgroundStrong,
      borderWidth: 1,
      overflow: 'hidden',
    },
    image: {
      width: '78%',
      height: '78%',
    },
  });
}
