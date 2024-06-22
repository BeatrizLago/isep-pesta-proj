import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Login from "../screens/login/Login";
import Signup from "../screens/signup/Signup";
import Home from "../screens/home/Home";
import List from "../screens/list/List";
import Details from "../screens/details/Details";
import Configurations from "../screens/configuration/Configurations";
import Profile from "../screens/profile/Profile";
import { FIREBASE_AUTH } from "../services/firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../state/actions/userAction";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const InsideMap = createNativeStackNavigator();
const InsideList = createNativeStackNavigator();
const InsideProfile = createNativeStackNavigator();
const InsideConfig = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

function MapLayout() {
  return (
    <InsideMap.Navigator>
      <InsideMap.Screen name="Mapa" component={Home} />
      <InsideMap.Screen name="DetalhesMapa" component={Details} options={{ title: 'Detalhes'}}/>
    </InsideMap.Navigator>
  );
}

function ListLayout() {
  return (
    <InsideList.Navigator>
      <InsideList.Screen name="Lista" component={List} />
      <InsideList.Screen name="DetalhesLista" component={Details} options={{ title: 'Detalhes'}}/>
    </InsideList.Navigator>
  );
}

function ProfileLayout() {
  return (
    <InsideProfile.Navigator>
      <InsideProfile.Screen name="Perfil" component={Profile} />
    </InsideProfile.Navigator>
  );
}

function ConfigLayout() {
  return (
    <InsideConfig.Navigator>
      <InsideConfig.Screen name="Configurações" component={Configurations} />
    </InsideConfig.Navigator>
  );
}

function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Mapa") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Lista") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Configurações") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarLabelPosition: "below-icon",
      })}
    >
      <Tab.Screen
        name="Mapa"
        component={MapLayout}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Lista"
        component={ListLayout}
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
      <LoginStack.Screen name="Registar" component={Signup} />
    </LoginStack.Navigator>
  );
}

const Navigation = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        user.reload().then(() => {
          if (user.emailVerified) {
            console.log("user", user);
            setUser(user);
            dispatch(fetchUser());
          } else {
            setUser(null);
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Test"
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
