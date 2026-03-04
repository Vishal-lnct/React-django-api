import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Address() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: ""
  });

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(`${BASEURL}/api/addresses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      // Save location for navbar
      const locationText = `Deliver to ${form.name} - ${form.city} ${form.pincode}`;
      localStorage.setItem("delivery_location", locationText);

      alert("Address saved successfully!");

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving address");
    }
  };

  return (

    <div className="pt-24 min-h-screen bg-gray-100 flex justify-center">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">

        <h1 className="text-2xl font-bold mb-6">
          Add Delivery Address
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <textarea
            name="address_line"
            placeholder="Street Address"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="state"
            placeholder="State"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="pincode"
            placeholder="Pincode"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700"
          >
            Save Address
          </button>

        </form>

      </div>

    </div>
  );
}

export default Address;