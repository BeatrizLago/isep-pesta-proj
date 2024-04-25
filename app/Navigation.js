import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import Configurations from "./screens/Configurations";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FIREBASE_AUTH } from "../app/config/Firebase.config";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const InsideMap = createNativeStackNavigator();
const InsideProfile = createNativeStackNavigator();
const InsideConfig = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

function MapLayout() {
  return (
    <InsideMap.Navigator>
      <InsideMap.Screen name="Home" component={Home} />
    </InsideMap.Navigator>
  );
}

function ProfileLayout() {
  return (
    <InsideProfile.Navigator>
      <InsideProfile.Screen name="Profile" component={Profile} />
    </InsideProfile.Navigator>
  );
}

function ConfigLayout() {
  return (
    <InsideConfig.Navigator>
      <InsideConfig.Screen name="Configurations" component={Configurations} />
    </InsideConfig.Navigator>
  );
}

function TabLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Mapa"
        component={MapLayout}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileLayout}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Configurações"
        component={ConfigLayout}
        options={{ headerShown: false }}
      />
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
