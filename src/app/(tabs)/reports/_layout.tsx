import { Stack } from 'expo-router'
import React from 'react'

const ReportsLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='details'/>
        <Stack.Screen name='create-report'/>

    </Stack>
  )
}

export default ReportsLayout