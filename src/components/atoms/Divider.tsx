import React from 'react';
import { View, type ViewProps } from 'react-native';

interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  className = '',
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      className={`bg-gray-200 dark:bg-gray-700 ${isHorizontal ? 'w-full' : 'h-full'} ${className}`}
      style={{
        [isHorizontal ? 'height' : 'width']: thickness,
      }}
      {...props}
    />
  );
};
