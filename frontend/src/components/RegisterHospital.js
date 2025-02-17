import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Login from "./Login";
const RegisterHospital = () => {
  // let ip = "172.30.5.17";
  let ip = "192.168.18.12";

  const navigation = useNavigation();
  const [hospitalName, setHospitalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminContact, setAdminContact] = useState("");
  const [password, setPassword] = useState("");
  const [ambulanceCount, setAmbulanceCount] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [coordinates, setCoordinates] = useState([27.1, 84]);
  const [showMap, setShowMap] = useState(false);

  const handleMapMessage = (event) => {
    const { latitude, longitude } = JSON.parse(event.nativeEvent.data);
    setCoordinates([latitude, longitude]);
    setShowMap(false);
  };

  const mapHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Leaflet Map with Search</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <style>
      body { margin: 0; padding: 0; }
      #map { height: 100vh; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const map = L.map('map').setView([27.1, 84], 13); // Default coordinates

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker([27.1, 84]).addTo(map); // Initial marker

      // Add search control for places
      const geocoder = L.Control.Geocoder.nominatim();
      L.Control.geocoder({
        collapsed: false,
        placeholder: "Search for a place",
        geocoder: geocoder
      }).addTo(map);

      // Listen for search results
      map.on('geocoding', function(event) {
        const { lat, lng } = event.latlng;
        marker.setLatLng([lat, lng]); // Move marker to searched location
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng })); // Send to React Native
      });

      // Click on the map to update coordinates
      map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        marker.setLatLng([lat, lng]);
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
      });
    </script>
  </body>
</html>
`;

  // Handle Form Submission
  const handleSubmit = async () => {
    if (
      !hospitalName ||
      !registrationNumber ||
      !email ||
      !password ||
      !adminName ||
      !adminContact ||
      !ambulanceCount ||
      !coordinates ||
      !emergencyContact
    ) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    const hospitalData = {
      hospitalName,
      registrationNumber,
      email,
      adminName,
      adminContact,
      password,
      ambulanceCount,
      coordinates,
      emergencyContact,
    };
    console.log("frontend", hospitalData);
    axios
      .post(`http://${ip}:5000/hospitalRegister`, hospitalData)
      .then((response) => {
        if (response.data.status === 200) {
          alert("submitted successful wait for admin approve");
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Something went wrong");
          console.log(error.response.data.message);
        }
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Register Hospital</Text>

        <TextInput
          style={styles.input}
          placeholder="Hospital Name"
          value={hospitalName}
          onChangeText={setHospitalName}
        />
        <TextInput
          style={styles.input}
          placeholder="Registration Number"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
        />

        <Text style={styles.label}>Map Coordinates</Text>

        <TouchableOpacity
          onPress={() => {
            console.log("Setting showMap to true");
            console.log("showMap value:", showMap);
            setShowMap(true);
          }}
          style={{ zIndex: 5 }}
        >
          <Text style={[styles.input, { zIndex: 2 }]}>
            {coordinates
              ? `Longitude: ${coordinates[0]}, Latitude: ${coordinates[1]}`
              : "Select coordinates"}
          </Text>
        </TouchableOpacity>
        {showMap && (
          <View style={{ flex: 1, height: 500 }}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: mapHtml }}
              javaScriptEnabled={true}
              onMessage={handleMapMessage}
              style={{ flex: 1 }}
            />
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Administrator Name"
          value={adminName}
          onChangeText={setAdminName}
        />
        <TextInput
          style={styles.input}
          placeholder="Administrator Contact"
          value={adminContact}
          keyboardType="phone-pad"
          onChangeText={setAdminContact}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Ambulances"
          value={ambulanceCount}
          keyboardType="numeric"
          onChangeText={setAmbulanceCount}
        />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Number"
          value={emergencyContact}
          keyboardType="phone-pad"
          onChangeText={setEmergencyContact}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register Hospital</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    minHeight: Platform.OS === "web" ? "100vh" : "auto",
  },
  scrollContainer: {
    flexGrow: 1, // Ensures the scrollview takes up all available space
    paddingBottom: 50, // Extra padding to ensure scroll at the bottom
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },

  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RegisterHospital;
