import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";

type SocialProviderType = "google";

const OAuthAction = ({ handlePress }: { handlePress: (social: SocialProviderType) => void }) => {
  return (
    <View className="mb-8">
      <TouchableOpacity
        className="flex-row items-center justify-center gap-3 rounded-2xl border-2 border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800"
        onPress={() => handlePress("google")}
      >
        <Ionicons name="logo-google" size={24} color="#EA4335" />
        <Text className="font-dm-sans-semibold text-gray-700 dark:text-gray-300">
          Continue with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OAuthAction;
