import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface TouchCTAType {
  title: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

const TouchCTA = ({ title, onPress, className, textClassName, ...rest }: TouchCTAType) => {
  return (
    <TouchableOpacity onPress={onPress} className={className} activeOpacity={0.7} {...rest}>
      <Text className={textClassName}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TouchCTA;
