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
  });

