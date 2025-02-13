import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Platform,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SectionlistToDisplay = [
  {
    title: "Profile",
    data: [
      { name: "Account" },
      { name: "Password Change" },
      { name: "History" },
      { name: "Policies" },
      { name: "Log Out" },
    ],
  },
];

// let ip = "172.30.3.131";
let ip = "192.168.18.12";

const Item = ({ name, navigation }) => {
  const handlePress = async () => {
    switch (name) {
      case "Account":
        navigation.navigate("DriverAccount");
        break;
      case "Password Change":
        navigation.navigate("Driverpasswordchange");
        break;
      case "History":
        navigation.navigate("DriverHistory");
        break;
      case "Policies":
        navigation.navigate("DriverPolicies");
        break;
        // case "Log Out":
        try {
          let token = "";
          if (Platform.OS === "web") {
            token = localStorage.getItem("drivertoken");
          } else {
            token = await AsyncStorage.getItem("drivertoken");
          }
          console.log("hiiiii ", token);
          if (token) {
            // await axios.post(
            //   `http://${ip}:5000/driverLogout`,
            //   {},
            //   {
            //     headers: {
            //       Authorization: `Bearer ${token}`,
            //     },
            //   }
            // );

            if (Platform.OS === "web") {
              localStorage.removeItem("drivertoken");
            } else {
              await AsyncStorage.removeItem("drivertoken");
            }
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }], // Main is the screen you want to navigate to
            });
            alert("Logged out successfully");
          } else {
            alert("No token found, user might already be logged out.");
          }
        } catch (error) {
          alert("Logout failed. Please try again.");
        }

        break;
      case "Log Out":
        try {
          console.log("hah");
          let token =
            Platform.OS === "web"
              ? localStorage.getItem("drivertoken")
              : await AsyncStorage.getItem("drivertoken");

          if (token) {
            await axios
              .post(
                `http://${ip}:5000/driverLogout`,
                {},
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              .catch((err) => console.error("Logout API error:", err));

            Platform.OS === "web"
              ? localStorage.removeItem("drivertoken")
              : await AsyncStorage.removeItem("drivertoken");
            console.log("helllo ");
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            alert("Logged out successfully");
          } else {
            alert("No token found, user might already be logged out.");
          }
        } catch (error) {
          console.error("Logout failed:", error);
          alert("Logout failed. Please try again.");
        }
        break;
      default:
        navigation.navigate("Details", { name });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={profileStyle.innerContainer}>
        <Text style={profileStyle.itemText}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DriverProfile = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <Item name={item.name} navigation={navigation} />
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
      }}
    >
      <Text style={profileStyle.sectionHeader}>{title}</Text>
      <View style={profileStyle.iconContainer}>
        <Icon name="person" size={50} color="white" />
      </View>
    </View>
  );

  return (
    <View style={profileStyle.container}>
      <SectionList
        keyExtractor={(item, index) => item + index}
        sections={SectionlistToDisplay}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={Footer}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const profileStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    backgroundColor: "white",
    fontSize: 34,
    paddingHorizontal: 20,
  },
  itemText: {
    color: "#F4CE14",
    fontSize: 32,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#EDEFEE",
  },
  footerText: {
    color: "#000000",
    fontSize: 20,
    textAlign: "center",
  },
});
const Footer = () => (
  <Text style={profileStyle.footerText}>
    All Rights Reserved by AmbuTrack 2024
  </Text>
);

const Separator = () => <View style={profileStyle.separator} />;

export default DriverProfile;
