// import { Colors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  error?: string;
  touched?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  showPasswordStrength?: boolean;
  onBlur?: TextInputProps["onBlur"];
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
  endContent,
  startContent,
  error,
  touched,
  isRequired,
  isDisabled,
  isReadOnly,
  showPasswordStrength,
  onBlur,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const isInvalid = !!error && !!touched;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleTextChange = useCallback(
    (text: string) => {
      if (onValueChange) {
        onValueChange(text);
      }
    },
    [onValueChange],
  );

  return (
    <View className={`py-3 ${className}`}>
      {label && (
        <View className="flex-row items-center mb-1.5">
          <Text
            className={clsx(
              "font-semibold mb-1",
              isDarkMode ? "text-white" : "text-black/80",
              labelClassName,
            )}
          >
            {label}
          </Text>
          {isRequired && <Text className="text-error-500 ml-0.5 mb-1.5">*</Text>}
        </View>
      )}
      <View className={clsx(inputStyles({ variant, size }), inputClassName)}>
        {startContent && <View className="ml-3">{endContent}</View>}

        <TextInput
          className={clsx("flex-1 py-1 text-black dark:text-white")}
          value={value}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          secureTextEntry={isPassword && !passwordVisible}
          placeholderTextColor={isDarkMode ? "#CCCCCC" : "#333333"}
          editable={!isDisabled && !isReadOnly}
          {...rest}
        />
        {isPassword && value && value.length > 0 && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#CCCCCC"}
            />
          </TouchableOpacity>
        )}
        {endContent && <View className="ml-3">{endContent}</View>}
      </View>
      {isInvalid && !showPasswordStrength && (
        <View className="flex-row items-center mt-1">
          <Ionicons name="alert-circle" size={14} color={"#EF4444"} />
          <Text className="text-xs text-danger-500 ml-1">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;
