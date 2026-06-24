import { Pie } from "react-chartjs-2";

import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function ExpensePieChart({
  expenses
}) {

  const data = {
    labels: expenses.map(
      item => item.name
    ),

    datasets: [
      {
        data: expenses.map(
          item => Number(item.total)
        ),

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4"
        ]
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
        position: "top"
      }
    }
  };

  return (
    <Pie
      data={data}
      options={options}
    />
  );
}