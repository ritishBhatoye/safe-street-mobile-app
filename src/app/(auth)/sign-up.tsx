import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignUpScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Create Account</ThemedText>
        <ThemedView style={styles.form}>
          <ThemedText>Name input field</ThemedText>
          <ThemedText>Email input field</ThemedText>
          <ThemedText>Password input field</ThemedText>
          <ThemedText>Sign up button</ThemedText>
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
