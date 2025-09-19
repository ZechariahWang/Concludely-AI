import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    FlatList,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfileService } from '../../services/api/userProfile';
import { Button, Card, Text, Input, Icon, THEMES, SPACING, RADIUS } from '../../components/ui';

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

    const getMoodIcon = (mood) => {
        const moodIcons = {
            happy: 'smile',
            sad: 'frown',
            angry: 'angry',
            excited: 'zap',
            calm: 'moon',
            anxious: 'alert-triangle',
            neutral: 'minus',
        };
        return moodIcons[mood] || 'minus';
    };

    const getMoodColor = (mood, theme) => {
        const moodColors = {
            happy: '#22C55E',
            sad: '#3B82F6',
            angry: '#EF4444',
            excited: '#F59E0B',
            calm: '#8B5CF6',
            anxious: '#F97316',
            neutral: theme.mutedForeground,
        };
        return moodColors[mood] || theme.mutedForeground;
    };

    const renderJournalEntry = ({ item }) => {
        const theme = THEMES.light;

        return (
            <Card variant="elevated" style={styles.journalCard}>
                <Card.Header>
                    <View style={styles.journalHeader}>
                        <View style={styles.journalTitleContainer}>
                            <Text variant="h4" style={styles.journalTitle}>{item.title}</Text>
                            <Icon
                                name={getMoodIcon(item.mood)}
                                size={20}
                                color={getMoodColor(item.mood, theme)}
                            />
                        </View>
                        <Text variant="small" style={styles.journalDate}>
                            {formatDate(item.createdAt)}
                        </Text>
                    </View>
                </Card.Header>

                <Card.Content>
                    <Text variant="body" style={styles.journalContent} numberOfLines={3}>
                        {item.content}
                    </Text>

                    {item.tags && item.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {item.tags.map((tag, index) => (
                                <View key={index} style={[styles.tag, { backgroundColor: theme.secondary }]}>
                                    <Text variant="small" style={[styles.tagText, { color: theme.secondaryForeground }]}>
                                        #{tag}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </Card.Content>

                <Card.Footer>
                    <View style={styles.journalActions}>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleEditEntry(item)}
                            style={styles.editActionButton}
                        >
                            <View style={styles.buttonContent}>
                                <Icon name="edit-2" size={14} color={theme.foreground} style={styles.actionIcon} />
                                <Text variant="small" style={{ color: theme.foreground }}>Edit</Text>
                            </View>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onPress={() => handleDeleteEntry(item.$id)}
                            style={styles.deleteActionButton}
                        >
                            <View style={styles.buttonContent}>
                                <Icon name="trash-2" size={14} color={theme.destructive} style={styles.actionIcon} />
                                <Text variant="small" style={{ color: theme.destructive }}>Delete</Text>
                            </View>
                        </Button>
                    </View>
                </Card.Footer>
            </Card>
        );
    };

    const theme = THEMES.light;

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.loadingContainer}>
                    <Icon name="loader" size={48} color={theme.primary} />
                    <Text variant="body" style={styles.loadingText}>Loading journals...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text variant="display" style={styles.title}>My Journal</Text>
                <Button
                    variant={showNewEntry ? "outline" : "default"}
                    size="sm"
                    onPress={() => setShowNewEntry(!showNewEntry)}
                >
                    <Icon
                        name={showNewEntry ? "x" : "plus"}
                        size={16}
                        color={showNewEntry ? theme.foreground : theme.primaryForeground}
                        style={styles.buttonIcon}
                    />
                    {showNewEntry ? 'Cancel' : 'New Entry'}
                </Button>
            </View>

            {/* Edit Entry Form */}
            {editingEntry && (
                <ScrollView style={styles.formScrollView}>
                    <Card variant="elevated" style={styles.formCard}>
                        <Card.Header>
                            <Text variant="h3">Edit Journal Entry</Text>
                        </Card.Header>
                        <Card.Content style={styles.formContent}>
                            <Input
                                label="Title"
                                placeholder="Entry Title"
                                value={editEntry.title}
                                onChangeText={(text) => setEditEntry({ ...editEntry, title: text })}
                                style={styles.formInput}
                            />

                            <Input
                                label="Content"
                                placeholder="Write your thoughts..."
                                value={editEntry.content}
                                onChangeText={(text) => setEditEntry({ ...editEntry, content: text })}
                                multiline
                                numberOfLines={6}
                                style={[styles.formInput, styles.contentFormInput]}
                                inputStyle={styles.contentInputStyle}
                            />

                            <View style={styles.moodContainer}>
                                <Text variant="label" style={styles.moodLabel}>Mood:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
                                    {['happy', 'sad', 'angry', 'excited', 'calm', 'anxious', 'neutral'].map((mood) => (
                                        <Button
                                            key={mood}
                                            variant={editEntry.mood === mood ? "default" : "outline"}
                                            size="sm"
                                            onPress={() => setEditEntry({ ...editEntry, mood })}
                                            style={styles.moodButton}
                                        >
                                            <Icon
                                                name={getMoodIcon(mood)}
                                                size={16}
                                                color={editEntry.mood === mood ? theme.primaryForeground : getMoodColor(mood, theme)}
                                            />
                                        </Button>
                                    ))}
                                </ScrollView>
                            </View>

                            <Input
                                label="Tags"
                                placeholder="Tags (comma separated)"
                                value={editEntry.tags}
                                onChangeText={(text) => setEditEntry({ ...editEntry, tags: text })}
                                style={styles.formInput}
                            />

                            <Button
                                variant="ghost"
                                onPress={() => setEditEntry({ ...editEntry, isPrivate: !editEntry.isPrivate })}
                                style={styles.privateToggle}
                            >
                                <Icon
                                    name={editEntry.isPrivate ? "lock" : "globe"}
                                    size={16}
                                    color={theme.foreground}
                                    style={styles.toggleIcon}
                                />
                                {editEntry.isPrivate ? 'Private' : 'Public'}
                            </Button>
                        </Card.Content>
                        <Card.Footer>
                            <View style={styles.formActions}>
                                <Button
                                    variant="outline"
                                    onPress={handleCancelEdit}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onPress={handleUpdateEntry}
                                    disabled={saving}
                                    loading={saving}
                                    style={styles.updateButton}
                                >
                                    Update Entry
                                </Button>
                            </View>
                        </Card.Footer>
                    </Card>
                </ScrollView>
            )}

            {/* New Entry Form */}
            {showNewEntry && !editingEntry && (
                <ScrollView style={styles.formScrollView}>
                    <Card variant="elevated" style={styles.formCard}>
                        <Card.Header>
                            <Text variant="h3">New Journal Entry</Text>
                        </Card.Header>
                        <Card.Content style={styles.formContent}>
                            <Input
                                label="Title"
                                placeholder="Entry Title"
                                value={newEntry.title}
                                onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
                                style={styles.formInput}
                            />

                            <Input
                                label="Content"
                                placeholder="Write your thoughts..."
                                value={newEntry.content}
                                onChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
                                multiline
                                numberOfLines={6}
                                style={[styles.formInput, styles.contentFormInput]}
                                inputStyle={styles.contentInputStyle}
                            />

                            <View style={styles.moodContainer}>
                                <Text variant="label" style={styles.moodLabel}>Mood:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
                                    {['happy', 'sad', 'angry', 'excited', 'calm', 'anxious', 'neutral'].map((mood) => (
                                        <Button
                                            key={mood}
                                            variant={newEntry.mood === mood ? "default" : "outline"}
                                            size="sm"
                                            onPress={() => setNewEntry({ ...newEntry, mood })}
                                            style={styles.moodButton}
                                        >
                                            <Icon
                                                name={getMoodIcon(mood)}
                                                size={16}
                                                color={newEntry.mood === mood ? theme.primaryForeground : getMoodColor(mood, theme)}
                                            />
                                        </Button>
                                    ))}
                                </ScrollView>
                            </View>

                            <Input
                                label="Tags"
                                placeholder="Tags (comma separated)"
                                value={newEntry.tags}
                                onChangeText={(text) => setNewEntry({ ...newEntry, tags: text })}
                                style={styles.formInput}
                            />

                            <Button
                                variant="ghost"
                                onPress={() => setNewEntry({ ...newEntry, isPrivate: !newEntry.isPrivate })}
                                style={styles.privateToggle}
                            >
                                <Icon
                                    name={newEntry.isPrivate ? "lock" : "globe"}
                                    size={16}
                                    color={theme.foreground}
                                    style={styles.toggleIcon}
                                />
                                {newEntry.isPrivate ? 'Private' : 'Public'}
                            </Button>
                        </Card.Content>
                        <Card.Footer>
                            <Button
                                onPress={handleSaveEntry}
                                disabled={saving}
                                loading={saving}
                                style={styles.saveButton}
                            >
                                Save Entry
                            </Button>
                        </Card.Footer>
                    </Card>
                </ScrollView>
            )}

            {/* Journal Entries List */}
            <FlatList
                data={journals}
                renderItem={renderJournalEntry}
                keyExtractor={(item) => item.$id}
                style={styles.journalList}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Card variant="outlined" style={styles.emptyCard}>
                        <Card.Content style={styles.emptyContainer}>
                            <Icon name="book-open" size={48} color={theme.mutedForeground} style={styles.emptyIcon} />
                            <Text variant="h4" style={styles.emptyText}>No journal entries yet</Text>
                            <Text variant="muted" style={styles.emptySubtext}>
                                Start writing to see your entries here
                            </Text>
                            <Button
                                variant="outline"
                                onPress={() => setShowNewEntry(true)}
                                style={styles.emptyButton}
                            >
                                <Icon name="plus" size={16} color={theme.foreground} />
                                Write First Entry
                            </Button>
                        </Card.Content>
                    </Card>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING[4],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING[6],
        paddingVertical: SPACING[4],
        borderBottomWidth: 1,
        borderBottomColor: THEMES.light.border,
        backgroundColor: THEMES.light.background,
        minHeight: 60,
    },
    title: {
        flex: 1,
    },
    buttonIcon: {
        marginRight: SPACING[2],
    },
    formScrollView: {
        maxHeight: '80%',
        marginHorizontal: SPACING[4],
        marginBottom: SPACING[4],
    },
    formCard: {
        marginBottom: SPACING[4],
    },
    formContent: {
        paddingVertical: SPACING[2],
    },
    formInput: {
        marginBottom: SPACING[4],
        width: '100%',
    },
    contentFormInput: {
        minHeight: 120,
    },
    contentInputStyle: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: SPACING[3],
    },
    moodContainer: {
        marginBottom: SPACING[4],
    },
    moodLabel: {
        marginBottom: SPACING[2],
    },
    moodScroll: {
        marginTop: SPACING[2],
    },
    moodButton: {
        marginRight: SPACING[2],
        minWidth: 44,
    },
    privateToggle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    toggleIcon: {
        marginRight: SPACING[2],
    },
    formActions: {
        flexDirection: 'row',
        gap: SPACING[3],
        paddingTop: SPACING[2],
    },
    cancelButton: {
        flex: 1,
        minHeight: 44,
    },
    updateButton: {
        flex: 2,
        minHeight: 44,
    },
    saveButton: {
        width: '100%',
        minHeight: 44,
    },
    journalList: {
        flex: 1,
        paddingHorizontal: SPACING[6],
    },
    listContent: {
        paddingVertical: SPACING[4],
    },
    journalCard: {
        marginBottom: SPACING[4],
    },
    journalHeader: {
        flexDirection: 'column',
        gap: SPACING[2],
    },
    journalTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    journalTitle: {
        flex: 1,
        marginRight: SPACING[2],
    },
    journalDate: {
        alignSelf: 'flex-start',
    },
    journalContent: {
        marginBottom: SPACING[3],
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING[1],
        marginBottom: SPACING[3],
    },
    tag: {
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
        borderRadius: RADIUS.DEFAULT,
    },
    journalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: SPACING[3],
    },
    editActionButton: {
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        minHeight: 36,
        minWidth: 70,
    },
    deleteActionButton: {
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        minHeight: 36,
        minWidth: 80,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: {
        marginRight: SPACING[1.5],
    },
    emptyCard: {
        marginVertical: SPACING[8],
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: SPACING[8],
    },
    emptyIcon: {
        marginBottom: SPACING[4],
    },
    emptyText: {
        marginBottom: SPACING[2],
    },
    emptySubtext: {
        textAlign: 'center',
        marginBottom: SPACING[6],
        maxWidth: 280,
    },
    emptyButton: {
        minWidth: 160,
    },
});

export default Journal;
