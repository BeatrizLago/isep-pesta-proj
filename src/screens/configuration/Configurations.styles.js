import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: "100%"
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
      },
      buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      logoutButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 5,
      },
      logoutButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
      },
      switchContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
      },
      switchLabel: {
        fontSize: 20,
        marginRight: 10,
        fontWeight: "bold",
      },
      separator: {
        width: '100%',
        height: 2, 
        backgroundColor: 'black',
        marginVertical: 10, 
      },
      inputStyle: {
        borderWidth: 1,
        borderColor: '#ccc',  // Light border color for subtle appearance
        backgroundColor: '#fff',  // White background to make input stand out
        padding: 15,  // Increased padding for better interaction
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 10,  // Rounded corners for modern UI
        fontSize: 16,  // Consistent font size
        width: '100%',
        shadowColor: '#000',  // Subtle shadow for better input visibility
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,  // Elevation for Android shadow
      },
      speakButton: {
          backgroundColor: '#4a90e2',  // Blue with slight gradient for modern look
          paddingVertical: 15,
          paddingHorizontal: 50,  // Wide button for better touch area
          borderRadius: 10,  // Slightly rounded corners
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 3,
          marginBottom: 20,
      },
      speakButtonText: {
          color: 'white',
          fontSize: 18,  
          fontWeight: 'bold', 
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
          marginLeft: 10,
      },
      pickerContainer: {
        width: '100%',
        marginVertical: 15,
      },
      pickerLabel: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
      },
      picker: {
          height: 50,
          width: '100%',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#ccc',
      },
  });

