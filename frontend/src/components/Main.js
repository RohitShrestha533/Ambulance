import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview"; // Import WebView to display the map
import UserProfile from "./UserProfile";

const Tab = createBottomTabNavigator();

const AA = () => {
  const [mylocation, setMylocation] = useState("");
  const [coordinates, setCoordinates] = useState("27.1, 84");
  const [showMap, setShowMap] = useState(false);

  const handleMapMessage = (event) => {
    const { latitude, longitude } = JSON.parse(event.nativeEvent.data);
    setCoordinates(`${latitude}, ${longitude}`);
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Welcome to the Home Page</Text>
      <View style={styles.container}>
        <Text style={styles.header}>Select your location</Text>

        <TouchableOpacity
          onPress={() => {
            console.log("Setting showMap to true");
            console.log("showMap value:", showMap);
            setShowMap(true);
          }}
        >
          <View style={styles.input}>
            <Text>{mylocation}</Text>
          </View>
        </TouchableOpacity>

        {/*  Latitude and Longitude of Destination location*/}
        <TouchableOpacity
          onPress={() => {
            console.log("Setting showMap to true");
            console.log("showMap value:", showMap);
            setShowMap(true);
          }}
        >
          <View style={styles.input}>
            <Text>{coordinates}</Text>
          </View>
        </TouchableOpacity>

        {showMap && (
          <View style={{ flex: 1, height: 600 }}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: mapHtml }}
              javaScriptEnabled={true}
              onMessage={handleMapMessage}
              style={{ flex: 1 }}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => Alert.alert("Registered", coordinates)}
        >
          <Text style={styles.buttonText}>Search Ambulance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const SOSButton = ({ onPress }) => (
  <TouchableOpacity style={styles.sosButton} onPress={onPress}>
    <Text style={{ color: "white" }}>SOS</Text>
  </TouchableOpacity>
);

const Main = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          name="Home"
          component={AA}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarLabel: "Home",
          }}
        />
        <Tab.Screen
          name="Profile"
          component={UserProfile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarLabel: "Profile",
          }}
        />
      </Tab.Navigator>

      {/* SOS Button */}
      <SOSButton
        onPress={() => {
          alert("SOS Button Pressed!");
        }}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    marginBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    height: 90,
    paddingTop: 10,
    position: "absolute",
    bottom: 0,
  },
  sosButton: {
    position: "absolute",
    bottom: 45,
    alignSelf: "center",
    backgroundColor: "red",
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Main;
