import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Formik } from 'formik';
import {
  initialEmergencyContactValues,
  emergencyContactValidationSchema,
  EmergencyContactFormValues,
} from '@/utils/emergencyContactValidation';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  is_default: boolean;
}

interface EmergencyContactModalProps {
  visible: boolean;
  editingContact: EmergencyContact | null;
  onClose: () => void;
  onSave: (values: EmergencyContactFormValues) => Promise<void>;
}

export const EmergencyContactModal: React.FC<EmergencyContactModalProps> = ({
  visible,
  editingContact,
  onClose,
  onSave,
}) => {
  const getInitialValues = (): EmergencyContactFormValues => {
    if (editingContact) {
      return {
        name: editingContact.name,
        phone: editingContact.phone,
        relationship: editingContact.relationship || '',
        is_default: editingContact.is_default,
      };
    }
    return initialEmergencyContactValues;
  };

  const handleSubmit = async (
    values: EmergencyContactFormValues,
    { setSubmitting }: any
  ) => {
    try {
      await onSave(values);
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="dark" className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end"
        >
          <View className="bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90%]">
            {/* Handle Bar */}
            <View className="items-center py-4">
              <View className="w-12 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
            </View>

            <Formik
              initialValues={getInitialValues()}
              validationSchema={emergencyContactValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {(formikProps) => (
                <>
                  {/* Header */}
                  <View className="flex-row items-center justify-between px-6 pb-4">
                    <View>
                      <Text className="text-2xl font-dm-sans-bold text-black dark:text-white">
                        {editingContact ? 'Edit Contact' : 'Add Contact'}
                      </Text>
                      <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm mt-1">
                        {editingContact
                          ? 'Update emergency contact details'
                          : 'Add a new emergency contact'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={onClose}
                      className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
                    >
                      <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    className="px-6"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {/* Name Input */}
                    <View className="mb-4">
                      <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
                        Name *
                      </Text>
                      <View
                        className={`flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border ${
                          formikProps.touched.name && formikProps.errors.name
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color="#9CA3AF"
                        />
                        <TextInput
                          className="flex-1 ml-3 text-gray-900 dark:text-white font-dm-sans text-base"
                          placeholder="Enter name"
                          placeholderTextColor="#9CA3AF"
                          value={formikProps.values.name}
                          onChangeText={formikProps.handleChange('name')}
                          onBlur={formikProps.handleBlur('name')}
                          autoCapitalize="words"
                        />
                      </View>
                      {formikProps.touched.name && formikProps.errors.name && (
                        <Text className="text-red-500 text-sm font-dm-sans mt-1">
                          {formikProps.errors.name}
                        </Text>
                      )}
                    </View>

                    {/* Phone Input */}
                    <View className="mb-4">
                      <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
                        Phone Number *
                      </Text>
                      <View
                        className={`flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border ${
                          formikProps.touched.phone && formikProps.errors.phone
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                        <TextInput
                          className="flex-1 ml-3 text-gray-900 dark:text-white font-dm-sans text-base"
                          placeholder="Enter phone number"
                          placeholderTextColor="#9CA3AF"
                          value={formikProps.values.phone}
                          onChangeText={formikProps.handleChange('phone')}
                          onBlur={formikProps.handleBlur('phone')}
                          keyboardType="phone-pad"
                        />
                      </View>
                      {formikProps.touched.phone && formikProps.errors.phone && (
                        <Text className="text-red-500 text-sm font-dm-sans mt-1">
                          {formikProps.errors.phone}
                        </Text>
                      )}
                    </View>

                    {/* Relationship Input */}
                    <View className="mb-4">
                      <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
                        Relationship (Optional)
                      </Text>
                      <View
                        className={`flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border ${
                          formikProps.touched.relationship &&
                          formikProps.errors.relationship
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Ionicons name="heart-outline" size={20} color="#9CA3AF" />
                        <TextInput
                          className="flex-1 ml-3 text-gray-900 dark:text-white font-dm-sans text-base"
                          placeholder="e.g., Mother, Friend, Spouse"
                          placeholderTextColor="#9CA3AF"
                          value={formikProps.values.relationship}
                          onChangeText={formikProps.handleChange('relationship')}
                          onBlur={formikProps.handleBlur('relationship')}
                          autoCapitalize="words"
                        />
                      </View>
                      {formikProps.touched.relationship &&
                        formikProps.errors.relationship && (
                          <Text className="text-red-500 text-sm font-dm-sans mt-1">
                            {formikProps.errors.relationship}
                          </Text>
                        )}
                    </View>

                    {/* Primary Contact Toggle */}
                    <TouchableOpacity
                      onPress={() =>
                        formikProps.setFieldValue(
                          'is_default',
                          !formikProps.values.is_default
                        )
                      }
                      className="flex-row items-center mb-6"
                    >
                      <View
                        className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                          formikProps.values.is_default
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-transparent border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {formikProps.values.is_default && (
                          <Ionicons name="checkmark" size={16} color="white" />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-sm">
                          Set as primary contact
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
                          This contact will be prioritized in emergencies
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Info Banner */}
                    <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                      <View className="flex-row items-start">
                        <Ionicons
                          name="information-circle"
                          size={20}
                          color="#3B82F6"
                        />
                        <Text className="flex-1 ml-2 text-blue-900 dark:text-blue-100 font-dm-sans text-sm">
                          This contact can be added as a watcher when using Walk
                          with Me feature
                        </Text>
                      </View>
                    </View>
                  </ScrollView>

                  {/* Action Buttons */}
                  <View className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <View className="flex-row space-x-3">
                      <TouchableOpacity
                        onPress={onClose}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl py-4 active:opacity-80"
                      >
                        <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-center text-base">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => formikProps.handleSubmit()}
                        disabled={
                          formikProps.isSubmitting || !formikProps.isValid
                        }
                        className={`flex-1 rounded-xl py-4 active:opacity-80 ${
                          formikProps.isSubmitting || !formikProps.isValid
                            ? 'bg-gray-400'
                            : 'bg-blue-500'
                        }`}
                      >
                        {formikProps.isSubmitting ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text className="text-white font-dm-sans-semibold text-center text-base">
                            {editingContact ? 'Update Contact' : 'Add Contact'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};
