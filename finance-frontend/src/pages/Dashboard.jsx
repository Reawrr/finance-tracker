import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ExpensePieChart from "../components/ExpensePieChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
        const res = await api.get("/dashboard");
        setData(res.data);
    } catch (err) {
        console.log(err);
    }
  };

  const logout = () => {

    localStorage.removeItem('token');

    window.location.href = '/';

  };

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white shadow rounded p-5">
            <h3>Total Pendapatan</h3>

            <p className="text-2xl font-bold">
              Rp {data?.totalIncome}
            </p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h3>Total Pengeluaran</h3>

            <p className="text-2xl font-bold">
              Rp {data?.totalExpense}
            </p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h3>Saldo</h3>

            <p className="text-2xl font-bold">
              Rp {data?.balance}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">

          <div className="bg-white p-5 rounded shadow">

              <h2 className="text-xl font-bold mb-4">
                Pengeluaran berdasarkan kategori
              </h2>

              <ExpensePieChart
                expenses={
                  data.expensesByCategory
                }
              />

            </div>

            <div className="bg-white p-5 rounded shadow">

              <h2 className="text-xl font-bold mb-4">
                Pengeluaran bulanan
              </h2>

              <MonthlyExpenseChart
                data={
                  data.monthlyExpenses
                }
              />

            </div>

          </div>

        </div>

      </div>
    </>
  );
}