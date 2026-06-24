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
        <div style={{ padding: "20px" }}>
          <h1>Finance Tracker</h1>

          <h2>Tambah Transaksi</h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "400px",
            }}
          >
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">
                Pilih Category
              </option>

              {categories.map(category => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                  {" "}
                  ({category.type})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />

            <input
              type="date"
              name="transaction_date"
              value={form.transaction_date}
              onChange={handleChange}
            />

            <button
              type="submit"
              className={
                editingId
                  ? "bg-blue-500 text-white px-3 py-1 rounded"
                  : "bg-green-500 text-white px-3 py-1 rounded"
              }
            >
              {
                editingId
                  ? "Update Transaction"
                  : "Add Transaction"
              }
            </button>

            {
              editingId && (
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-1 rounded"
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
              )
            }
          </form>

          <hr />

          <h2 className="text-3xl font-bold mb-6">Daftar Transaksi</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <table className="w-full bg-white shadow rounded">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        Tidak ada transaksi
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="p-3 border-t">{transaction.id}</td>

                        <td className="p-3 border-t">{transaction.category}</td>

                        <td className="p-3 border-t">{transaction.type}</td>

                        <td className="p-3 border-t">
                          Rp{" "}
                          {Number(
                            transaction.amount
                          ).toLocaleString("id-ID")}
                        </td>

                        <td className="p-3 border-t">
                          {transaction.description}
                        </td>

                        <td className="p-3 border-t">
                          {new Date(
                            transaction.transaction_date
                          ).toLocaleDateString("id-ID")}
                        </td>

                        <td className="p-3 border-t space-x-2">
                          <button
                            className="bg-gray-200 text-black px-3 py-1 rounded"
                            onClick={() =>
                              handleEdit(transaction)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() =>
                              deleteTransaction(
                                transaction.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <button
                  className="bg-gray-200 text-black px-3 py-1 rounded"
                  disabled={page === 1}
                  onClick={() =>
                    fetchTransactions(page - 1)
                  }
                >
                  Previous
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  className="bg-gray-200 text-black px-3 py-1 rounded"
                  disabled={page === totalPages}
                  onClick={() =>
                    fetchTransactions(page + 1)
                  }
                >
                  Next
                </button>

                <input
                  type="text"
                  placeholder="Search transaction..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                <button
                  className="bg-gray-200 text-black px-3 py-1 rounded"
                  onClick={() =>
                    fetchTransactions(1)
                  }
                >
                  Search
                </button>
                
              </div>
            </>
          )}
        </div>
    </>
  );
}