import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 24, alignSelf: "center", width: "100%" },
  header: { marginBottom: 32 },
  headerTop: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 18 },
  bold: { fontWeight: "700" },
  subtitle: { fontSize: 13, marginTop: 4 },
  notificationBtn: { position: "relative", padding: 8 },
  notificationDot: { position: "absolute", top: 6, right: 6, width: 10, height: 10, borderRadius: 999 },
  mainActionBtn: { borderRadius: 20, padding: 20, flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center", marginBottom: 32 },
  mainActionText: { fontSize: 16, fontWeight: "700" },
  card: { borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 14 },
  circleContainer: { alignItems: "center", justifyContent: "center", marginBottom: 12 },
  circleText: { position: "absolute", alignItems: "center" },
  caloriesConsumed: { fontSize: 28, fontWeight: "800" },
  caloriesGoal: { fontSize: 13, color: "#6B7280" },
  remaining: { textAlign: "center", fontSize: 13 },
  macroBlock: { marginBottom: 16 },
  macroHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  macroName: { fontWeight: "600" },
  macroValues: { fontSize: 12, color: "#6B7280" },
  progressBarBg: { width: "100%", height: 12, borderRadius: 999, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 999 },
  activityBox: { flexDirection: "row", gap: 12, borderRadius: 14, padding: 16, borderLeftWidth: 4, alignItems: "center" },
  activityIcon: { width: 48, height: 48, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  activityName: { fontWeight: "700" },
  activityDuration: { fontSize: 12 },
});

export default styles;