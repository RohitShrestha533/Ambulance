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
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Test = () => {
  const navigation = useNavigation();
  const [currentCoordinates, setCurrentCoordinates] = useState(""); // Current coordinates state
  const [currentAddress, setCurrentAddress] = useState(""); // Current address state
  const [destinationCoordinates, setDestinationCoordinates] = useState(
    "27.63289726932407,84.4077873229980"
  );
  const [destinationAddress, setDestinationAddress] =
    useState("Select destination"); // Destination address state
  const [showMap, setShowMap] = useState(false);
  const [locationType, setLocationType] = useState(""); // "current" or "destination"
  const [tempCoordinates, setTempCoordinates] = useState(""); // Temporary coordinates for map selection
  const [tempPlaceName, setTempPlaceName] = useState(""); // Temporary place name
  const [driverLocations, setDriverLocations] = useState([]); // Driver locations
  const [mapKey, setMapKey] = useState(0); // Key to force re-render WebView

  let ip = "192.168.4.106"; // Change to your local IP address
  // let ip = "192.168.18.12"; // Change to your local IP address

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        setCurrentCoordinates(`${latitude},${longitude}`);
        // setDestinationCoordinates(""); // Reset destination coordinates on new current location
        setDestinationAddress("Select destination"); // Reset destination address on new current location

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
      console.log("Fetched driver locations:", response.data);
      setDriverLocations(response.data || []);
    } catch (error) {
      console.error("Error fetching driver locations:", error);
      Alert.alert("Error", "Unable to fetch driver locations.");
    }
  };

  useEffect(() => {
    requestLocationPermission();
    fetchDriverLocations();
  }, []);

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

  const finddriver = async () => {
    try {
      if (!currentCoordinates || !destinationCoordinates) {
        Alert.alert(
          "Error",
          "Both current and destination locations must be selected."
        );
        return;
      }

      const [latitude, longitude] = currentCoordinates.split(",").map(Number);
      const [deslatitude, deslongitude] = destinationCoordinates
        .split(",")
        .map(Number);

      console.log("From coordinates:", latitude, longitude);
      console.log("To coordinates:", deslatitude, deslongitude);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      console.log("Sending request to drivers-nearby endpoint...");
      const response = await axios.post(
        `http://${ip}:5000/drivers-nearby`,
        { latitude, longitude, deslatitude, deslongitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        console.log("Nearby drivers fetched successfully:", response.data);
        console.log("Nearby ", response.data.totaldistance);

        navigation.navigate("AvailableAmbulance", {
          drivers: response.data,
          mylocation: currentCoordinates,
          destination: destinationCoordinates,
          totaldistance: response.data.totaldistance,
        });
      } else {
        Alert.alert("Error", "Failed to fetch drivers.");
      }
    } catch (error) {
      console.error("Error in finddriver:", error.message);
      if (error.response) {
        console.error("Response error data:", error.response.data);
      }
      Alert.alert("Error", "Unable to find drivers. Please try again.");
    }
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

  const carIconBase64 =
    "data:image/jpeg;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpb25pY29uIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTgwIDIyNGwzNy43OC04OC4xNUMxMjMuOTMgMTIxLjUgMTM5LjYgMTEyIDE1Ny4xMSAxMTJoMTk3Ljc4YzE3LjUxIDAgMzMuMTggOS41IDM5LjMzIDIzLjg1TDQzMiAyMjRNODAgMjI0aDM1MnYxNDRIODB6TTExMiAzNjh2MzJIODB2LTMyTTQzMiAzNjh2MzJoLTMydi0zMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIvPjxjaXJjbGUgY3g9IjE0NCIgY3k9IjI4OCIgcj0iMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiLz48Y2lyY2xlIGN4PSIzNjgiIGN5PSIyODgiIHI9IjE2IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMyIi8+PC9zdmc+"; // Base64-encoded SVG icon

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
        const map = L.map('map').setView([${lat}, ${lng}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);
        let currentMarker = L.marker([${lat}, ${lng}]).addTo(map).bindPopup("Current Location");
        
        const driverLocations = ${JSON.stringify(drivers)};
        driverLocations.forEach(driver => {
          if (driver.latitude && driver.longitude) {
            const driverIcon = L.icon({
             iconUrl:'${carIconBase64}',
            iconSize: [40, 40],
              iconAnchor: [20, 40],
              popupAnchor: [0, -40],
            });
            L.marker([driver.latitude, driver.longitude], { icon: driverIcon })
              .addTo(map)
              .bindPopup(\`Driver: \${driver.fullname || "Unknown"}\`);
          }
        });

        map.on('click', function(e) {
          const { lat, lng } = e.latlng;
          window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
          if (currentMarker) {
            currentMarker.setLatLng([lat, lng]);
          }
        });
      </script>
    </body>
    </html>`;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Location</Text>
      <Text style={styles.label}>Current Location:</Text>
      <TouchableOpacity
        onPress={() => {
          setLocationType("current");
          fetchDriverLocations();
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
          fetchDriverLocations();
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
              key={mapKey}
              originWhitelist={["*"]}
              source={{
                html:
                  locationType === "destination"
                    ? mapHtml(
                        destinationCoordinates.split(",")[0],
                        destinationCoordinates.split(",")[1],
                        driverLocations
                      )
                    : mapHtml(
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

      <TouchableOpacity style={styles.confirmButton} onPress={finddriver}>
        <Text style={styles.confirmButtonText}>Search Ambulance</Text>
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
  },
  mapContainer: {
    flex: 1,
    marginBottom: 10,
    marginTop: 50,
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
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Test;
