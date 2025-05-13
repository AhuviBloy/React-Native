import { useState, useRef, useEffect } from "react"
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MaterialIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function EditNoteScreen({ route, navigation }) {
  const { note } = route.params
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content || "")
  const [important, setImportant] = useState(note.important || false)
  const [saving, setSaving] = useState(false)
  const insets = useSafeAreaInsets()

  const titleInputRef = useRef(null)
  const contentInputRef = useRef(null)

  const slideAnim = useRef(new Animated.Value(50)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const updateNote = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required")
      return
    }

    setSaving(true)

    const updatedNote = {
      ...note,
      title: title.trim(),
      content: content.trim(),
      important,
      updatedAt: new Date().toISOString(),
    }

    try {
      const json = await AsyncStorage.getItem("@notes")
      const notes = json != null ? JSON.parse(json) : []

      const updatedNotes = notes.map((n) => (n.id === note.id ? updatedNote : n))

      await AsyncStorage.setItem("@notes", JSON.stringify(updatedNotes))
      setSaving(false)
      navigation.goBack()
    } catch (e) {
      Alert.alert("Error", "Failed to update note")
      setSaving(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingBottom: insets.bottom }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              placeholder="Note title"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              returnKeyType="next"
              onSubmitEditing={() => contentInputRef.current?.focus()}
            />

            <TextInput
              ref={contentInputRef}
              style={styles.contentInput}
              placeholder="Note content (optional)"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <MaterialIcons name="priority-high" size={20} color="#d23f77" />
                <Text style={styles.switchText}>Mark as important</Text>
              </View>
              <Switch
                value={important}
                onValueChange={setImportant}
                trackColor={{ false: "#e0e0e0", true: "#f8d7e8" }}
                thumbColor={important ? "#d23f77" : "#f4f3f4"}
                ios_backgroundColor="#e0e0e0"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={updateNote} disabled={saving || !title.trim()}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Update Note</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "500",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 16,
    color: "#333",
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 16,
    maxHeight: 200,
    minHeight: 100,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#d23f77",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
