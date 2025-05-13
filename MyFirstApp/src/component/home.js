import { useEffect, useState, useRef } from "react"
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
  ImageBackground,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [completedTasks, setCompletedTasks] = useState({})
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current

  const loadNotes = async () => {
    try {
      setLoading(true)
      const json = await AsyncStorage.getItem("@notes")
      const completedJson = await AsyncStorage.getItem("@completedTasks")

      setNotes(json != null ? JSON.parse(json) : [])
      setCompletedTasks(completedJson != null ? JSON.parse(completedJson) : {})

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()

      setLoading(false)
    } catch (e) {
      Alert.alert("Error", "Failed to load notes")
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadNotes)
    return unsubscribe
  }, [navigation])





const deleteNote = async (id) => {
  const updated = notes.filter((note) => note.id !== id);
  setNotes(updated);
  await AsyncStorage.setItem('@notes', JSON.stringify(updated));
  Alert.alert('Note deleted');
};

  const toggleCompleted = async (id) => {
    try {
      const updatedCompleted = {
        ...completedTasks,
        [id]: !completedTasks[id],
      }
      setCompletedTasks(updatedCompleted)
      await AsyncStorage.setItem("@completedTasks", JSON.stringify(updatedCompleted))
    } catch (error) {
      Alert.alert("Error", "Failed to update task status")
    }
  }

  const renderItem = ({ item }) => {
    const isCompleted = completedTasks[item.id] || false

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[styles.noteItem, item.important && styles.importantNote, isCompleted && styles.completedNote]}
          onPress={() => toggleCompleted(item.id)}
          onLongPress={() => navigation.navigate("ViewNote", { note: item, isCompleted })}
        >
          <View style={styles.noteContent}>
            <Text style={[styles.noteTitle, isCompleted && styles.completedText]} numberOfLines={1}>
              {item.title}
            </Text>

            <View style={styles.noteActions}>
              {item.important && <MaterialIcons name="priority-high" size={18} color="#d23f77" style={styles.icon} />}

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation()
                  navigation.navigate("EditNote", { note: item })
                }}
                style={styles.actionButton}
              >
                <Feather name="edit-2" size={18} color="#8e8e8e" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation()
                  deleteNote(item.id)
                }}
                style={styles.actionButton}
              >
                <AntDesign name="delete" size={18} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
       </Animated.View> 
    )
  }

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="clipboard" size={64} color="#d8a9c1" />
      <Text style={styles.emptyText}>No notes yet</Text>
      <Text style={styles.emptySubText}>Tap the + button to create a note</Text>
    </View>
  )

  return (
    <ImageBackground source={require("../../assets/bg1.jpg")} style={styles.background} imageStyle={{ opacity: 0.3 }}>
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d23f77" />
          </View>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={EmptyListComponent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddNote")}>
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 100,
    flexGrow: 1,
  },
  noteItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#f8d7e8",
  },
  importantNote: {
    borderLeftColor: "#d23f77",
  },
  completedNote: {
    opacity: 0.7,
    backgroundColor: "#f9f9f9",
  },
  noteContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  noteActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
  },
  icon: {
    marginRight: 8,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#d23f77",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d8a9c1",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#b0b0b0",
    marginTop: 8,
  },
})
