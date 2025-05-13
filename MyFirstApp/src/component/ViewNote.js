import { useRef, useEffect } from "react"
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
  Share,
  Platform,
} from "react-native"
import { MaterialIcons, Feather } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function ViewNoteScreen({ route, navigation }) {
  const { note, isCompleted } = route.params
  const insets = useSafeAreaInsets()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const shareNote = async () => {
    try {
      await Share.share({
        message: `${note.title}\n\n${note.content || ""}`,
        title: note.title,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.noteContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.noteHeader}>
            <Text style={[styles.noteTitle, isCompleted && styles.completedText]}>{note.title}</Text>

            {note.important && (
              <View style={styles.importantBadge}>
                <MaterialIcons name="priority-high" size={16} color="#fff" />
                <Text style={styles.importantText}>Important</Text>
              </View>
            )}
          </View>

          {note.content ? (
            <Text style={[styles.noteContent, isCompleted && styles.completedText]}>{note.content}</Text>
          ) : (
            <Text style={styles.emptyContent}>No additional content</Text>
          )}

          <View style={styles.metaContainer}>
            {note.createdAt && <Text style={styles.dateText}>Created: {formatDate(note.createdAt)}</Text>}

            {note.updatedAt && <Text style={styles.dateText}>Updated: {formatDate(note.updatedAt)}</Text>}

            {isCompleted && (
              <View style={styles.completedBadge}>
                <Feather name="check-circle" size={14} color="#fff" />
                <Text style={styles.completedBadgeText}>Completed</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("EditNote", { note })}>
          <Feather name="edit-2" size={20} color="#d23f77" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={shareNote}>
          <Feather name="share-2" size={20} color="#d23f77" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Linking.openURL(`sms:&body=${encodeURIComponent(note.title)}`)}
          >
            <Feather name="message-circle" size={20} color="#d23f77" />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  noteContainer: {
    padding: 20,
  },
  noteHeader: {
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  importantBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d23f77",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  importantText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 20,
  },
  emptyContent: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 20,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  metaContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4caf50",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  completedBadgeText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  actionText: {
    color: "#d23f77",
    fontSize: 12,
    marginTop: 4,
  },
})
