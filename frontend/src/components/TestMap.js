import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import axios from "axios";

const TestMap = () => {
  const [currentLocation, setCurrentLocation] = useState(
    "Fetching location..."
  );
  const [currentCoordinates, setCurrentCoordinates] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [destinationCoordinates, setDestinationCoordinates] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [locationType, setLocationType] = useState("");
  const [tempCoordinates, setTempCoordinates] = useState("");
  const [tempPlaceName, setTempPlaceName] = useState("");
  const [driverLocations, setDriverLocations] = useState([]);

  // let ip = "172.30.5.17"; // Change to your local IP address
  let ip = "192.168.18.12"; // Change to your local IP address

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        setCurrentCoordinates(`${latitude},${longitude}`);
        // setDestinationCoordinates(`${latitude},${longitude}`);

        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (geocode.length > 0) {
          const { street, city, district, subLocality } = geocode[0];
          const fullAddress = `${street || ""}, ${city || ""}, ${
            district || ""
          }, ${subLocality || ""}`;
          setCurrentAddress(fullAddress || "Address not found");
          //   setDestinationAddress(fullAddress || "Address not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        Alert.alert("Error", "Unable to fetch location.");
      }
    } else {
      Alert.alert("Permission Denied", "Location permission is required.");
    }
  };

  const fetchDriverLocations = async () => {
    try {
      const response = await axios.get(`http://${ip}:5000/driverlocation`);
      console.log("Fetched driver locations:", response.data); // Debugging data here
      setDriverLocations(response.data || []);
    } catch (error) {
      console.error("Error fetching driver locations:", error);
      Alert.alert("Error", "Unable to fetch driver locations.");
    }
  };

  useEffect(() => {
    requestLocationPermission();
    fetchDriverLocations(); // Fetch driver data when the page is opened
  }, []); // Empty dependency array to trigger only on component mount

  const handleMapMessage = (event) => {
    const { latitude, longitude } = JSON.parse(event.nativeEvent.data);
    setTempCoordinates(`${latitude},${longitude}`);
    Location.reverseGeocodeAsync({ latitude, longitude })
      .then((geocode) => {
        if (geocode.length > 0) {
          const { street, city, district, subLocality } = geocode[0];
          const place =
            street || city || district || subLocality || "Name not found";
          setTempPlaceName(place);
        }
      })
      .catch((error) => console.error("Error reverse geocoding:", error));
  };

  const confirmLocation = () => {
    if (locationType === "current") {
      setCurrentAddress(tempPlaceName);
      setCurrentCoordinates(tempCoordinates);
    } else if (locationType === "destination") {
      setDestinationAddress(tempPlaceName);
      setDestinationCoordinates(tempCoordinates);
    }
    setShowMap(false);
  };

  const mapHtml = (lat, lng, drivers) => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leaflet Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; height: 100vh; }
        #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Initialize the map centered at the current location
        const map = L.map('map').setView([${lat}, ${lng}], 13);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Mark the current location on the map
        const currentMarker = L.marker([${lat}, ${lng}]).addTo(map).bindPopup("Current Location");

        // Fallback image URL if SVG doesn't work
        const carIconImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Ionicons_2.0.1_car-outline.svg';

        // Loop through the drivers' data and place markers on the map
        const driverLocations = ${JSON.stringify(drivers)};
        driverLocations.forEach(driver => {
          if (driver.latitude && driver.longitude) {
            const driverIcon = L.icon({
              iconUrl: carIconImageUrl, // Use image URL here for fallback
              iconSize: [40, 40], // Adjust the size
              iconAnchor: [20, 40],
              popupAnchor: [0, -40],
            });

            L.marker([driver.latitude, driver.longitude], { icon: driverIcon })
              .addTo(map)
              .bindPopup(\`Driver: \${driver.fullname || "Unknown"}\`);
          } else {
            console.error("Invalid driver data:", driver); // Log invalid data
          }
        });

        // When the user clicks on the map, return the clicked location's coordinates
        map.on('click', function(e) {
          const { lat, lng } = e.latlng;
          window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
        });
      </script>
    </body>
    </html>`;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Locations</Text>
      <Text style={styles.label}>From Location:</Text>
      <TouchableOpacity
        onPress={() => {
          setLocationType("current");
          fetchDriverLocations(); // Fetch drivers before opening the map
          setShowMap(true);
        }}
      >
        <View style={styles.input}>
          <Text>{currentAddress || "Fetching location..."}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.label}>Destination Location:</Text>
      <TouchableOpacity
        onPress={() => {
          setLocationType("destination");
          fetchDriverLocations(); // Fetch drivers before opening the map
          setShowMap(true);
        }}
      >
        <View style={styles.input}>
          <Text>{destinationAddress || "Select destination"}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={showMap} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowMap(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <View style={styles.mapContainer}>
            <WebView
              originWhitelist={["*"]}
              source={{
                html: mapHtml(
                  currentCoordinates.split(",")[0],
                  currentCoordinates.split(",")[1],
                  driverLocations
                ),
              }}
              javaScriptEnabled={true}
              onMessage={handleMapMessage}
              style={{ flex: 1 }}
            />
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmLocation}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
  },
  mapContainer: {
    flex: 1,
    marginBottom: 10,
    marginTop: 50, // Add space on top of the map
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 1,
    backgroundColor: "#FF0000",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TestMap;
