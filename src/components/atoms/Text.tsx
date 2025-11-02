import React from 'react';
import type { TextProps as RNTextProps } from 'react-native';
import { Text as RNText } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  weight?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'regular'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white';
  fontFamily?:
    | 'quicksand'
    | 'barlow'
    | 'montserrat'
    | 'plus-jakarta-sans'
    | 'plus-jakarta-sans-extralight'
    | 'plus-jakarta-sans-medium'
    | 'plus-jakarta-sans-variable'
    | 'plus-jakarta-sans-semibold'
    | 'dancing-script';

  italic?: boolean;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color = 'primary',
  fontFamily = 'quicksand',
  italic = false,
  className,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'heading':
        return 'text-2xl';
      case 'subheading':
        return 'text-lg';
      case 'body':
        return 'text-base';
      case 'caption':
        return 'text-sm';
      case 'label':
        return 'text-xs';
      default:
        return 'text-base';
    }
  };

  const getFontStyles = () => {
    const baseFont = fontFamily;
    const isItalic = italic;

    // Handle Dancing Script separately as it's cursive
    if (fontFamily === 'dancing-script') {
      if (weight === 'bold') return 'font-dancing-script-bold';
      if (weight === 'medium') return 'font-dancing-script-medium';
      if (weight === 'semibold') return 'font-dancing-script-semibold';
      return 'font-dancing-script';
    }

    // For other fonts, construct the class name
    let fontClass = `font-${baseFont}`;

    // Add weight if not regular
    if (weight !== 'regular') {
      fontClass += `-${weight}`;
    }

    // Add italic if specified and supported
    if (
      isItalic &&
      (fontFamily === 'barlow' ||
        fontFamily === 'montserrat' ||
        fontFamily === 'plus-jakarta-sans')
    ) {
      fontClass += '-italic';
    }

    return fontClass;
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return 'text-gray-800';
      case 'secondary':
        return 'text-gray-500';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
      case 'white':
        return 'text-white';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <RNText
      className={`${getVariantStyles()} ${getFontStyles()} ${getColorStyles()} ${className || ''}`}
      {...props}
    >
      {children}
    </RNText>
  );
};
