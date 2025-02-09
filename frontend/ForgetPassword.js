import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    try {
      await axios.post("http://localhost:3000/forgot-password", { email });
      setIsOtpSent(true);
      Alert.alert("OTP sent to your email");
    } catch (error) {
      Alert.alert("Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3000/verify-otp", {
        email,
        otp,
      });
      Alert.alert(response.data.message);
    } catch (error) {
      Alert.alert("Invalid OTP");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Send OTP" onPress={handleSendOtp} />

      {isOtpSent && (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}
    </View>
  );
};

export default ForgotPassword;
