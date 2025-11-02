import { BlurView } from 'expo-blur';
import React from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  width?: number; // Accept tailwind fraction (like '4/5') or fixed number
  height?: number; // Optional height
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title = '',
  message = '',
  onClose,
  confirmText = 'OK',
  onConfirm,
  width = 270,
  height,
}) => {
  // If height is number, use it; otherwise default
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = height ?? screenHeight * 0.22; // default 40% of screen

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose} // Android back button
    >
      <BlurView intensity={80} className="flex-1 items-center justify-center">
        <View
          className={`rounded-xl bg-white p-5  shadow-lg`}
          style={{
            width,
            height: modalHeight,
          }}
        >
          {title ? (
            <Text className="mb-3 text-center text-xl font-bold">{title}</Text>
          ) : null}
          <Text className="mb-5 text-center text-base">{message}</Text>

          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              className="rounded-lg bg-gray-300 px-4 py-2"
              onPress={onClose}
            >
              <Text className="text-base text-black">Cancel</Text>
            </TouchableOpacity>

            {onConfirm && (
              <TouchableOpacity
                className="rounded-lg bg-green-500 px-4 py-2"
                onPress={onConfirm}
              >
                <Text className="text-base text-white">{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CustomModal;
