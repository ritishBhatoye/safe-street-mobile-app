import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActionSheet } from '@/components/elements';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { supabase } from '@/lib/supabase';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

interface SelectWatchersSheetProps {
  onSelectWatcher: (watcher: { name: string; phone: string }) => void;
}

export type SelectWatchersSheetRef = ActionSheetRef;

export const SelectWatchersSheet = forwardRef<ActionSheetRef, SelectWatchersSheetProps>(
  ({ onSelectWatcher }, ref) => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(false);
    const [showManualAdd, setShowManualAdd] = useState(false);
    const [manualName, setManualName] = useState('');
    const [manualPhone, setManualPhone] = useState('');

    useEffect(() => {
      loadEmergencyContacts();
    }, []);

    const loadEmergencyContacts = async () => {
    setLoading(true);
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

    const handleSelectContact = (contact: EmergencyContact) => {
      onSelectWatcher({
        name: contact.name,
        phone: contact.phone,
      });
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.hide();
      }
    };

    const handleManualAdd = () => {
      if (!manualName.trim() || !manualPhone.trim()) return;
      
      onSelectWatcher({
        name: manualName.trim(),
        phone: manualPhone.trim(),
      });
      
      setManualName('');
      setManualPhone('');
      setShowManualAdd(false);
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.hide();
      }
    };

    return (
      <ActionSheet
        ref={ref}
        title="Add Watcher"
        subtitle="Select from emergency contacts or add manually"
        headerGradient={['rgba(59, 130, 246, 0.1)', 'rgba(147, 51, 234, 0.1)']}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
        {/* Emergency Contacts */}
        {!showManualAdd && (
          <>
            <Text className="text-sm font-dm-sans-semibold text-gray-700 dark:text-gray-300 mb-3">
              Emergency Contacts
            </Text>
            
            {loading ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500 font-dm-sans">Loading contacts...</Text>
              </View>
            ) : contacts.length === 0 ? (
              <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-4">
                <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-center">
                  No emergency contacts found
                </Text>
                <Text className="text-gray-500 dark:text-gray-500 font-dm-sans text-center text-sm mt-1">
                  Add them in your profile first
                </Text>
              </View>
            ) : (
              <View className="mb-4">
                {contacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    onPress={() => handleSelectContact(contact)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-2 flex-row items-center border border-gray-200 dark:border-gray-700"
                  >
                    <LinearGradient
                      colors={['#3B82F6', '#2563EB']}
                      className="w-12 h-12 rounded-full items-center justify-center"
                    >
                      <Ionicons name="person" size={24} color="white" />
                    </LinearGradient>
                    <View className="ml-3 flex-1">
                      <Text className="font-dm-sans-bold text-gray-900 dark:text-white">
                        {contact.name}
                      </Text>
                      <Text className="font-dm-sans text-sm text-gray-500 dark:text-gray-400">
                        {contact.phone}
                      </Text>
                      {contact.relationship && (
                        <Text className="font-dm-sans text-xs text-gray-400 dark:text-gray-500">
                          {contact.relationship}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Manual Add Button */}
            <TouchableOpacity
              onPress={() => setShowManualAdd(true)}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex-row items-center justify-center border border-blue-200 dark:border-blue-800"
            >
              <Ionicons name="add-circle" size={20} color="#3B82F6" />
              <Text className="text-blue-600 dark:text-blue-400 font-dm-sans-semibold ml-2">
                Add Someone Else
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Manual Add Form */}
        {showManualAdd && (
          <View>
            <TouchableOpacity
              onPress={() => setShowManualAdd(false)}
              className="flex-row items-center mb-4"
            >
              <Ionicons name="arrow-back" size={20} color="#3B82F6" />
              <Text className="text-blue-600 font-dm-sans-semibold ml-2">Back</Text>
            </TouchableOpacity>

            <View className="mb-4">
              <Text className="text-sm font-dm-sans-semibold text-gray-700 dark:text-gray-300 mb-2">
                Name
              </Text>
              <View className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <TextInput
                  className="font-dm-sans text-base text-gray-900 dark:text-white"
                  placeholder="Enter name"
                  placeholderTextColor="#9CA3AF"
                  value={manualName}
                  onChangeText={setManualName}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-dm-sans-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </Text>
              <View className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <TextInput
                  className="font-dm-sans text-base text-gray-900 dark:text-white"
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={manualPhone}
                  onChangeText={setManualPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleManualAdd}
              disabled={!manualName.trim() || !manualPhone.trim()}
              className="overflow-hidden rounded-xl"
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                className="py-4 items-center"
              >
                <Text className="text-white font-dm-sans-bold">Add Watcher</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ActionSheet>
  );
});

SelectWatchersSheet.displayName = 'SelectWatchersSheet';
