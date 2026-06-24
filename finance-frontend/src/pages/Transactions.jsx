import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] =
  useState(null);

  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    description: "",
    transaction_date: "",
  });

  const logout = () => {

    localStorage.removeItem('token');

    window.location.href = '/';

  };

  const fetchTransactions = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/transactions?page=${pageNumber}&limit=5&search=${search}`
      );

      setTransactions(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await api.put(
          `/transactions/${editingId}`,
          form
        );

      } else {

        await api.post(
          "/transactions",
          form
        );

      }

      setForm({
        category_id: "",
        amount: "",
        description: "",
        transaction_date: ""
      });

      setEditingId(null);

      fetchTransactions();

    } catch (error) {

      console.error(error);

    }

  };

  const handleEdit = (
    transaction
  ) => {

    setEditingId(
      transaction.id
    );

    setForm({
      category_id:
        transaction.category_id,

      amount:
        transaction.amount,

      description:
        transaction.description,

      transaction_date:
        transaction.transaction_date
          ?.split("T")[0]
    });

  };

  const addTransaction = async () => {
    try {
      if (
        !form.category_id ||
        !form.amount ||
        !form.transaction_date
      ) {
        alert("Lengkapi data terlebih dahulu");
        return;
      }

      await api.post("/transactions", {
        category_id: Number(form.category_id),
        amount: Number(form.amount),
        description: form.description,
        transaction_date: form.transaction_date,
      });

      alert("Transaksi berhasil ditambahkan");

      setForm({
        category_id: "",
        amount: "",
        description: "",
        transaction_date: "",
      });

      fetchTransactions(page);
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan transaksi");
    }
  };

  const deleteTransaction = async (id) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus transaksi?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/transactions/${id}`);

      alert("Transaksi berhasil dihapus");

      fetchTransactions(page);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus transaksi");
    }
  };

  const fetchCategories = async () => {
    try {

      const res =
        await api.get('/categories');

      setCategories(res.data);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          Transaksi
        </h1>

        {/* Search */}

        <div className="bg-white p-4 rounded-xl shadow mb-6">

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 border rounded-lg p-3"
            />

            <button
              onClick={() =>
                fetchTransactions(1)
              }
              className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
            >
              Cari
            </button>

          </div>

        </div>

        {/* Form */}

        <div className="bg-white p-6 rounded-xl shadow mb-8">

          <h2 className="text-xl font-semibold mb-4">

            {editingId
              ? "Edit Transaction"
              : "Add Transaction"}

          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4"
          >

            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border rounded-lg p-3"
            >
              <option value="">
                Pilih Kategori
              </option>

              {categories.map(category => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name} ({category.type})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="date"
              name="transaction_date"
              value={form.transaction_date}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                className={`text-white px-5 py-3 rounded-lg ${
                  editingId
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {editingId
                  ? "Update Transaction"
                  : "Add Transaction"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600"
                  onClick={() => {

                    setEditingId(null);

                    setForm({
                      category_id: "",
                      amount: "",
                      description: "",
                      transaction_date: ""
                    });

                  }}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* Table */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              {transactions.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-8"
                  >
                    Tidak ada transaksi
                  </td>
                </tr>

              ) : (

                transactions.map(transaction => (

                  <tr
                    key={transaction.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {transaction.id}
                    </td>

                    <td className="p-4">
                      {transaction.category}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type}
                      </span>

                    </td>

                    <td
                      className={`p-4 font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Rp{" "}
                      {Number(
                        transaction.amount
                      ).toLocaleString("id-ID")}
                    </td>

                    <td className="p-4">
                      {transaction.description}
                    </td>

                    <td className="p-4">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString("id-ID")}
                    </td>

                    <td className="p-4 flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(transaction)
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteTransaction(
                            transaction.id
                          )
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        <div className="flex justify-between items-center mt-6">

          <button
            disabled={page === 1}
            onClick={() =>
              fetchTransactions(page - 1)
            }
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              fetchTransactions(page + 1)
            }
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>
    </>
  );
}