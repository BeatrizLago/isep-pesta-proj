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
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const InsideMap = createNativeStackNavigator();
const InsideList = createNativeStackNavigator();
const InsideProfile = createNativeStackNavigator();
const InsideConfig = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

const screens = {
  Map: {
    name: "Mapa",
    component: Home,
    options: (t) => ({ title: t("screens.map.title") }),
    details: {
      name: "DetalhesMapa",
      component: Details,
      options: (t) => ({ title: t("screens.details.title") }),
    },
  },
  List: {
    name: "Lista",
    component: List,
    options: (t) => ({ title: t("screens.list.title") }),
    details: {
      name: "DetalhesLista",
      component: Details,
      options: (t) => ({ title: t("screens.details.title") }),
    },
  },
  Profile: {
    name: "Perfil",
    component: Profile,
    options: (t) => ({ title: t("screens.profile.title") }),
  },
  Config: {
    name: "Configurações",
    component: Configurations,
    options: (t) => ({ title: t("screens.configuration.title") }),
  },
  Login: {
    name: "Login",
    component: Login,
    options: (t) => ({ title: t("screens.login.title") }),
    details: {
      name: "Registar",
      component: Signup,
      options: (t) => ({ title: t("screens.signup.title") }),
    },
  },
};

function createNavigator(Navigator, screenConfig) {
  const { t } = useTranslation();
  return (
    <Navigator.Navigator>
      <Navigator.Screen
        name={screenConfig.name}
        component={screenConfig.component}
        options={screenConfig.options(t)}
      />
      {screenConfig.details && (
        <Navigator.Screen
          name={screenConfig.details.name}
          component={screenConfig.details.component}
          options={screenConfig.details.options(t)}
        />
      )}
    </Navigator.Navigator>
  );
}

function MapLayout() {
  return createNavigator(InsideMap, screens.Map);
}

function ListLayout() {
  return createNavigator(InsideList, screens.List);
}

function ProfileLayout() {
  return createNavigator(InsideProfile, screens.Profile);
}

function ConfigLayout() {
  return createNavigator(InsideConfig, screens.Config);
}

function LoginLayout() {
  return createNavigator(LoginStack, screens.Login);
}

function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "MapaTab") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "ListaTab") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "PerfilTab") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "ConfiguraçõesTab") {
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
        name="MapaTab"
        component={MapLayout}
        options={{ headerShown: false, title: t("screens.map.title") }}
      />
      <Tab.Screen
        name="ListaTab"
        component={ListLayout}
        options={{ headerShown: false, title: t("screens.list.title") }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={ProfileLayout}
        options={{ headerShown: false, title: t("screens.profile.title") }}
      />
      <Tab.Screen
        name="ConfiguraçõesTab"
        component={ConfigLayout}
        options={{
          headerShown: false,
          title: t("screens.configuration.title"),
        }}
      />
    </Tab.Navigator>
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
