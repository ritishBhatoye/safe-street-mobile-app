import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'expo-image';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { AuthActionButtons } from '@/components/onboarding/AuthActionButtons';
import { OnboardingItem } from '@/components/onboarding/OnboardingItem';
import { Pagination } from '@/components/onboarding/Pagination';
import { onboardingData } from '@/data/onboardingData';

const { width: screenWidth } = Dimensions.get('window');

const OnBoardingScreen = (): ReactElement => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const width = screenWidth;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0]?.index || 0);
      }
    }
  ).current;

  const backgroundImage =
    onboardingData[currentIndex]?.image || onboardingData[0]?.image;
  
  const gradientColors = onboardingData[currentIndex]?.backgroundColor || [
    'rgba(51, 153, 255, 0.9)',
    'rgba(0, 128, 255, 0.95)',
  ];

  const handleSkip = () => {
    if (slidesRef.current) {
      slidesRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={{ flex: 1 }}
      className="flex-1"
      contentFit="cover"
      transition={500}
    >
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={[gradientColors[0], gradientColors[1], 'rgba(0,0,0,0.8)']}
        style={{ flex: 1 }}
      >
        {/* Fixed Header - Skip Button */}
        <View className="absolute left-0 right-0 top-0 z-10 px-6 pt-14">
          {currentIndex < onboardingData.length - 1 && (
            <Pressable onPress={handleSkip} className="self-end px-4 py-2">
              <Text className="text-base font-semibold text-white">Skip</Text>
            </Pressable>
          )}
        </View>

        {/* Scrollable Content Area - Only this part transitions */}
        <View className="flex-1">
          <FlatList
            data={onboardingData}
            renderItem={({ item, index }) => (
              <OnboardingItem
                item={item}
                width={width}
                scrollX={scrollX}
                index={index}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            ref={slidesRef}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
        </View>

        {/* Fixed Footer - Pagination & Buttons */}
        <View className="pb-12">
          <View className="items-center">
            <Pagination data={onboardingData} scrollX={scrollX} width={width} />
          </View>
          
          {currentIndex === onboardingData.length - 1 && (
            <AuthActionButtons />
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default OnBoardingScreen;
