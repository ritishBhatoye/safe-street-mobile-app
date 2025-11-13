import React, { forwardRef, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ActionsSheet, { SheetProps, ActionSheetRef } from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface ActionSheetProps extends Partial<SheetProps> {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  headerGradient?: [string, string, ...string[]];
}

export const ActionSheet = forwardRef<ActionSheetRef, ActionSheetProps>(
  (
    {
      title,
      subtitle,
      children,
      showCloseButton = true,
      headerGradient = ['rgba(59, 130, 246, 0.1)', 'rgba(147, 51, 234, 0.1)'],
      ...props
    },
    ref
  ) => {
    return (
      <ActionsSheet
        ref={ref}
        containerStyle={styles.container}
        gestureEnabled={true}
        defaultOverlayOpacity={0.3}
        snapPoints={[50, 75, 100]}
        initialSnapIndex={1}
        enableGesturesInScrollView={false}
        indicatorStyle={styles.hiddenIndicator}
        {...props}
      >
        <View style={styles.content}>
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              <LinearGradient
                colors={headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
              >
                <View style={styles.headerContent}>
                  {/* Handle Bar */}
                  <View style={styles.handleBar} />

                  {/* Title Section */}
                  {title && (
                    <View style={styles.titleSection}>
                      <Text style={styles.title}>{title}</Text>
                      {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                      )}
                    </View>
                  )}

                  {/* Close Button */}
                  {showCloseButton && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => {
                        if (ref && typeof ref !== 'function' && ref.current) {
                          ref.current.hide();
                        }
                      }}
                    >
                      <BlurView intensity={20} tint="light" style={styles.closeButtonBlur}>
                        <Ionicons name="close" size={24} color="#6B7280" />
                      </BlurView>
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Content */}
          <View style={styles.body}>{children}</View>
        </View>
      </ActionsSheet>
    );
  }
);

ActionSheet.displayName = 'ActionSheet';

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#ffffff',
  },
  hiddenIndicator: {
    width: 0,
    height: 0,
    opacity: 0,
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerGradient: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    position: 'relative',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  titleSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'DMSans-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: '#6B7280',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
