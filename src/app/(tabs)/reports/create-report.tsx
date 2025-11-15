import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { CreateIncidentForm } from '@/components/incidents/CreateIncidentForm'


const CreateReportScreen = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      {/* Spacer to push content down */}
     
      
      {/* Modal Content */}
      <View 
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,

        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Handle Bar */}
          <View className="items-center py-3">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>
          
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text className="text-xl font-dm-sans-bold text-black">
              Report Incident
            </Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <CreateIncidentForm 
            onSuccess={() => router.back()}
            onCancel={() => router.back()}
          />
        </SafeAreaView>
      </View>
    </View>
  )
}

export default CreateReportScreen