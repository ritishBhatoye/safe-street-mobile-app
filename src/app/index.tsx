import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const modal = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-5xl text-red-500">Hey</Text>
    </SafeAreaView>
  );
};

export default modal;
