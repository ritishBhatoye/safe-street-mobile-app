import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { urlFor } from '@/api/sanity';
import { Text } from '@/components/atoms';

interface Props {
  item: FoodItemType;
  cardType: 'shrink' | 'expand';
}

const FoodItemCard = ({ item, cardType }: Props) => {
  const imageUri: any = item?.image?.asset
    ? urlFor(item.image)
    : typeof item.image === 'string'
      ? item.image
      : undefined;

  return (
    <View
      className={`rounded-2xl bg-white p-4 py-5 pb-7 ${
        cardType === 'shrink' ? 'w-56 flex-col' : 'flex-1 flex-row'
      }`}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="rounded-2xl"
          style={{
            borderRadius: 9,
            height: cardType === 'shrink' ? 120 : 150,
            width: cardType === 'shrink' ? '100%' : 100,
            backgroundColor: '#F3F4F6',
          }}
        />
      ) : (
        <View
          className="rounded-2xl"
          style={{
            borderRadius: 9,
            height: cardType === 'shrink' ? 120 : 150,
            width: cardType === 'shrink' ? '100%' : 100,
            backgroundColor: '#F3F4F6',
          }}
        />
      )}
      <View
        className={`flex-col items-start justify-between ${
          cardType === 'shrink' ? 'mt-3' : 'ml-4 flex-1'
        }`}
      >
        <View className="w-full">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="flex-1 font-medium" numberOfLines={1}>
              {item?.name}
            </Text>
            <View className="ml-2 flex-row items-center">
              <Ionicons name="star" color="#FFD700" size={16} />
              <Text className="ml-1 text-xs">4.5</Text>
            </View>
          </View>
          <Text
            className="text-sm text-gray-600"
            variant="body"
            numberOfLines={2}
          >
            {item?.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;
