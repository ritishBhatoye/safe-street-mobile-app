import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";

type SocialProviderType = "google" | "apple";

const OAuthAction = ({ handlePress }: { handlePress: (social: SocialProviderType) => void }) => {
  return (
    <View className="flex-row gap-4 mb-8">
      <TouchableOpacity
        className="flex-1 flex-row item-center justify-center gap-2 rounded-2xl border-2 border-gray-200 py-4 dark:border-gray-700 dark:bg-gray-800"
        onPress={() => handlePress("google")}
      >
        <Ionicons name="logo-google" size={20} color="#EA4335" />
        <Text className="font-dm-sans-semibold text-gray-700 dark:text-gray-300">Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handlePress("apple")}
        className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <Ionicons name="logo-apple" size={20} color="#000000" />
        <Text className="font-dm-sans-semibold text-gray-700 dark:text-gray-300">Apple</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OAuthAction;
