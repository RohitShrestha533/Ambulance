import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"; // Import Recharts

// Registering ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Make = () => {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [
      {
        label: "Revenue ($)",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [trendData, setTrendData] = useState([]);
  const [topHospital, setTopHospital] = useState([]);

  useEffect(() => {
    const ip = "http://localhost:5000"; // Make sure to use the correct server IP
    async function fetchData() {
      try {
        // Fetching weekly revenue data for bar chart
        const revenueResponse = await fetch(`${ip}/admin/revenueweek`);
        const revenue = await revenueResponse.json();
        console.log("rev", revenue);

        // Fetching top hospitals based on completed bookings
        const topHospitalResponse = await fetch(`${ip}/admin/top-hospitals`);
        const hospitals = await topHospitalResponse.json();

        // Setting the revenue bar chart data
        setRevenueData({
          labels: revenue.map(
            (item) => `Week ${item._id.week} - ${item._id.year}`
          ),
          datasets: [
            {
              label: "Revenue ($)",
              data: revenue.map((item) => item.totalRevenue),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

        // Setting the trendline data (weekly revenue)
        setTrendData(
          revenue.map((item) => ({
            name: `Week ${item._id.week} - ${item._id.year}`,
            uv: item.totalRevenue, // Assuming 'uv' stands for revenue
          }))
        );

        // Setting the top hospitals data
        setTopHospital(hospitals);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const revenueOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Weekly Revenue",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        {/* Weekly Revenue Bar Chart */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Revenue Bar Chart (Weekly)</h4>
              <Bar data={revenueData} options={revenueOptions} />
            </div>
          </div>
        </div>

        {/* Weekly Revenue Trendline Chart */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body w-100">
              <h4>Revenue Trendline</h4>
              <LineChart width={300} height={300} data={trendData}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
              </LineChart>
            </div>
          </div>
        </div>

        {/* Top Hospitals */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Top Hospitals</h4>
              <ul className="list-group">
                {topHospital.map((hospital, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {hospital.hospitalDetails?.hospitalName}{" "}
                    <span className="badge bg-primary rounded-pill">
                      {hospital.bookingCount} Bookings
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Make;
