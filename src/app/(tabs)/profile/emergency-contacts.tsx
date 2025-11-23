import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/utils/toast';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  priority: number;
  is_default: boolean;
}

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      showToast.error('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setRelationship('');
    setIsDefault(false);
    setShowAddForm(true);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship || '');
    setIsDefault(contact.is_default);
    setShowAddForm(true);
  };

  const handleSaveContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please enter name and phone number');
      return;
    }

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (editingContact) {
        // Update existing contact
        const { error } = await supabase
          .from('emergency_contacts')
          .update({
            name: name.trim(),
            phone: phone.trim(),
            relationship: relationship.trim() || null,
            is_default: isDefault,
          })
          .eq('id', editingContact.id);

        if (error) throw error;
        showToast.success('Success', 'Contact updated');
      } else {
        // Add new contact
        const { error } = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: user.id,
            name: name.trim(),
            phone: phone.trim(),
            relationship: relationship.trim() || null,
            priority: contacts.length,
            is_default: isDefault,
          });

        if (error) throw error;
        showToast.success('Success', 'Contact added');
      }

      setShowAddForm(false);
      loadContacts();
    } catch (error: any) {
      console.error('Error saving contact:', error);
      showToast.error('Error', error.message || 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = (contact: EmergencyContact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('emergency_contacts')
                .delete()
                .eq('id', contact.id);

              if (error) throw error;
              showToast.success('Deleted', 'Contact removed');
              loadContacts();
            } catch (error) {
              console.error('Error deleting contact:', error);
              showToast.error('Error', 'Failed to delete contact');
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Emergency Contacts',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Info Banner */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4 mt-2">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="flex-1 ml-2 text-blue-900 dark:text-blue-100 font-dm-sans text-sm">
                These contacts can be added as watchers when using Walk with Me feature
              </Text>
            </View>
          </View>

          {/* Add Contact Button */}
          {!showAddForm && (
            <TouchableOpacity
              onPress={handleAddContact}
              className="bg-blue-500 rounded-xl p-4 mb-4 active:opacity-80"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="add-circle" size={20} color="white" />
                <Text className="text-white font-dm-sans-semibold text-base ml-2">
                  Add Emergency Contact
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <Animated.View
              entering={FadeInDown.springify()}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-700"
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-lg">
                  {editingContact ? 'Edit Contact' : 'New Contact'}
                </Text>
                <TouchableOpacity onPress={() => setShowAddForm(false)}>
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Name Input */}
              <View className="mb-3">
                <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
                  Name *
                </Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-dm-sans border border-gray-200 dark:border-gray-700"
                  placeholder="Enter name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Phone Input */}
              <View className="mb-3">
                <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
                  Phone Number *
                </Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-dm-sans border border-gray-200 dark:border-gray-700"
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Relationship Input */}
              <View className="mb-3">
                <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
                  Relationship (Optional)
                </Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-dm-sans border border-gray-200 dark:border-gray-700"
                  placeholder="e.g., Mother, Friend, Spouse"
                  placeholderTextColor="#9CA3AF"
                  value={relationship}
                  onChangeText={setRelationship}
                />
              </View>

              {/* Primary Contact Toggle */}
              <TouchableOpacity
                onPress={() => setIsDefault(!isDefault)}
                className="flex-row items-center mb-4"
              >
                <View
                  className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                    isDefault
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-transparent border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isDefault && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text className="text-gray-700 dark:text-gray-300 font-dm-sans text-sm">
                  Set as primary contact
                </Text>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl py-3 active:opacity-80"
                >
                  <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveContact}
                  disabled={saving}
                  className="flex-1 bg-blue-500 rounded-xl py-3 active:opacity-80"
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white font-dm-sans-semibold text-center">
                      {editingContact ? 'Update' : 'Add Contact'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Contacts List */}
          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : contacts.length === 0 ? (
            <View className="bg-white dark:bg-gray-800 rounded-xl p-8 items-center">
              <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mb-4">
                <Ionicons name="people-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-lg mb-2">
                No Contacts Yet
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-center">
                Add emergency contacts to use with Walk with Me feature
              </Text>
            </View>
          ) : (
            <View className="space-y-2">
              {contacts.map((contact, index) => (
                <Animated.View
                  key={contact.id}
                  entering={FadeInDown.delay(index * 50).springify()}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <View className="flex-row items-center">
                    <LinearGradient
                      colors={['#EF4444', '#DC2626']}
                      className="w-12 h-12 rounded-full items-center justify-center"
                    >
                      <Ionicons name="person" size={24} color="white" />
                    </LinearGradient>
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center">
                        <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-base">
                          {contact.name}
                        </Text>
                        {contact.is_default && (
                          <View className="ml-2 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                            <Text className="text-blue-600 dark:text-blue-400 font-dm-sans-semibold text-xs">
                              Primary
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm">
                        {contact.phone}
                      </Text>
                      {contact.relationship && (
                        <Text className="text-gray-500 dark:text-gray-500 font-dm-sans text-xs">
                          {contact.relationship}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() => handleEditContact(contact)}
                        className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center"
                      >
                        <Ionicons name="create-outline" size={20} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteContact(contact)}
                        className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 items-center justify-center"
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
