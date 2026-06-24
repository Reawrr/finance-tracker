import { Bar } from "react-chartjs-2";

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function MonthlyExpenseChart({
  data
}) {

  const chartData = {
    labels: data.map(
      item => item.month
    ),

    datasets: [
      {
        label: "Monthly Expenses",

        data: data.map(
          item => Number(item.total)
        ),

        backgroundColor: "#3B82F6",
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
        position: "top"
      },

      tooltip: {
        callbacks: {
          label: function(context) {
            return (
              "Rp " +
              context.raw.toLocaleString("id-ID")
            );
          }
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: function(value) {
            return (
              "Rp " +
              Number(value)
                .toLocaleString("id-ID")
            );
          }
        }
      }
    }
  };

  return (
    <Bar
      data={chartData}
      options={options}
    />
  );
}