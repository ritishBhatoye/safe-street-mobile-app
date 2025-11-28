import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/atoms/Card';
import { EmergencyContactModal } from '@/components/profile/EmergencyContactModal';
import { EmergencyContactFormValues } from '@/utils/emergencyContactValidation';
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

export const EmergencyContactsCard: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setModalVisible(true);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setModalVisible(true);
  };

  const handleSaveContact = async (values: EmergencyContactFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (editingContact) {
        // Update existing contact
        const { error } = await supabase
          .from('emergency_contacts')
          .update({
            name: values.name.trim(),
            phone: values.phone.trim(),
            relationship: values.relationship.trim() || null,
            is_default: values.is_default,
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
            name: values.name.trim(),
            phone: values.phone.trim(),
            relationship: values.relationship.trim() || null,
            priority: contacts.length,
            is_default: values.is_default,
          });

        if (error) throw error;
        showToast.success('Success', 'Contact added');
      }

      loadContacts();
    } catch (error: any) {
      console.error('Error saving contact:', error);
      showToast.error('Error', error.message || 'Failed to save contact');
      throw error;
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
      <Card variant="elevated" className="mb-3">
        <View className="py-2">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-3">
                <Ionicons name="call" size={20} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-base">
                  Emergency Contacts
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs">
                  {contacts.length} contact{contacts.length !== 1 ? 's' : ''} added
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleAddContact}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full active:opacity-80"
            >
              <View className="flex-row items-center">
                <Ionicons name="add" size={16} color="#3B82F6" />
                <Text className="text-blue-600 dark:text-blue-400 font-dm-sans-semibold text-sm ml-1">
                  Add
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contacts List */}
          {loading ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : contacts.length === 0 ? (
            <View className="ml-13 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm text-center">
                No emergency contacts added yet
              </Text>
              <Text className="text-gray-500 dark:text-gray-500 font-dm-sans text-xs text-center mt-1">
                Add contacts for Walk with Me feature
              </Text>
            </View>
          ) : (
            <View className="ml-13 space-y-2">
              {contacts.map((contact, index) => (
                <Animated.View
                  key={contact.id}
                  entering={FadeInDown.delay(index * 50).springify()}
                  className="flex-row items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  >
                    <Ionicons name="person" size={20} color="white" />
                  </LinearGradient>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-sm">
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
                    <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
                      {contact.phone}
                      {contact.relationship && ` • ${contact.relationship}`}
                    </Text>
                  </View>
                  <View className="flex-row space-x-1">
                    <TouchableOpacity
                      onPress={() => handleEditContact(contact)}
                      className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center active:opacity-70"
                    >
                      <Ionicons name="create-outline" size={16} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteContact(contact)}
                      className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 items-center justify-center active:opacity-70"
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </Card>

      {/* Emergency Contact Modal */}
      <EmergencyContactModal
        visible={modalVisible}
        editingContact={editingContact}
        onClose={() => {
          setModalVisible(false);
          setEditingContact(null);
        }}
        onSave={handleSaveContact}
      />
    </>
  );
};
