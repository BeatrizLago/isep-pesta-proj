import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Details from "./screens/Details";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FIREBASE_AUTH } from "../app/config/Firebase.config";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const InsideStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Home" component={Home} />
    </InsideStack.Navigator>
  );
}

function TabLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inside" component={InsideLayout}  options={{headerShown : false}}/>
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function LoginLayout() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen name="Login" component={Login} />
      <LoginStack.Screen name="Signup" component={Signup} />
    </LoginStack.Navigator>
  );
}

const Navigation = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="TabLayout"
            component={TabLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="LoginHome"
            component={LoginLayout}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
