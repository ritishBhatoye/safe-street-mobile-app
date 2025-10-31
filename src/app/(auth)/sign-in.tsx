import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignInScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Sign In</ThemedText>
        <ThemedView style={styles.form}>
          <ThemedText>Email input field</ThemedText>
          <ThemedText>Password input field</ThemedText>
          <ThemedText>Sign in button</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 32,
  },
  form: {
    marginTop: 24,
    gap: 16,
  },
});
