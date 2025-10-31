import { router } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/atoms/Button';

export const AuthActionButtons = () => {
  const handleGetStarted = () => {
    router.push('./permissions');
  };

  const handleLogin = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <View className="w-full gap-4 px-6">
      <Button
        title="Get Started"
        variant="primary"
        size="large"
        onPress={handleGetStarted}
        className="w-full shadow-lg"
      />
      <Button
        title="Already have an account? Log In"
        variant="outline"
        size="large"
        onPress={handleLogin}
        className="w-full"
      />
    </View>
  );
};
