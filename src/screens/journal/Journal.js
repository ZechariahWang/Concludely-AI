import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    FlatList,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfileService } from '../../services/api/userProfile';
import { THEMES, TYPOGRAPHY, SPACING, RADIUS, MOODS } from '../../constants/app';

const Journal = () => {
    const { user } = useAuth();
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        mood: 'neutral',
        tags: '',
        isPrivate: false,
    });
    const [saving, setSaving] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editEntry, setEditEntry] = useState({
        title: '',
        content: '',
        mood: 'neutral',
        tags: '',
        isPrivate: false,
    });

    useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = async () => {
        if (!user) return;
        
        setLoading(true);
        const result = await UserProfileService.getUserJournals(user.$id);
        setLoading(false);
        
        if (result.success) {
            setJournals(result.data);
        } else {
            Alert.alert('Error', 'Failed to load journals');
        }
    };

    const handleSaveEntry = async () => {
        if (!newEntry.title.trim() || !newEntry.content.trim()) {
            Alert.alert('Error', 'Please fill in title and content');
            return;
        }

        setSaving(true);
        const entryData = {
            ...newEntry,
            tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        };

        const result = await UserProfileService.createJournalEntry(user.$id, entryData);
        setSaving(false);

        if (result.success) {
            Alert.alert('Success', 'Journal entry saved successfully');
            setShowNewEntry(false);
            setNewEntry({
                title: '',
                content: '',
                mood: 'neutral',
                tags: '',
                isPrivate: false,
            });
            loadJournals();
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const handleEditEntry = (item) => {
        setEditingEntry(item.$id);
        setEditEntry({
            title: item.title,
            content: item.content,
            mood: item.mood,
            tags: item.tags ? item.tags.join(', ') : '',
            isPrivate: item.isPrivate,
        });
        setShowNewEntry(false); // Close new entry form if open
    };

    const handleUpdateEntry = async () => {
        if (!editEntry.title.trim() || !editEntry.content.trim()) {
            Alert.alert('Error', 'Please fill in title and content');
            return;
        }

        setSaving(true);
        const entryData = {
            ...editEntry,
            tags: editEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        };

        const result = await UserProfileService.updateJournalEntry(editingEntry, entryData);
        setSaving(false);

        if (result.success) {
            Alert.alert('Success', 'Journal entry updated successfully');
            setEditingEntry(null);
            setEditEntry({
                title: '',
                content: '',
                mood: 'neutral',
                tags: '',
                isPrivate: false,
            });
            loadJournals();
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const handleCancelEdit = () => {
        setEditingEntry(null);
        setEditEntry({
            title: '',
            content: '',
            mood: 'neutral',
            tags: '',
            isPrivate: false,
        });
    };

    const handleDeleteEntry = async (entryId) => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this journal entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await UserProfileService.deleteJournalEntry(entryId);
                        if (result.success) {
                            loadJournals();
                        } else {
                            Alert.alert('Error', result.error);
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMoodEmoji = (mood) => {
        const moodEmojis = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            excited: '🤩',
            calm: '😌',
            anxious: '😰',
            neutral: '😐',
        };
        return moodEmojis[mood] || '😐';
    };

    const renderJournalEntry = ({ item }) => (
        <View style={styles.journalCard}>
            <View style={styles.journalHeader}>
                <View style={styles.journalTitleContainer}>
                    <Text style={styles.journalTitle}>{item.title}</Text>
                    <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
                </View>
                <Text style={styles.journalDate}>{formatDate(item.createdAt)}</Text>
            </View>
            
            <Text style={styles.journalContent} numberOfLines={3}>
                {item.content}
            </Text>
            
            {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {item.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
            
            <View style={styles.journalActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditEntry(item)}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteEntry(item.$id)}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading journals...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Journal</Text>
                <TouchableOpacity
                    style={styles.newEntryButton}
                    onPress={() => setShowNewEntry(!showNewEntry)}
                >
                    <Text style={styles.newEntryButtonText}>
                        {showNewEntry ? 'Cancel' : 'New Entry'}
                    </Text>
                </TouchableOpacity>
            </View>

            {editingEntry && (
                <View style={styles.newEntryForm}>
                    <Text style={styles.formTitle}>Edit Journal Entry</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Entry Title"
                        value={editEntry.title}
                        onChangeText={(text) => setEditEntry({ ...editEntry, title: text })}
                    />
                    
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Write your thoughts..."
                        value={editEntry.content}
                        onChangeText={(text) => setEditEntry({ ...editEntry, content: text })}
                        multiline
                        numberOfLines={6}
                    />
                    
                    <View style={styles.moodContainer}>
                        <Text style={styles.moodLabel}>Mood:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {['happy', 'sad', 'angry', 'excited', 'calm', 'anxious', 'neutral'].map((mood) => (
                                <TouchableOpacity
                                    key={mood}
                                    style={[
                                        styles.moodButton,
                                        editEntry.mood === mood && styles.selectedMoodButton
                                    ]}
                                    onPress={() => setEditEntry({ ...editEntry, mood })}
                                >
                                    <Text style={styles.moodButtonText}>
                                        {getMoodEmoji(mood)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    
                    <TextInput
                        style={styles.tagsInput}
                        placeholder="Tags (comma separated)"
                        value={editEntry.tags}
                        onChangeText={(text) => setEditEntry({ ...editEntry, tags: text })}
                    />
                    
                    <TouchableOpacity
                        style={styles.privateToggle}
                        onPress={() => setEditEntry({ ...editEntry, isPrivate: !editEntry.isPrivate })}
                    >
                        <Text style={styles.privateToggleText}>
                            {editEntry.isPrivate ? '🔒 Private' : '🌐 Public'}
                        </Text>
                    </TouchableOpacity>
                    
                    <View style={styles.editButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.saveButton, styles.cancelEditButton]}
                            onPress={handleCancelEdit}
                        >
                            <Text style={styles.cancelEditButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                            onPress={handleUpdateEntry}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>Update Entry</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {showNewEntry && !editingEntry && (
                <View style={styles.newEntryForm}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Entry Title"
                        value={newEntry.title}
                        onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
                    />
                    
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Write your thoughts..."
                        value={newEntry.content}
                        onChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
                        multiline
                        numberOfLines={6}
                    />
                    
                    <View style={styles.moodContainer}>
                        <Text style={styles.moodLabel}>Mood:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {['happy', 'sad', 'angry', 'excited', 'calm', 'anxious', 'neutral'].map((mood) => (
                                <TouchableOpacity
                                    key={mood}
                                    style={[
                                        styles.moodButton,
                                        newEntry.mood === mood && styles.selectedMoodButton
                                    ]}
                                    onPress={() => setNewEntry({ ...newEntry, mood })}
                                >
                                    <Text style={styles.moodButtonText}>
                                        {getMoodEmoji(mood)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    
                    <TextInput
                        style={styles.tagsInput}
                        placeholder="Tags (comma separated)"
                        value={newEntry.tags}
                        onChangeText={(text) => setNewEntry({ ...newEntry, tags: text })}
                    />
                    
                    <TouchableOpacity
                        style={styles.privateToggle}
                        onPress={() => setNewEntry({ ...newEntry, isPrivate: !newEntry.isPrivate })}
                    >
                        <Text style={styles.privateToggleText}>
                            {newEntry.isPrivate ? '🔒 Private' : '🌐 Public'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={handleSaveEntry}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Entry</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={journals}
                renderItem={renderJournalEntry}
                keyExtractor={(item) => item.$id}
                style={styles.journalList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No journal entries yet</Text>
                        <Text style={styles.emptySubtext}>Start writing to see your entries here</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    newEntryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    newEntryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    newEntryForm: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fafafa',
    },
    contentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fafafa',
        height: 120,
        textAlignVertical: 'top',
    },
    moodContainer: {
        marginBottom: 15,
    },
    moodLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    moodButton: {
        padding: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    selectedMoodButton: {
        backgroundColor: '#007AFF',
    },
    moodButtonText: {
        fontSize: 20,
    },
    tagsInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fafafa',
    },
    privateToggle: {
        alignItems: 'center',
        padding: 10,
        marginBottom: 15,
    },
    privateToggleText: {
        fontSize: 16,
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    journalList: {
        flex: 1,
        padding: 20,
    },
    journalCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    journalTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    journalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    moodEmoji: {
        fontSize: 20,
        marginLeft: 10,
    },
    journalDate: {
        fontSize: 12,
        color: '#666',
    },
    journalContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    tag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#666',
    },
    journalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    editButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelEditButton: {
        backgroundColor: '#FF3B30',
        flex: 0.45,
        marginRight: 10,
    },
    cancelEditButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
});

export default Journal;
