import React, { useEffect, useCallback } from 'react';
import { View, Text, Dimensions, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onAnimationComplete,
}) => {
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  
  const shieldScale = useSharedValue(0);
  const shieldGlow = useSharedValue(0);
  
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  
  const taglineOpacity = useSharedValue(0);
  const taglineScale = useSharedValue(0.8);
  
  const particlesOpacity = useSharedValue(0);
  const waveProgress = useSharedValue(0);
  
  const finalFade = useSharedValue(1);

  // Wrap callback to ensure it's stable
  const handleComplete = useCallback(() => {
    onAnimationComplete();
  }, [onAnimationComplete]);

  useEffect(() => {
    // Shield animation (0.5s delay)
    setTimeout(() => {
      shieldScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.back(1.5) }),
        withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) })
      );
      
      shieldGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }, 500);

    // Logo animation (1.2s delay)
    setTimeout(() => {
      logoOpacity.value = withTiming(1, { duration: 400 });
      logoScale.value = withSequence(
        withTiming(1.3, { duration: 400, easing: Easing.back(1.5) }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
      );
      
      logoRotation.value = withSequence(
        withTiming(360, { duration: 800, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 })
      );
    }, 1200);

    // Text animations (2s delay)
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
      textTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.2)) });
    }, 2000);

    // Tagline and particles (2.8s delay)
    setTimeout(() => {
      taglineOpacity.value = withTiming(1, { duration: 500 });
      taglineScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.2)) });
      
      particlesOpacity.value = withTiming(1, { duration: 800 });
      waveProgress.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        -1,
        false
      );
    }, 2800);

    // Final fade out (4.5s delay) - call completion on JS thread
    const fadeTimeout = setTimeout(() => {
      finalFade.value = withTiming(0, { 
        duration: 800, 
        easing: Easing.in(Easing.quad) 
      }, (finished) => {
        'worklet';
        if (finished) {
          runOnJS(handleComplete)();
        }
      });
    }, 4500);

    return () => clearTimeout(fadeTimeout);
  }, [handleComplete, shieldScale, shieldGlow, logoOpacity, logoScale, logoRotation, textOpacity, textTranslateY, taglineOpacity, taglineScale, particlesOpacity, waveProgress, finalFade]);

  // Animated styles
  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: finalFade.value,
  }));

  const shieldStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shieldScale.value }],
    opacity: shieldGlow.value * 0.8 + 0.2,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` }
    ],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ scale: taglineScale.value }],
  }));

  const particlesStyle = useAnimatedStyle(() => ({
    opacity: particlesOpacity.value,
  }));

  const waveStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      waveProgress.value,
      [0, 1],
      [-SCREEN_WIDTH, SCREEN_WIDTH]
    );
    
    return {
      transform: [{ translateX }],
      opacity: particlesOpacity.value * 0.3,
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, backgroundStyle]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Background */}
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Animated Wave Background */}
        <Animated.View style={[waveStyle, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
          <LinearGradient
            colors={['transparent', 'rgba(59, 130, 246, 0.1)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>

        {/* Floating Particles */}
        <Animated.View style={[particlesStyle, { position: 'absolute', inset: 0 }]}>
          {Array.from({ length: 20 }, (_, i) => (
            <FloatingParticle key={i} index={i} />
          ))}
        </Animated.View>

        {/* Main Content */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          
          {/* Shield Background */}
          <Animated.View
            style={[
              shieldStyle,
              {
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 30,
                elevation: 20,
              }
            ]}
          />

          {/* Logo Icon */}
          <Animated.View style={logoStyle}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#3B82F6',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Ionicons name="shield-checkmark" size={40} color="white" />
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.View style={[textStyle, { marginTop: 40 }]}>
            <Text
              style={{
                fontSize: 36,
                fontFamily: 'dm-sans-bold',
                color: 'white',
                textAlign: 'center',
                letterSpacing: 2,
                textShadowColor: 'rgba(59, 130, 246, 0.5)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 8,
              }}
            >
              SafeStreet
            </Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={[taglineStyle, { marginTop: 16 }]}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'dm-sans',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                letterSpacing: 1,
              }}
            >
              Keeping Communities Safe Together
            </Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View style={[particlesStyle, { marginTop: 60 }]}>
            <LoadingDots />
          </Animated.View>
        </View>

        {/* Bottom Branding */}
        <Animated.View style={[taglineStyle, { position: 'absolute', bottom: 60, left: 0, right: 0 }]}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'dm-sans',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              letterSpacing: 0.5,
            }}
          >
            Powered by Community • Built for Safety
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

// Floating Particle Component
const FloatingParticle: React.FC<{ index: number }> = ({ index }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const delay = index * 100;
    
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 1000 });
      scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.2)) });
      
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000 + index * 100, easing: Easing.inOut(Easing.sin) }),
          withTiming(20, { duration: 2000 + index * 100, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }, delay);
  }, [index, opacity, scale, translateY]);

  const particleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });

  const left = (index % 5) * (SCREEN_WIDTH / 5) + Math.random() * 50;
  const top = Math.random() * SCREEN_HEIGHT;
  const size = 4 + Math.random() * 6;

  return (
    <Animated.View
      style={[
        particleStyle,
        {
          position: 'absolute',
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        }
      ]}
    />
  );
};

// Loading Dots Component
const LoadingDots: React.FC = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animateDots = () => {
      dot1.value = withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 400 })
      );
      
      setTimeout(() => {
        dot2.value = withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        );
      }, 200);
      
      setTimeout(() => {
        dot3.value = withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        );
      }, 400);
    };

    const interval = setInterval(animateDots, 1200);
    animateDots();

    return () => clearInterval(interval);
  }, [dot1, dot2, dot3]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
  }));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Animated.View
        style={[
          dot1Style,
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#3B82F6',
          }
        ]}
      />
      <Animated.View
        style={[
          dot2Style,
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#3B82F6',
          }
        ]}
      />
      <Animated.View
        style={[
          dot3Style,
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#3B82F6',
          }
        ]}
      />
    </View>
  );
};