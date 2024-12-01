import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import UserProfile from "./UserProfile"; // Assuming you have a UserProfile component
import AsyncStorage from "@react-native-async-storage/async-storage";
const Tab = createBottomTabNavigator();
// let ip = "192.168.218.106";
let ip = "192.168.100.9";

const AA = () => {
  const navigation = useNavigation();
  const [mylocation, setMylocation] = useState("Fetching location...");
  const [coordinates, setCoordinates] = useState("");
  const [destination, setDestination] = useState("");
  const [locationtype, setLocationtype] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  const fetchAvailableDrivers = async () => {
    if (!destination) {
      Alert.alert("Error", "Please select a destination.");
      return;
    }

    try {
      const [lat, lng] = coordinates.split(",").map(parseFloat);
      const [deslat, deslng] = destination.split(",").map(parseFloat);

      const token =
        Platform.OS === "web"
          ? localStorage.getItem("token")
          : await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found, please login again");
      }

      console.log(`Fetching drivers near: Latitude ${lat}, Longitude ${lng}`);
      console.log("desti :", destination);

      const response = await fetch(`http://${ip}:5000/drivers-nearby`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          deslatitude: deslat,
          deslongitude: deslng,
        }),
      });

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        throw new Error("Failed to fetch drivers");
      }

      const data = await response.json();
      console.log("Drivers data received:", data);
      setAvailableDrivers(data.drivers || []);
      console.log("loco :", mylocation);
      console.log("distance total :", data.totaldistance);
      console.log("des loco :", destination);
      navigation.navigate("AvailableAmbulance", {
        drivers: data,
        mylocation: mylocation,
        destination: destination,
        totaldistance: data.totaldistance,
      });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      Alert.alert(
        "Error",
        error.message || "Unable to fetch drivers. Please try again."
      );
    }
  };

  // Request Location Permission and Fetch Location
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log("Location permission status:", status); // Log permission status

    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        setMylocation(
          `Lat: ${location.coords.latitude}, Lng: ${location.coords.longitude}`
        );
        setCoordinates(
          `${location.coords.latitude}, ${location.coords.longitude}`
        );
        console.log("Location updated:", location.coords); // Log actual location
      } catch (error) {
        console.error("Error getting location:", error); // Log any errors
        Alert.alert("Error", "Unable to fetch location.");
      }
    } else {
      Alert.alert("Permission Denied", "Location permission is required.");
    }
  };

  useEffect(() => {
    requestLocationPermission(); // Request permission and fetch location
  }, []);

  const handleMapMessage = (event) => {
    const { latitude, longitude } = JSON.parse(event.nativeEvent.data);

    if (locationtype === "myLocation") {
      setMylocation(`${latitude}, ${longitude}`);
      setCoordinates(`${latitude}, ${longitude}`);
    } else if (locationtype === "destination") {
      setDestination(`${latitude}, ${longitude}`);
    }
    setShowMap(false); // Close the map once location is updated
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

      let marker = null;

      // Function to update the marker on the map
      function updateMarker(lat, lng) {
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng]).addTo(map);
        }
        map.setView([lat, lng], 15);
      }

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
        updateMarker(lat, lng);
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng })); // Send to React Native
      });

      // Click on the map to update coordinates
      map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        updateMarker(lat, lng);
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
      });

      // Listen for messages from React Native
      window.addEventListener('message', function(event) {
        const { latitude, longitude } = JSON.parse(event.data);
        updateMarker(latitude, longitude);
      });
    </script>
  </body>
</html>`;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Welcome to the Page</Text>
      <View style={styles.container}>
        <Text style={styles.header}>Select your location</Text>

        <TouchableOpacity
          onPress={() => {
            setLocationtype("myLocation");
            setShowMap(true);
          }}
        >
          <View style={styles.input}>
            <Text>My Location :{mylocation}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setLocationtype("destination");
            setShowMap(true);
          }}
        >
          <View style={styles.input}>
            <Text>Destination {destination}</Text>
          </View>
        </TouchableOpacity>
        {showMap && (
          <View style={{ flex: 1, height: 600 }}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: mapHtml }}
              javaScriptEnabled={true}
              onMessage={handleMapMessage}
              injectedJavaScript={
                coordinates
                  ? `window.postMessage('${JSON.stringify({
                      latitude: parseFloat(coordinates.split(",")[0]),
                      longitude: parseFloat(coordinates.split(",")[1]),
                    })}', '*');`
                  : ""
              }
              style={{ flex: 1 }}
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={fetchAvailableDrivers}>
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

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    marginBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    height: 90,
    paddingTop: 10,
    position: "absolute",
    bottom: 0,
  },
  driverItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  driverText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Main;
