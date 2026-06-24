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
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto"
      }}
    >

      <h2>Register</h2>

      <form
        onSubmit={handleRegister}
      >

        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">
          Register
        </button>

      </form>

      <br />

      <Link to="/">
        Sudah punya akun?
        Login
      </Link>

    </div>
  );
}