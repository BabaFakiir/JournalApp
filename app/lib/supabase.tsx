import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://fbcequeftvgcysbrjuma.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY2VxdWVmdHZnY3lzYnJqdW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTQwNzcsImV4cCI6MjA2ODY3MDA3N30.oGrYI1pG5Pygtb-jnMq_vgULJtS72aeZ1r7YvIDoTLI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // important for mobile
    },
    }
);