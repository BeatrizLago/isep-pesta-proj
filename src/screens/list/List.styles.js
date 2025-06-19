import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // --- Start Search Bar Styles ---
  searchBarWrapper: {
    // This wrapper is important for positioning and background if needed
    zIndex: 3, // Ensure it's above other elements if applicable
    backgroundColor: '#fff', // White background to match Home screen's search bar area
    paddingBottom: 5, // Small padding below the search bar
  },
  searchBarContainer: {
    backgroundColor: 'transparent', // Make the overall container transparent
    borderBottomColor: 'transparent', // Remove bottom border
    borderTopColor: 'transparent', // Remove top border
  },
  searchBarInputContainer: {
    backgroundColor: '#e0e0e0', // Light grey background for the input field itself
    borderRadius: 25, // Rounded corners for the input field
    height: 40, // Consistent height
  },
  // --- End Search Bar Styles ---

  bottomBarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    padding: 10,
    width: "100%",
    bottom: 0,
  },
  bottomBarItem: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    zIndex: 1,
    backgroundColor: "#6c6c67",
    borderRadius: 50,
    width: "45%",
  },
  bottomBarItem1: {
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