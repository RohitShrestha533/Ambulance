import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const RevenuePieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the RevenueChart API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("admintoken"); // Retrieve the token from localStorage

        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await axios.post(
          "http://localhost:5000/admin/revenuechart",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
          }
        );

        const data = response.data;

        // Prepare data for the pie chart
        const hospitalNames = data.map((item) => item.hospitalName);
        const totalPrices = data.map((item) => item.totalPrice);

        setChartData({
          labels: hospitalNames, // Hospital names as labels
          datasets: [
            {
              label: "Total Revenue by Hospital",
              data: totalPrices, // Corresponding revenue data
              backgroundColor: [
                "#FF5733",
                "#33FF57",
                "#3357FF",
                "#FF33A6",
                "#FF8C33",
                "#FF5733",
              ],
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        setError(error.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading message until data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if an error occurred
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Total Revenue per Hospital</h2>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body">
              <Pie
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true, // Maintain aspect ratio
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePieChart;
