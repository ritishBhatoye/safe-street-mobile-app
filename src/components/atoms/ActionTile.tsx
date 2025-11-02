import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionTileProps {
  actionData: {
    id: number;
    title: string;
    iconName: ComponentProps<typeof Ionicons>['name'];
    color: string;
  };
}

const ActionTile = ({ actionData }: ActionTileProps) => (
  <TouchableOpacity className="flex flex-row items-center justify-between">
    <View className="flex flex-row items-center gap-2">
      <Ionicons name={actionData.iconName} size={24} color={actionData.color} />
      <Text className="text-lg font-semibold text-black">
        {actionData.title}
      </Text>
    </View>
    <Ionicons name="chevron-forward-outline" color={'black'} size={24} />
  </TouchableOpacity>
);

export default ActionTile;
