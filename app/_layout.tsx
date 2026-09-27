import {
  Fraunces_400Regular_Italic,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Onboarding } from '@/components/Onboarding';
import { StoreProvider, useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before fonts and store are ready.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <StoreProvider>
      <RootNavigator />
    </StoreProvider>
  );
}

/**
 * Holds the splash until the store has loaded from disk, then shows
 * onboarding on first launch — after that, the app itself.
 */
function RootNavigator() {
  const { ready, data } = useStore();
  const t = useAppTheme();
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: t.bg,
      primary: t.text,
    },
  };

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) {
    return null;
  }

  if (!data.profile) {
    return (
      <>
        <StatusBar style={t.isNight ? 'light' : 'dark'} />
        <Onboarding />
      </>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="sos"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="checkin"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="log-struggle"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="rise-again"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
