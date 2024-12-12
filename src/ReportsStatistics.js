import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale
);
const ReportsStatistic = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const booking = querySnapshot.docs.map((doc) => doc.data);

      const groupedByDate = booking.reduce((acc, booking) => {
        acc[booking.date] = (acc[booking.date] || 0) + 1;
        return acc;
      }, {});
      setData(Object.entries(groupedByDate));
    };
    fetchReports();
  }, []);
  const chartData = {
    labels: data.map(([date]) => date),
    datasets: [
      {
        label: "Bookings by dates",
        data: data.map(([_, count]) => count),
        backgroundColor: "rgba(75,192,192,0.4)",
      },
    ],
  };
  return (
    <div>
      <h3>Passenger flow statistics</h3>
      <Bar data={chartData} />
    </div>
  );
};
export default ReportsStatistic;
