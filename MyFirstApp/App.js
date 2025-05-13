import { StatusBar } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import "react-native-gesture-handler"
import HomeScreen from './src/component/home'; 
import AddNoteScreen from './src/component/AddNote';
import EditNoteScreen from './src/component/EditNote';


const Stack = createStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f8d7e8",
              elevation: 0, // for Android
              shadowOpacity: 0, // for iOS
            },
            headerTintColor: "#d23f77",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            cardStyle: { backgroundColor: "#fff" },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "My Notes" }} />
          <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: "Add New Note" }} />
          <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: "Edit Note" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
