import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { authService } from '@/services/auth.service';
import { showToast } from '@/utils/toast';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      showToast.warning('Email Required', 'Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.resetPassword(email);

      if (result.error) {
        showToast.error('Reset Failed', result.error.message || 'Failed to send reset email');
        setLoading(false);
        return;
      }

      setLoading(false);
      setEmailSent(true);
      showToast.success('Email Sent!', 'Check your inbox for reset instructions');
    } catch (error) {
      showToast.error('Error', 'An unexpected error occurred');
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          className="flex-1"
          style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        >
          <View className="flex-1 items-center justify-center px-6">
            {/* Success Icon */}
            <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="mail-open" size={64} color="#FFFFFF" />
            </View>

            {/* Title */}
            <Text className="font-dm-sans-bold mb-4 text-center text-3xl text-white">
              Check Your Email
            </Text>

            {/* Description */}
            <Text className="font-dm-sans mb-8 text-center text-lg text-white/80">
              We&apos;ve sent password reset instructions to{'\n'}
              <Text className="font-dm-sans-semibold">{email}</Text>
            </Text>

            {/* Actions */}
            <View className="w-full gap-3">
              <Button
                title="Open Email App"
                onPress={() => {
                  // Open email app
                }}
                variant="secondary"
                className="bg-white"
              />

              <Pressable
                onPress={() => router.back()}
                className="items-center py-3"
              >
                <Text className="font-dm-sans-semibold text-white">
                  Back to Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        className="pb-8 pt-16"
        style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <View className="px-6">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="mb-8 h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>

          {/* Title */}
          <View className="mb-4">
            <Text className="font-dm-sans-bold mb-2 text-4xl text-white">
              Forgot Password?
            </Text>
            <Text className="font-dm-sans text-lg text-white/80">
              No worries, we&apos;ll send you reset instructions
            </Text>
          </View>

          {/* Icon */}
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Text style={{ fontSize: 40 }}>🔑</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-8">
            {/* Info Box */}
            <View className="mb-6 rounded-2xl bg-warning-50 p-4 dark:bg-warning-900/20">
              <Text className="font-dm-sans text-sm leading-6 text-warning-700 dark:text-warning-300">
                Enter your email address and we&apos;ll send you a link to reset your
                password.
              </Text>
            </View>

            {/* Email Input */}
            <Input
              label="Email Address"
              placeholder="your.email@example.com"
              value={email}
              onValueChange={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              variant="outline"
              className="mb-6"
              labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
            />

            {/* Reset Button */}
            <Button
              title={loading ? 'Sending...' : 'Send Reset Link'}
              onPress={handleResetPassword}
              loading={loading}
              disabled={!email}
              className="mb-4"
            />

            {/* Back to Sign In */}
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center justify-center gap-2 py-3"
            >
              <Ionicons name="arrow-back" size={16} color="#3399FF" />
              <Text className="font-dm-sans-semibold text-primary-500">
                Back to Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
