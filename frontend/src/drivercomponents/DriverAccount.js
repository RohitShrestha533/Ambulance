import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DriverAccount = () => {
  const navigation = useNavigation();
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // let ip = "172.30.3.131";
  let ip = "192.168.240.106";

  // Fetch driver details

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        console.log("Fetching driver data...");
        const token =
          Platform.OS === "web"
            ? localStorage.getItem("drivertoken")
            : await AsyncStorage.getItem("drivertoken");

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get(`http://${ip}:5000/driverData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("Response from server:", response.data);

        if (response.data?.driver) {
          response.data.driver.Dob = new Date(
            response.data.driver.Dob
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setDriverData(response.data.driver);
        } else {
          throw new Error("Invalid driver data");
        }
      } catch (error) {
        console.error("Error fetching driver data:", error);
        setDriverData(null);
        if (error.response?.status === 401) {
          navigation.navigate("Login");
        }
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchDriverData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A8A5A9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!driverData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load Driver data.</Text>
      </View>
    );
  }

  const editDriverAccount = () => {
    navigation.navigate("DriverAccountUpdate");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="person" size={50} color="white" />
        </View>
        <TouchableOpacity onPress={editDriverAccount}>
          <Text style={styles.editProfileText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Full name</Text>
        <Text style={styles.value}>{driverData.fullname || "N/A"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Email address</Text>
        <Text style={styles.value}>{driverData.email || "N/A"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Phone number</Text>
        <Text style={styles.value}>{driverData.phone || "N/A"}</Text>
      </View>
      <View style={styles.infoRow}>
        <View>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{driverData.gender || "N/A"}</Text>
        </View>
        <View>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{driverData.Dob || "N/A"}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    gap: 30,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
  },
  editProfileText: {
    color: "#A8A5A9",
    padding: 12,
    borderRadius: 5,
    fontWeight: "bold",
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: "#A8A5A5",
  },
  row: {
    flex: 0.12,
    borderBottomWidth: 1,
    borderColor: "#EDEFEE",
    gap: 10,
    paddingLeft: 5,
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: "space-between",
  },
  label: {
    color: "#978E8E",
    fontWeight: "regular",
  },
  value: {
    fontWeight: "600",
    color: "#3D3838",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});

export default DriverAccount;
