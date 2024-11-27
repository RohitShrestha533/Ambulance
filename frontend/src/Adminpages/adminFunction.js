import axios from "axios";
export function AdminLoginHandel(email, password, navigation) {
  const adminData = {
    email: email,
    password,
  };

  axios
    .post("http://192.168.100.9:5000/adminLogin", adminData)
    .then((response) => {
      if (response.data.status === 200) {
        alert("Login successful");
        navigation.replace("AdminDashboard");
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
}
