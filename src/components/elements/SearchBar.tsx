import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

import { ICONS } from '@/constants';

import { Icon } from '../atoms';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  className,
}) => (
  <View
    className={`flex-row items-center rounded-xl bg-gray-500/20 px-4 py-3 ${className}`}
  >
    <Icon name={ICONS.search} size="small" color="#6B7280" className="mr-3" />
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      className="flex-1 font-quicksand-medium text-base text-gray-700"
      placeholderTextColor="#9CA3AF"
    />
    {value.length > 0 && onClear && (
      <TouchableOpacity onPress={onClear}>
        <Icon name={ICONS.close} size="small" color="#6B7280" />
      </TouchableOpacity>
    )}
  </View>
);
