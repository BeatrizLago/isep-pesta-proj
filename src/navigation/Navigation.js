import React, { useEffect, useState, useContext, useCallback } from "react";
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
import { ThemeContext } from "../context/ThemeContext";
import { getCurrentUser } from "../state/actions/authAction";

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

function createNavigator(Navigator, screenConfig, t) {
  return (
    <Navigator.Navigator>
      <Navigator.Screen
        name={screenConfig.name}
        options={screenConfig.options(t)}
      >
        {() => <screenConfig.component t={t} />}
      </Navigator.Screen>
      {screenConfig.details && (
        <Navigator.Screen
          name={screenConfig.details.name}
          options={screenConfig.details.options(t)}
        >
          {() => <screenConfig.details.component t={t} />}
        </Navigator.Screen>
      )}
    </Navigator.Navigator>
  );
}

function MapLayout({ t }) {
  return createNavigator(InsideMap, screens.Map, t);
}

function ListLayout({ t }) {
  return createNavigator(InsideList, screens.List, t);
}

function ProfileLayout({ t }) {
  return createNavigator(InsideProfile, screens.Profile, t);
}

function ConfigLayout({ t }) {
  return createNavigator(InsideConfig, screens.Config, t);
}

function LoginLayout({ t }) {
  return createNavigator(LoginStack, screens.Login, t);
}
function TabLayout({ t, user }) {
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
        options={{ headerShown: false, title: t("screens.map.title") }}
      >
        {() => <MapLayout t={t} />}
      </Tab.Screen>
      <Tab.Screen
        name="ListaTab"
        options={{ headerShown: false, title: t("screens.list.title") }}
      >
        {() => <ListLayout t={t} />}
      </Tab.Screen>
      {!user.isAnonymous && (
        <Tab.Screen
          name="PerfilTab"
          options={{ headerShown: false, title: t("screens.profile.title") }}
        >
          {() => <ProfileLayout t={t} />}
        </Tab.Screen>
      )}
      <Tab.Screen
        name="ConfiguraçõesTab"
        options={{
          headerShown: false,
          title: t("screens.configuration.title"),
        }}
      >
        {() => <ConfigLayout t={t} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const Navigation = ({ t }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { currentTheme } = useContext(ThemeContext);

  const fetchUserData = useCallback(
    async (user) => {
      try {
        await user.reload();
        if (user.isAnonymous) {
          console.log("Anonymous user", user);
          dispatch(fetchUser());
          setUser(user);
        } else if (user.emailVerified) {
          console.log("Verified user", user);
          setUser(user);
          dispatch(fetchUser());
        } else {
          console.log("User not verified");
          setUser(null);
        }
      } catch (error) {
        console.error("Error reloading user:", error);
        setUser(null);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        console.log("No user logged in");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: currentTheme.background,
          border: currentTheme.background,
          card: currentTheme.background,
          text: currentTheme.text,
        },
      }}
    >
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="Test" options={{ headerShown: false }}>
            {() => <TabLayout t={t} user={user} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="LoginHome" options={{ headerShown: false }}>
            {() => <LoginLayout t={t} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
