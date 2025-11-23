import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/atoms/Card';
import { supabase } from '@/lib/supabase';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  priority: number;
  is_default: boolean;
}

interface EmergencyContactsCardProps {
  onManagePress: () => void;
}

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({ onManagePress }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

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
        .order('priority', { ascending: true })
        .limit(3);

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            onPress={onManagePress}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full"
          >
            <Text className="text-blue-600 dark:text-blue-400 font-dm-sans-semibold text-sm">
              Manage
            </Text>
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
                entering={FadeInDown.delay(index * 100).springify()}
                className="flex-row items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                >
                  <Ionicons name="person" size={16} color="white" />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-sm">
                    {contact.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
                    {contact.phone}
                    {contact.relationship && ` • ${contact.relationship}`}
                  </Text>
                </View>
                {contact.is_default && (
                  <View className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    <Text className="text-blue-600 dark:text-blue-400 font-dm-sans-semibold text-xs">
                      Primary
                    </Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
};
