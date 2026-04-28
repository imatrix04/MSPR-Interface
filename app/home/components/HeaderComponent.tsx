import { useThemeColor } from "@/hooks/use-theme-color";
import { Bell } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import styles from "../styles/home.style";

interface HeaderProps {
    name: string
}

const HeaderComponent = ({name}: HeaderProps) => {

    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'mutedForeground');
    const destructiveColor = useThemeColor({}, 'destructive');

    return <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text 
              style={[styles.title, { color: textColor }]}
              accessibilityRole="header"
            > 
              Bonjour <Text style={styles.bold}>{name || "Bob"} 👋</Text> !{"\n"}
              Prêt(e) pour tes objectifs ?
            </Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}> 
              Tes données sont à jour.
            </Text>
          </View>
          <Pressable 
            style={styles.notificationBtn}
            accessibilityRole="button"
            accessibilityLabel="Voir les notifications"
          >
            <Bell size={24} color={textColor} />
            <View style={[styles.notificationDot, { backgroundColor: destructiveColor }]} />
          </Pressable>
        </View>
      </View>
}

export default HeaderComponent;