import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    // This will arrange the buttons in a row with space around them
    flexDirection: 'row',
    justifyContent: 'space-around', // Distributes items evenly
    alignItems: 'center', // Centers items vertically
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 2,
    width: '100%',
  },
  // Reusable button style for all three buttons
  button: {
    backgroundColor: "#0077b6", // Matches the desired blue background
    borderRadius: 50, // Matches the desired rounded corners
    paddingVertical: 15, // Provides good vertical spacing
    paddingHorizontal: 20, // Provides good horizontal spacing
    minWidth: '30%', // Gives each button a minimum width, adjust as needed
  },
  // Reusable text style for all button titles
  buttonText: {
    fontSize: 16,
    color: "white", // White text color for visibility
    fontWeight: 'bold', // Bold text for emphasis
  },
  // Reusable icon style for all buttons
  icon: {
    marginRight: 8, // Space between icon and text
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
  locationList: {
    paddingBottom: 70,
  },
  // Existing SearchBar and Overlay styles (unchanged, but included for completeness)
  searchBarWrapper: {
    zIndex: 3,
    backgroundColor: '#fff',
    paddingBottom: 5,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInputContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    height: 40,
  },
  suggestionsList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    maxHeight: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  mapContainerScreen: {
    flex: 1,
  },
});