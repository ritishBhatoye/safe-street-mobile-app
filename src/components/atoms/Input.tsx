import { MaterialCommunityIcons } from "@expo/vector-icons";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { tv } from "tailwind-variants";

type InputSize = "sm" | "md" | "lg";
type InputWidth = "full" | "half";
type InputVariant = "borderless" | "box" | "outline";

interface InputWithLabelProps extends TextInputProps {
  label?: string;
  size?: InputSize;
  width?: InputWidth;
  variant?: InputVariant;
  isPassword?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

const inputStyles = tv({
  base: "rounded-lg flex-row items-center",
  variants: {
    variant: {
      borderless: "bg-swiggy-accent-light border border-white/50",
      box: "bg-swiggy-accent-light border-2 border-white/50",
      outline: "bg-transparent border-b border-gray-400",
    },
    size: {
      sm: "text-sm p-2",
      md: "text-base p-3",
      lg: "text-lg p-4",
    },
    width: {
      full: "w-full",
      half: "w-1/2",
    },
  },
  defaultVariants: {
    variant: "box",
    size: "md",
    width: "full",
  },
});

const Input: React.FC<InputWithLabelProps> = ({
  label,
  value,
  onValueChange,
  placeholder,
  size = "md",
  width = "full",
  variant = "box",
  isPassword = false,
  className,
  inputClassName,
  labelClassName,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleTextChange = useCallback(
    (text: string) => {
      if (onValueChange) {
        onValueChange(text);
      }
    },
    [onValueChange]
  );

  return (
    <View className={`py-3 ${className}`}>
      {label && (
        <Text
          className={clsx(
            "font-semibold mb-1",
            isDarkMode ? "text-white" : "text-black/80",
            labelClassName
          )}
        >
          {label}
        </Text>
      )}
      <View className={clsx(inputStyles({ variant, size }), inputClassName)}>
        <TextInput
          className={clsx("flex-1 py-1 text-swiggy-text text-white")}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          secureTextEntry={isPassword && !passwordVisible}
          placeholderTextColor={isDarkMode ? "#CCCCCC" : "#333333"}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#CCCCCC"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;
