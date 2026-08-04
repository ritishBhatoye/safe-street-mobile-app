import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { FormikProps } from "formik";
import { IncidentFormValues } from "@/utils/incidentValidation";
import { IncidentType, IncidentSeverity } from "@/constants/incidents";
import { IncidentTypeStep } from "./Steps/IncidentTypeStep";
import { SeverityDetailsStep } from "./Steps/SeverityDetailsStep";
import { LocationDescriptionStep } from "./Steps/LocationDescriptionStep";
import { ReanimatedBackground } from "./ReanimatedBackground";
import { ReanimatedStepTransition } from "./ReanimatedStepTransition";
import { LoadingOverlay } from "./LoadingOverlay";
import { Button } from "@/components/atoms";

interface CreateIncidentFormProps {
  // Formik Props
  formikProps: FormikProps<IncidentFormValues>;

  // Step Management
  currentStep: number;
  onStepChange: (step: number) => void;

  // Actions
  onCancel?: () => void;

  // State
  isLoading: boolean;
  isGettingLocation: boolean;

  // Handlers
  onGetLocation: () => void;
  onPickOnMap: () => void;
  validateCurrentStep: (step: number) => Promise<boolean>;
}

export const CreateIncidentForm: React.FC<CreateIncidentFormProps> = ({
  formikProps,
  currentStep,
  onStepChange,
  onCancel,
  isLoading,
  isGettingLocation,
  onGetLocation,
  onPickOnMap,
  validateCurrentStep,
}) => {
  const { values, errors, touched, setFieldValue, handleSubmit } = formikProps;
  const stepTitles = ["Select Incident Type", "Set Severity & Title", "Add Location & Details"];

  const nextStep = async () => {
    if (currentStep < 3) {
      const isValid = await validateCurrentStep(currentStep);
      if (isValid) {
        onStepChange(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return !!values.type && !errors.type;
      case 2:
        return !!values.severity && !!values.title?.trim() && !errors.severity && !errors.title;
      case 3:
        return !!values.latitude && !!values.longitude && !errors.latitude && !errors.longitude;
      default:
        return false;
    }
  };

  // Get current step errors
  const getCurrentStepErrors = () => {
    const stepErrors: string[] = [];

    switch (currentStep) {
      case 1:
        if (touched.type && errors.type) stepErrors.push(errors.type);
        break;
      case 2:
        if (touched.severity && errors.severity) stepErrors.push(errors.severity);
        if (touched.title && errors.title) stepErrors.push(errors.title);
        break;
      case 3:
        if (touched.latitude && errors.latitude) stepErrors.push(errors.latitude);
        if (touched.longitude && errors.longitude) stepErrors.push(errors.longitude);
        if (touched.description && errors.description) stepErrors.push(errors.description);
        break;
    }

    return stepErrors;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IncidentTypeStep
            selectedType={values.type as IncidentType}
            onTypeSelect={(type: IncidentType) => setFieldValue("type", type)}
            error={touched.type ? errors.type : undefined}
          />
        );
      case 2:
        return (
          <SeverityDetailsStep
            selectedSeverity={values.severity as IncidentSeverity}
            title={values.title}
            onSeveritySelect={(severity: IncidentSeverity) => setFieldValue("severity", severity)}
            onTitleChange={(title: string) => setFieldValue("title", title)}
            severityError={touched.severity ? errors.severity : undefined}
            titleError={touched.title ? errors.title : undefined}
          />
        );
      case 3:
        return (
          <LocationDescriptionStep
            latitude={values.latitude}
            longitude={values.longitude}
            address={values.address}
            description={values.description}
            isGettingLocation={isGettingLocation}
            onGetLocation={onGetLocation}
            onPickOnMap={onPickOnMap}
            onDescriptionChange={(description: string) => setFieldValue("description", description)}
            locationError={
              (touched.latitude && errors.latitude) || (touched.longitude && errors.longitude)
                ? "Location is required"
                : undefined
            }
            descriptionError={touched.description ? errors.description : undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 dark:bg-gray-700">
      {/* Reanimated Background */}
      <ReanimatedBackground currentStep={currentStep} />

      <ScrollView className="flex-1 px-4 dark:bg-gray-700" showsVerticalScrollIndicator={false}>
        {/* Error Messages */}
        {getCurrentStepErrors().length > 0 && (
          <Animated.View entering={FadeInDown.delay(100)}>
            <BlurView intensity={20} tint="light" className="rounded-2xl mb-4 overflow-hidden">
              <View className="p-4 bg-red-500/10">
                {getCurrentStepErrors().map((error, index) => (
                  <View key={index} className="flex-row items-center mb-1">
                    <Ionicons name="warning" size={16} color="#EF4444" />
                    <Text className="text-red-600 dark:text-red-400 text-sm ml-2 font-dm-sans">
                      {error}
                    </Text>
                  </View>
                ))}
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Reanimated Step Transition */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <ReanimatedStepTransition
            currentStep={currentStep}
            totalSteps={3}
            stepTitles={stepTitles}
          />
        </Animated.View>

        {/* Step Content */}
        <Animated.View entering={FadeInUp.delay(200)} className="flex-1">
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      {/* Navigation Footer */}
      <Animated.View className={"rounded-ss-3xl rounded-se-3xl"} entering={FadeInUp.delay(400)}>
        <BlurView intensity={20} tint="light" className="border-t-0 rounded-ss-3xl rounded-se-3xl">
          <View className="p-4 bg-gray-200/50 dark:bg-gray-900">
            <View className="flex-row gap-3 items-center justify-center">
              {currentStep > 1 && (
                <Button
                  title="Back"
                  onPress={prevStep}
                  variant="secondary"
                  size="medium"
                  className="flex-1 max-w-[120px]"
                />
              )}

              {currentStep < 3 ? (
                <Button
                  title="Continue"
                  onPress={nextStep}
                  disabled={!canProceedToNextStep()}
                  variant="primary"
                  size="medium"
                  className={currentStep > 1 ? "flex-1 w-full" : "flex-1 w-full"}
                />
              ) : (
                <Button
                  title={isLoading ? "Submitting..." : "Submit Report"}
                  onPress={() => handleSubmit()}
                  disabled={!canProceedToNextStep()}
                  loading={isLoading}
                  variant="primary"
                  // size="medium"
                  className={
                    currentStep > 1
                      ? "flex-1 w-full bg-green-600 active:bg-green-700"
                      : "flex-1 w-full bg-green-600 active:bg-green-700"
                  }
                />
              )}
            </View>

            {currentStep === 1 && onCancel && (
              <Button
                className="w-full mt-3"
                onPress={onCancel}
                title="Cancel"
                variant="danger"
                size="medium"
              />
            )}
          </View>
        </BlurView>
      </Animated.View>

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={isLoading}
        message="Creating your safety report and notifying the community..."
      />
    </View>
  );
};
