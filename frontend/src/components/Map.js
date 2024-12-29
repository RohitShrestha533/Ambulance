import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(
    "Fetching location..."
  );
  const [currentCoordinates, setCurrentCoordinates] = useState("");
  const [currentAddress, setCurrentAddress] = useState(""); // Full address
  const [placeName, setPlaceName] = useState(""); // Name of place (hospital, store, etc.)
  const [destination, setDestination] = useState("");
  const [destinationCoordinates, setDestinationCoordinates] = useState(""); // For destination coordinates
  const [destinationAddress, setDestinationAddress] = useState(""); // For destination address
  const [showMap, setShowMap] = useState(false);
  const [locationType, setLocationType] = useState(""); // "current" or "destination"
  const [tempCoordinates, setTempCoordinates] = useState(""); // Temporary storage for map-selected coordinates
  const [tempPlaceName, setTempPlaceName] = useState(""); // Temporary storage for map-selected place name

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        setCurrentCoordinates(`${latitude},${longitude}`);
        setDestinationCoordinates(`${latitude},${longitude}`);

        // Reverse geocode to get the full address
        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (geocode.length > 0) {
          const { street, city, district, name, subLocality } = geocode[0];
          // Check if subLocality exists and use it as the ward number
          const fullAddress = `${street || ""}, ${city || ""}, ${
            district || ""
          }, ${subLocality || ""}, ${name || ""}`;
          setCurrentAddress(fullAddress || "Address not found");
          setDestinationAddress(fullAddress || "Address not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        Alert.alert("Error", "Unable to fetch location.");
      }
    } else {
      Alert.alert("Permission Denied", "Location permission is required.");
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleMapMessage = (event) => {
    const { latitude, longitude } = JSON.parse(event.nativeEvent.data);
    setTempCoordinates(`${latitude},${longitude}`);

    // Reverse geocode the selected coordinates from the map
    Location.reverseGeocodeAsync({ latitude, longitude })
      .then((geocode) => {
        if (geocode.length > 0) {
          const {
            street,
            city,
            district,
            name,
            subLocality,
            address,
            business,
          } = geocode[0];
          const place =
            name ||
            subLocality ||
            street ||
            city ||
            district ||
            business ||
            address;
          setTempPlaceName(place || "Name not found");
        }
      })
      .catch((error) => {
        console.error("Error reverse geocoding:", error);
      });
  };

  const confirmLocation = () => {
    if (locationType === "current") {
      setCurrentAddress(tempPlaceName);
      setCurrentCoordinates(tempCoordinates);
    } else if (locationType === "destination") {
      setDestinationAddress(tempPlaceName);
      setDestinationCoordinates(tempCoordinates);
    }
    setShowMap(false); // Close the map
  };

  const mapHtml = (lat, lng) => `<!DOCTYPE html>
<html>
  <head>
    <title>Leaflet Map with Search</title>
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
      const map = L.map('map').setView([${lat}, ${lng}], 13); // Set map to the given coordinates
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      let marker = L.marker([${lat}, ${lng}]).addTo(map); // Initial marker at the given coordinates

      // Function to update the marker on the map
      function updateMarker(lat, lng) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 15);
      }

      // Click on the map to update coordinates
      map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        updateMarker(lat, lng);
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
      });
    </script>
  </body>
</html>`;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Locations</Text>

      {/* Current Location Input */}
      <Text style={styles.label}>Current Location:</Text>
      <TouchableOpacity
        onPress={() => {
          setLocationType("current");
          setShowMap(true);
        }}
      >
        <View style={styles.input}>
          <Text>{currentAddress || "Fetching location..."}</Text>
        </View>
      </TouchableOpacity>

      {/* Destination Location Input */}
      <Text style={styles.label}>Destination Location:</Text>
      <TouchableOpacity
        onPress={() => {
          setLocationType("destination");
          setShowMap(true);
        }}
      >
        <View style={styles.input}>
          <Text>{destinationAddress || "Select destination"}</Text>
        </View>
      </TouchableOpacity>

      {/* Modal for Map */}
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
                  locationType === "current" // Use current location coordinates or destination coordinates
                    ? currentCoordinates.split(",")[0]
                    : destinationCoordinates.split(",")[0],
                  locationType === "current"
                    ? currentCoordinates.split(",")[1]
                    : destinationCoordinates.split(",")[1]
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Alert.alert(
            "Locations",
            `Current Location: ${currentCoordinates}\nDestination Location: ${destinationCoordinates}\nPlace Name: ${
              tempPlaceName || "No place selected"
            }`
          );
        }}
      >
        <Text style={styles.buttonText}>Confirm Locations</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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

export default Map;
