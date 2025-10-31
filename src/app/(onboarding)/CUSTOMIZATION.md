# Customization Guide

## Changing Onboarding Content

### 1. Update Slide Content

Edit `src/data/onboardingData.ts`:

```typescript
export const onboardingData: OnBoardingType[] = [
  {
    id: 1,
    title: "Your Custom Title",
    subtitle: "Your custom description text here",
    image: "https://your-image-url.com/image.jpg", // Or local: require('@/assets/...')
    backgroundColor: ["rgba(51, 153, 255, 0.9)", "rgba(0, 128, 255, 0.95)"],
    icon: "🎨", // Any emoji
  },
  // Add more slides...
];
```

### 2. Change Colors

Use app's color system from `tailwind.config.js`:

**Primary Colors:**

- `primary-500`: #3399FF (Main blue)
- `secondary-500`: #00FFF5 (Teal)
- `tertiary-500`: #8B5CF6 (Purple)
- `accent-500`: #F97316 (Orange)
- `success-500`: #22C55E (Green)

**Gradient Examples:**

```typescript
// Blue gradient
backgroundColor: ["rgba(51, 153, 255, 0.9)", "rgba(0, 128, 255, 0.95)"];

// Purple gradient
backgroundColor: ["rgba(139, 92, 246, 0.9)", "rgba(124, 58, 237, 0.95)"];

// Teal gradient
backgroundColor: ["rgba(0, 255, 245, 0.85)", "rgba(0, 153, 147, 0.95)"];

// Green gradient
backgroundColor: ["rgba(34, 197, 94, 0.9)", "rgba(22, 163, 74, 0.95)"];
```

### 3. Customize Permissions

Edit `src/app/(onboarding)/permissions.tsx`:

```typescript
const PERMISSIONS = [
  {
    id: 1,
    icon: "📍",
    title: "Your Permission Title",
    description: "Your permission description",
    required: true, // or false
    color: "bg-primary-50 dark:bg-primary-900/30",
    iconBg: "bg-primary-100 dark:bg-primary-800/50",
  },
  // Add more permissions...
];
```

**Color Combinations:**

```typescript
// Primary (Blue)
color: "bg-primary-50 dark:bg-primary-900/30";
iconBg: "bg-primary-100 dark:bg-primary-800/50";

// Secondary (Teal)
color: "bg-secondary-50 dark:bg-secondary-900/30";
iconBg: "bg-secondary-100 dark:bg-secondary-800/50";

// Tertiary (Purple)
color: "bg-tertiary-50 dark:bg-tertiary-900/30";
iconBg: "bg-tertiary-100 dark:bg-tertiary-800/50";

// Success (Green)
color: "bg-success-50 dark:bg-success-900/30";
iconBg: "bg-success-100 dark:bg-success-800/50";
```

### 4. Adjust Animation Timing

Edit animation values in components:

**Icon Scale Speed:**

```typescript
// In OnboardingItem.tsx
const iconScale = scrollX.interpolate({
  inputRange,
  outputRange: [0.7, 1, 0.7], // Change these values
  extrapolate: "clamp",
});
```

**Text Slide Distance:**

```typescript
// In OnboardingItem.tsx
const translateY = scrollX.interpolate({
  inputRange,
  outputRange: [50, 0, -50], // Increase for more movement
  extrapolate: "clamp",
});
```

**Progress Dot Size:**

```typescript
// In Pagination.tsx
const dotWidth = scrollX.interpolate({
  inputRange,
  outputRange: [8, 24, 8], // [inactive, active, inactive]
  extrapolate: "clamp",
});
```

**Button Press Animation:**

```typescript
// In permissions.tsx
Animated.timing(animatedValues[index].scale, {
  toValue: 0.95, // Scale down amount
  duration: 100, // Speed in ms
  useNativeDriver: true,
});
```

### 5. Change Button Styles

Edit `src/components/atoms/Button.tsx`:

```typescript
const variantStyles = {
  primary: "bg-primary-500 active:bg-primary-600",
  secondary: "bg-secondary-500 active:bg-secondary-600",
  // Add custom variants...
};
```

### 6. Modify Layout

**Change Icon Size:**

```typescript
// In OnboardingItem.tsx
<Text style={{ fontSize: 100 }}>{item.icon}</Text>
// Change 100 to your desired size
```

**Adjust Decorative Circles:**

```typescript
// In OnboardingItem.tsx
<View className="absolute h-64 w-64 rounded-full bg-white/10" />
<View className="absolute h-48 w-48 rounded-full bg-white/20" />
<View className="absolute h-32 w-32 rounded-full bg-white/30" />
// Modify h-XX and w-XX values
```

**Change Text Sizes:**

```typescript
// Title
<Text className="text-3xl font-bold">
// Change to: text-2xl, text-4xl, text-5xl

// Subtitle
<Text className="text-lg leading-7">
// Change to: text-base, text-xl, text-2xl
```

### 7. Add More Slides

Simply add more objects to the array:

```typescript
export const onboardingData: OnBoardingType[] = [
  // ... existing slides
  {
    id: 4,
    title: "Fourth Slide",
    subtitle: "Additional information",
    image: "https://...",
    backgroundColor: ["rgba(...)", "rgba(...)"],
    icon: "✨",
  },
];
```

### 8. Change Navigation Routes

**After Onboarding:**

```typescript
// In AuthActionButtons.tsx
const handleGetStarted = () => {
  router.push("./permissions"); // Change to your route
};
```

**After Permissions:**

```typescript
// In permissions.tsx
const handleContinue = () => {
  router.replace("/(auth)/sign-in"); // Change to your route
};
```

### 9. Use Local Images

Instead of URLs, use local images:

```typescript
// In onboardingData.ts
import image1 from "@/assets/images/onboarding-1.jpg";

export const onboardingData: OnBoardingType[] = [
  {
    id: 1,
    image: image1, // Use imported image
    // ... rest of config
  },
];
```

### 10. Customize Privacy Notice

Edit the info box in `permissions.tsx`:

```typescript
<View className="mx-6 mb-8 rounded-2xl bg-primary-50 p-5">
  <Text className="mb-2 text-base font-semibold text-primary-700">
    🔒 Your Custom Title
  </Text>
  <Text className="text-sm leading-5 text-primary-600">
    Your custom privacy message here
  </Text>
</View>
```

## Tips

1. **Keep it Simple**: 3-4 slides is optimal
2. **High Quality Images**: Use 1080x1920 or higher
3. **Short Text**: Keep titles under 5 words, descriptions under 20 words
4. **Consistent Icons**: Use similar style emojis or custom icons
5. **Test on Devices**: Check on different screen sizes
6. **Accessibility**: Ensure good contrast on all backgrounds
