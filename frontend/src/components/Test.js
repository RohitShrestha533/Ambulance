import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const RegisterHospital = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState([]);
  const [email, setEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminContact, setAdminContact] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ambulanceCount, setAmbulanceCount] = useState("");
  const [hospitalType, setHospitalType] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [emergencyContact, setEmergencyContact] = useState([]);
  const [hospitalImages, setHospitalImages] = useState([]); // Array for multiple hospital images
  const [certificateImages, setCertificateImages] = useState([]); // Array for multiple certificate images

  const handleImagePick = async (setImages) => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setImages((prevImages) => [...prevImages, pickerResult.uri]);
    }
  };

  const handleSubmit = () => {
    if (
      !hospitalName ||
      !registrationNumber ||
      !contactNumber ||
      !email ||
      !username ||
      !password
    ) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    const hospitalData = {
      hospitalName,
      registrationNumber,
      address,
      contactNumber,
      email,
      adminName,
      adminContact,
      username,
      password,
      ambulanceCount,
      hospitalType,
      operatingHours,
      coordinates,
      emergencyContact,
      hospitalImages,
      certificateImages,
    };

    console.log("Hospital Data:", hospitalData);
    Alert.alert("Success", "Hospital registered successfully!");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
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
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          keyboardType="phone-pad"
          onChangeText={setContactNumber}
        />
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
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
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
          placeholder="Hospital Type"
          value={hospitalType}
          onChangeText={setHospitalType}
        />
        <TextInput
          style={styles.input}
          placeholder="Operating Hours"
          value={operatingHours}
          onChangeText={setOperatingHours}
        />

        <Text style={styles.label}>Coordinates</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={coordinates.latitude}
          onChangeText={(latitude) =>
            setCoordinates({ ...coordinates, latitude })
          }
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={coordinates.longitude}
          onChangeText={(longitude) =>
            setCoordinates({ ...coordinates, longitude })
          }
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Number"
          value={emergencyContact}
          keyboardType="phone-pad"
          onChangeText={setEmergencyContact}
        />

        <Text style={styles.label}>Upload Hospital Images</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => handleImagePick(setHospitalImages)}
        >
          <Text style={styles.imagePickerText}>Select Hospital Images</Text>
        </TouchableOpacity>
        <FlatList
          data={hospitalImages}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.imagePreview} />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.imageList}
        />

        <Text style={styles.label}>Upload Certificate Images</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => handleImagePick(setCertificateImages)}
        >
          <Text style={styles.imagePickerText}>Select Certificate Images</Text>
        </TouchableOpacity>
        <FlatList
          data={certificateImages}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.imagePreview} />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.imageList}
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
  imagePicker: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imagePickerText: {
    color: "#555",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    margin: 5,
  },
  imageList: {
    flexDirection: "row",
    marginBottom: 15,
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
