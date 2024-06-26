import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: { 
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textContainer: {
      flexDirection: 'column',  
      flex: 1,
      marginRight: 10,
    },
    locationText: {
        fontWeight: 'bold'
    },
    addressText: {

    },
    button: {
        justifyContent: 'flex-end',
        color: '#2072b2',
        borderRadius: 20,
    },
    buttonContainer: {
        justifyContent: 'center'
      },
      buttonText: {
        color: '#2072b2',
        fontWeight: 'bold',
        fontSize: 16,
      },
   
  });