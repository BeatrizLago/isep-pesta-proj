import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './app/screens/Login';
import Home from './app/screens/Home'; // Import the modified Home screen
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './Firebase.config';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  const getdata = async () => {
    try {
      return await AsyncStorage.getItem("user");
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} /> // Use the Home screen
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
