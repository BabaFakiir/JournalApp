import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'
import { AuthProvider, useAuth } from '../context/AuthContext'
import AuthScreen from '../screens/AuthScreen'
import JournalScreen from '../screens/JournalScreen'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar style="auto" />
      {user ? <JournalScreen /> : <AuthScreen />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}