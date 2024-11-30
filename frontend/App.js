import React from "react";
import Test from "./src/components/Test";
import Map from "./src/components/Map";
import HomeScreen from "./src/components/HomeScreen";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import Login from "./src/components/Login";
import UserProfile from "./src/components/UserProfile";
import Account from "./src/components/Account";
import AccountUpdate from "./src/components/AccountUpdate";
import History from "./src/components/History";
import Main from "./src/components/Main";
import PrivacyPolicy from "./src/components/PrivacyPolicy";
import TermsAndConditions from "./src/components/TermsAndConditions";
import Policies from "./src/components/Policies";

import DriverProfile from "./src/drivercomponents/DriverProfile";
import DriverAccount from "./src/drivercomponents/DriverAccount";
import DriverAccountUpdate from "./src/drivercomponents/DriverAccountUpdate";
import DriverHistory from "./src/drivercomponents/DriverHistory";
import DriverMain from "./src/drivercomponents/DriverMain";
import DriverPrivacyPolicy from "./src/drivercomponents/DriverPrivacyPolicy";
import DriverTermsAndConditions from "./src/drivercomponents/DriverTermsAndConditions";
import DriverPolicies from "./src/drivercomponents/DriverPolicies";

import RegisterHospital from "./src/components/RegisterHospital";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ title: "Account" }}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{ title: "Terms & Conditions" }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ title: "Privacy Policy" }}
        />
        <Stack.Screen name="AccountUpdate" component={AccountUpdate} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Policies" component={Policies} />

        <Stack.Screen name="RegisterHospital" component={RegisterHospital} />

        <Stack.Screen name="DriverMain" component={DriverMain} />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="DriverAccount"
          component={DriverAccount}
          options={{ title: "Account" }}
        />
        <Stack.Screen
          name="DriverTermsAndConditions"
          component={DriverTermsAndConditions}
          options={{ title: "Terms & Conditions" }}
        />
        <Stack.Screen
          name="DriverPrivacyPolicy"
          component={DriverPrivacyPolicy}
          options={{ title: "Privacy Policy" }}
        />
        <Stack.Screen
          name="DriverAccountUpdate"
          component={DriverAccountUpdate}
        />
        <Stack.Screen name="DriverHistory" component={DriverHistory} />
        <Stack.Screen name="DriverPolicies" component={DriverPolicies} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
