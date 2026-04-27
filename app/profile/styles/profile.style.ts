import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerProfile: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },
  section: { marginBottom: 16 },
  label: { marginBottom: 8, fontWeight: "700", fontSize: 14 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  checkboxContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  checkboxRow: { flexDirection: "row", alignItems: "center", width: "45%", marginBottom: 8 },
  checkbox: { 
    width: 24, 
    height: 24, 
    borderRadius: 6, 
    borderWidth: 1, 
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  actionBtn: { padding: 16, borderRadius: 12, alignItems: "center" }
});

export default styles