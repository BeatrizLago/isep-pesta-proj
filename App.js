import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import Details from './app/screens/Details';
import Signup from './app/screens/Signup';
import { FIREBASE_AUTH } from './Firebase.config';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

function InsideLayout(){
  return(
    <InsideStack.Navigator>
      <InsideStack.Screen name='Home' component={Home}/>
      <InsideStack.Screen name='Details' component={Details}/>
    </InsideStack.Navigator>
  )
}

function LoginLayout(){
  return(
    <LoginStack.Navigator>
      <LoginStack.Screen name='Login' component={Login}/>
      <LoginStack.Screen name='Signup' component={Signup}/>
    </LoginStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          // User data found in AsyncStorage, parse and set user state
          setUser(JSON.parse(userData));
          console.log("test:",userData);
        }
      } catch (error) {
        console.error('Error retrieving user data from AsyncStorage:', error.message);
      }
    };

    // Check for user data on app start
    checkUser();

    // Listen for Firebase authentication changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
      console.log("user:", authUser);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{headerShown: false}}/>
        ) : (
          <Stack.Screen name='LoginHome' component={LoginLayout} options={{headerShown: false}}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
