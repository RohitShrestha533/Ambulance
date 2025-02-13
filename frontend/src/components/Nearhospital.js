import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const Nearhospital = () => {
  const [hospital, setHospital] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  // let ip = "192.168.4.106";
  let ip = "192.168.18.12";

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords); // Set location to state
    } catch (error) {
      console.error(error);
      setError("Error getting location: " + error.message);
    }
  };

  const fetchHospitals = async (latitude, longitude) => {
    try {
      // const token =
      //   Platform.OS === "web"
      //     ? localStorage.getItem("token")
      //     : await AsyncStorage.getItem("token");

      // if (!token) {
      //   throw new Error("No token found, please login again");
      // }
      console.log(" ", latitude, longitude);
      const response = await axios.get(`http://${ip}:5000/getNearbyHospitals`, {
        params: { latitude, longitude },
        // headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch Hospitals");
      }

      setHospital(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        error.message ||
          "Failed to load nearby hospital data. Please try again."
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchHospitals(location.latitude, location.longitude);
    }
  }, [location]);

  const renderHospitalItem = ({ item }) => {
    if (!item) return null;

    const { hospitalName, email, emergencyContact, ambulanceCount, distance } =
      item;

    return (
      <View style={styles.hospitalItem}>
        <Text style={styles.hospitalTitle}>Hospital Name: {hospitalName}</Text>
        <Text>Email Address: {email}</Text>
        <Text>Contact: {emergencyContact}</Text>
        <Text>Total Ambulance: {ambulanceCount}</Text>
        <Text>Distance: {(distance / 1000).toFixed(3)} Km Away</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Hospitals</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : hospital.length === 0 ? (
        <Text>No hospitals available</Text>
      ) : (
        <FlatList
          data={hospital}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderHospitalItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  hospitalItem: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  hospitalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default Nearhospital;
