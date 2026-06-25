// App.js - Kode Lengkap Aplikasi NoteKeeper

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@notes_data';

export default function App() {
  // --- STATE ---
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');

  // State untuk modal edit
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');

  // State untuk search & sortir (Level 2 & 3)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('latest'); // latest, oldest, alphabetical, completed

  // --- LOAD DATA DARI STORAGE (READ) ---
  const loadNotes = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData !== null) {
        setNotes(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Gagal memuat catatan:', error);
      Alert.alert('Error', 'Gagal memuat catatan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // --- SIMPAN KE STORAGE (CREATE, UPDATE, DELETE) ---
  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Gagal menyimpan catatan:', error);
      Alert.alert('Error', 'Gagal menyimpan catatan. Silakan coba lagi.');
    }
  };

  // --- CREATE: Tambah Catatan Baru ---
  const addNote = () => {
    const trimmedText = newNoteText.trim();
    if (trimmedText === '') {
      Alert.alert('Peringatan', 'Catatan tidak boleh kosong!');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setNewNoteText('');
  };

  // --- DELETE: Hapus Catatan (dengan konfirmasi) ---
  const deleteNote = (id) => {
    Alert.alert(
      'Hapus Catatan',
      'Apakah Anda yakin ingin menghapus catatan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            const updatedNotes = notes.filter((note) => note.id !== id);
            setNotes(updatedNotes);
            saveNotes(updatedNotes);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // --- UPDATE: Toggle Status Selesai ---
  const toggleComplete = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  // --- UPDATE: Edit Teks Catatan ---
  const openEditModal = (note) => {
    setEditingNote(note);
    setEditText(note.text);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText === '') {
      Alert.alert('Peringatan', 'Catatan tidak boleh kosong!');
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id ? { ...note, text: trimmedText } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setEditModalVisible(false);
    setEditingNote(null);
    setEditText('');
  };

  // --- SEARCH / FILTER (Level 2) ---
  const getFilteredNotes = () => {
    let filtered = notes;

    // Filter berdasarkan teks pencarian
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((note) =>
        note.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting (Level 3 Bonus)
    if (sortOption === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === 'alphabetical') {
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortOption === 'completed') {
      filtered.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    }

    return filtered;
  };

  const filteredNotes = getFilteredNotes();

  // --- RENDER ITEM FLATLIST ---
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.noteItem, item.completed && styles.noteItemCompleted]}
      onPress={() => toggleComplete(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.noteContent}>
        <Text style={[styles.noteText, item.completed && styles.noteTextCompleted]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // --- UI ---
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text>Memuat catatan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Catatan Saya</Text>
        <Text style={styles.headerSubtitle}>
          {notes.length} catatan • {notes.filter((n) => n.completed).length} selesai
        </Text>
      </View>

      {/* Search Bar (Level 2) */}
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Cari catatan..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="always"
      />

      {/* Sorting Options (Level 3 Bonus) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortContainer}>
        {[
          { key: 'latest', label: '🕐 Terbaru' },
          { key: 'oldest', label: '🕐 Terlama' },
          { key: 'alphabetical', label: '🔤 Abjad' },
          { key: 'completed', label: '✅ Status' },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortButton, sortOption === opt.key && styles.sortButtonActive]}
            onPress={() => setSortOption(opt.key)}
          >
            <Text style={[styles.sortText, sortOption === opt.key && styles.sortTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input & Tombol Tambah */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tulis catatan baru..."
          placeholderTextColor="#999"
          value={newNoteText}
          onChangeText={setNewNoteText}
          onSubmitEditing={addNote}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>
              {searchQuery.trim() !== '' ? 'Catatan tidak ditemukan' : 'Belum ada catatan'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery.trim() !== ''
                ? 'Coba kata kunci lain'
                : 'Tambahkan catatan pertamamu!'}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Edit */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Edit Catatan</Text>
            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
              placeholder="Tulis catatan..."
              placeholderTextColor="#999"
              multiline
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveEdit}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },

  // Search
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },

  // Sorting
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6,
    maxHeight: 48,
  },
  sortButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    minHeight: 34,
  },
  sortButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  sortTextActive: {
    color: '#fff',
  },

  // Input Create
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  addButton: {
    backgroundColor: '#6200ee',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },

  // Note Item
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  noteItemCompleted: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e8e8e8',
  },
  noteContent: {
    flex: 1,
    marginRight: 8,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  noteTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  timestamp: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 18,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },

  // Modal Edit
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonSave: {
    backgroundColor: '#6200ee',
  },
  modalButtonText: {
    fontSize: 15,
    color: '#666',
  },
  modalButtonTextSave: {
    color: '#fff',
  },
});