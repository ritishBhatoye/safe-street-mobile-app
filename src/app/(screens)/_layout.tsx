import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ScreensLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="create-report"
        options={{
          title: 'Create Report',
          presentation: 'modal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="incident-detail"
        options={{
          title: 'Incident Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="emergency-contacts"
        options={{
          title: 'Emergency Contacts',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          title: 'Search',
          presentation: 'modal',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
