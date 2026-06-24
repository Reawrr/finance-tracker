import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleRegister =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          "/auth/register",
          form
        );

        alert(
          "Register berhasil"
        );

        navigate("/");

      } catch (error) {

        alert(
          error.response?.data?.error ||
          "Register gagal"
        );

      }

    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Finance Tracker
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Buat akun baru
        </p>

        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Sudah punya akun?
          <a
            href="/"
            className="text-blue-600 ml-1"
          >
            Login
          </a>
        </p>

      </div>

    </div>
  );
}