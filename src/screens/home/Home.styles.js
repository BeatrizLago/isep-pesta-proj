import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  mapContainerScreen: {
    flex: 1,
    marginBottom: 70,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    justifyContent: "space-between", // Distribute space between buttons
    marginTop: 10, // Add some top margin
    marginBottom: 10, // Add some bottom margin
  },
  button: {
    width: 150, // Fixed width for buttons
    height: 60, // Set the height of the buttons
    backgroundColor: "#0077b6", // Button background color (blue)
    borderRadius: 10, // Rounded corners
    paddingVertical: 5, // Smaller vertical padding
    paddingHorizontal: 10, // Smaller horizontal padding
    marginHorizontal: 10, // Space between the buttons
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
  },
  buttonText: {
    color: "white", // Text color
    fontSize: 14, // Adjusted text size for smaller buttons
    fontWeight: "bold", // Text weight
  },
  icon: {
    color: "grey", // Icon color
  },
});
