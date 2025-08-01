import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext'; // ✅ use your existing auth context

interface JournalEntry {
    user_id: string;
    entry_text: string;
    sentiment_tag: string;
    created_at: string;
}

const JournalScreen = () => {
    const { user } = useAuth(); // ✅ grab user from AuthContext
    const [entryText, setEntryText] = useState('');
    const [journals, setJournals] = useState<JournalEntry[]>([]);

    useEffect(() => {
        if (user) {
        fetchJournals();
        }
    }, [user]);

    const fetchJournals = async () => {
        const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

        if (error) {
        console.error('Error fetching journals:', error);
        } else {
        setJournals(data as JournalEntry[]);
        }
    };

    const getSentimentFromGemini = async (text: string): Promise<string> => {
        try {
        const prompt = `Classify the sentiment of the following journal entry as one of: "positive", "neutral", or "negative". Respond with only the sentiment tag.\n\n"${text}"`;

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=',
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                {
                    parts: [{ text: prompt }],
                },
                ],
            }),
            }
        );

        const json = await response.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase();

        if (rawText?.includes('positive')) return 'positive';
        if (rawText?.includes('negative')) return 'negative';
        return 'neutral';
        } catch (err) {
        console.error('Gemini sentiment error:', err);
        return 'neutral';
        }
    };

  const handleSaveJournal = async () => {
    if (!entryText.trim()) {
        Alert.alert('Entry is empty');
        return;
    }

    if (!user) {
        Alert.alert('You must be logged in to save a journal entry.');
        return;
    }

    const sentiment = await getSentimentFromGemini(entryText);

    const { error } = await supabase.from('journals').insert([
        {
            user_id: user.id,
            entry_text: entryText,
            sentiment_tag: sentiment,
        },
    ]);

    if (error) {
        console.error('Error saving journal:', error);
        Alert.alert('Failed to save journal.');
        } else {
        setEntryText('');
        fetchJournals();
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.heading}>Journal</Text>
        <TextInput
            style={styles.input}
            placeholder="Write your thoughts..."
            value={entryText}
            onChangeText={setEntryText}
            multiline
        />
        <Button title="Save Entry" onPress={handleSaveJournal} />
        <FlatList
            data={journals}
            // keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View style={styles.journalItem}>
                <Text style={styles.entryText}>{item.entry_text}</Text>
                <Text style={styles.sentiment}>Sentiment: {item.sentiment_tag}</Text>
                <Text style={styles.timestamp}>
                {new Date(item.created_at).toLocaleString()}
                </Text>
            </View>
            )}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        height: 100,
        textAlignVertical: 'top',
    },
    journalItem: {
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    entryText: { fontSize: 16 },
    sentiment: { fontStyle: 'italic', marginTop: 4 },
    timestamp: { color: '#777', fontSize: 12, marginTop: 4 },
});

export default JournalScreen;
