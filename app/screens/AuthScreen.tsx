import React, { useState } from 'react'
import { JSX } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function AuthScreen(): JSX.Element {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const { signIn, signUp } = useAuth()

    const handleAuth = async (): Promise<void> => {
        if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields')
        return
        }

        setLoading(true)
        
        try {
        let result
        if (isLogin) {
            result = await signIn(email, password)
        } else {
            result = await signUp(email, password)
        }

        if (result.error) {
            Alert.alert('Error', result.error.message)
        } else if (!isLogin) {
            Alert.alert('Success', 'Please check your email to confirm your account')
        }
        } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred')
        } finally {
        setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <View style={styles.formContainer}>
            <Text style={styles.title}>Journal App</Text>
            <Text style={styles.subtitle}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </Text>

            <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />

            <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />

            <TouchableOpacity 
            style={styles.button} 
            onPress={handleAuth}
            disabled={loading}
            >
            <Text style={styles.buttonText}>
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
            >
            <Text style={styles.switchText}>
                {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"
                }
            </Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    )
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    switchButton: {
        paddingVertical: 10,
    },
    switchText: {
        textAlign: 'center',
        color: '#007AFF',
        fontSize: 14,
    },
})