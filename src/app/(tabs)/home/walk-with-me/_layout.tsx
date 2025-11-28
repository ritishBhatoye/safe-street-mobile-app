import { Stack } from 'expo-router';

export default function WalkWithMeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="active" />
      <Stack.Screen name="my-watches" />
      <Stack.Screen name="watch/[walkId]" />
    </Stack>
  );
}
