import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Text, TextInput, IconButton, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '@/src/context/ThemeContext';
import { EMOJI_LIST } from '@/src/utils/emojiData';

interface EmojiPickerModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSelect: (emoji: string) => void;
}

const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({ visible, onDismiss, onSelect }) => {
    const { colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmojis, setFilteredEmojis] = useState(EMOJI_LIST);

    useEffect(() => {
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = EMOJI_LIST.filter(item =>
                item.keywords.includes(lowerQuery) || item.char.includes(lowerQuery)
            );
            setFilteredEmojis(filtered);
        } else {
            setFilteredEmojis(EMOJI_LIST);
        }
    }, [searchQuery]);

    const renderItem = ({ item }: { item: typeof EMOJI_LIST[0] }) => (
        <TouchableOpacity
            style={[styles.emojiItem, { backgroundColor: colors.surface }]}
            onPress={() => onSelect(item.char)}
        >
            <Text style={styles.emojiText}>{item.char}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onDismiss}>
            <View style={styles.modalOverlay}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Pick an Icon</Text>
                        <IconButton icon="close" onPress={onDismiss} />
                    </View>

                    <TextInput
                        placeholder="Search icons (e.g. shoe, watch)..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        mode="outlined"
                        style={styles.searchBar}
                        left={<TextInput.Icon icon="magnify" />}
                    />

                    <FlatList
                        data={filteredEmojis}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.char}
                        numColumns={6}
                        contentContainerStyle={styles.grid}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        borderRadius: 12,
        height: '70%',
        padding: 20,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchBar: {
        marginBottom: 15,
        backgroundColor: 'transparent',
    },
    grid: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-around', // Distribute evenly
        marginBottom: 10,
    },
    emojiItem: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        elevation: 1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    emojiText: {
        fontSize: 24,
    }
});

export default EmojiPickerModal;
