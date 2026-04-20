import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Bot, Home, User } from "lucide-react-native"; // version RN de lucide
// TODO: Implement those files.
// Is this file even used?
import Coach from "../screens/Coach";
import Home2 from "../screens/Home";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#2C3E50",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 2,
          borderTopColor: "#E5E7EB",
          height: 70,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Home color={color} size={size} />;
            case "Coach":
              return <Bot color={color} size={size} />;
            case "Profile":
              return <User color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={Home2} />
      <Tab.Screen name="Coach" component={Coach} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}