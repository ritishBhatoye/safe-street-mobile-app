import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CreateReportScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Create Report</ThemedText>
      </ThemedView>
      <ScrollView style={styles.content}>
        <ThemedView style={styles.form}>
          <ThemedText type="subtitle">Incident Type</ThemedText>
          <ThemedText>Select incident type dropdown</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText>Text input for description</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedText type="subtitle">Location</ThemedText>
          <ThemedText>Current location (auto-populated)</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedText type="subtitle">Photos</ThemedText>
          <ThemedText>Upload photos (max 5)</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedText>Submit button</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginBottom: 24,
  },
});
