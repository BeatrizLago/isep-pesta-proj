import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
  },
  bottomBarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    padding: 10,
    width: "100%",
    bottom: 0,
    zIndex: 1,
  },
  bottomBarItem: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    zIndex: 2,
    backgroundColor: "#0077b6",
    borderRadius: 50,
    width: "45%",
  },

  bottomBarItem1: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    zIndex: 2,
    backgroundColor: "#0077b6",
    borderRadius: 50,
    width: "45%",
  },
  filterText: {
    marginLeft: 5,
    fontSize: 16,
    color: "white",
  },
  clearFilterText: {
    marginLeft: 5,
    fontSize: 16,
    color: "white",
  },
  filterButton: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  locationList: {
    paddingBottom: 70,
  },
});
