import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const DriverPolicies = () => {
  const navigation = useNavigation();

  const openConditions = () => {
    navigation.navigate("DriverTermsAndConditions");
  };

  const openPrivacyPolicy = () => {
    navigation.navigate("DriverPrivacyPolicy");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={openConditions}>
          <View style={styles.header}>
            <Text style={styles.text}>Terms & Conditions</Text>
            <View style={styles.iconContainer}>
              <Icon
                name="arrow-right"
                size={40}
                color="black"
                style={styles.icon}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Privacy Policy Row */}
        <TouchableOpacity onPress={openPrivacyPolicy}>
          <View style={styles.header}>
            <Text style={styles.text}>Privacy Policy</Text>
            <View style={styles.iconContainer}>
              <Icon
                name="arrow-right"
                size={40}
                color="black"
                style={styles.icon}
              />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderColor: "#EDEFEE",
    paddingLeft: 25,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  iconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 19,
    color: "black",
    lineHeight: 24,
  },
});

export default DriverPolicies;
