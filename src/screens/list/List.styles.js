import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  topBarItem: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    zIndex: 1,
    backgroundColor: "#6c6c67",
    borderRadius: 50,
    width: "45%",
  },
  topBarItem1: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    zIndex: 1,
    backgroundColor: "#6c6c67",
    borderRadius: 50,
    width: "45%",
  },
  filterText: {
    fontSize: 16,
    color: "white",
  },
  clearFilterText: {
    fontSize: 16,
    color: "white",
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  mapViewButton: {
    padding: 10,
  },
  filterButton: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  mapContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    top: 120, // Adjust to place map below the top bar
    backgroundColor: "#fff",
  },
});
