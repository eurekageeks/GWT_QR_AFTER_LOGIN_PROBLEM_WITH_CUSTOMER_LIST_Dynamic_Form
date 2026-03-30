import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function VendorProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const [form, setForm] = useState({
    vendor_name: "",
    owner_name: "",
    business_type: "",
    gst_number: "",
    fssai_license: "",
    year_of_establishment: "",
  });

  // 🔐 Auth check
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // 🔁 Load existing profile (if any)
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/vendor/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfileExists(true);
        setForm({
          vendor_name: res.data.vendor_name || "",
          owner_name: res.data.owner_name || "",
          business_type: res.data.business_type || "",
          gst_number: res.data.gst_number || "",
          fssai_license: res.data.fssai_license || "",
          year_of_establishment: res.data.year_of_establishment
            ? String(res.data.year_of_establishment)
            : "",
        });
      })
      .catch(() => {
        setProfileExists(false);
      });
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      year_of_establishment: form.year_of_establishment
        ? Number(form.year_of_establishment)
        : null,
    };

    try {
      if (profileExists) {
        await axios.put(`${API_URL}/vendor/profile`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/vendor/profile`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Vendor profile saved successfully");
      navigate("/dashboard/vendor/vendors", { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow border">
      <h2 className="text-xl font-semibold mb-5 text-black">
        Vendor Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Vendor Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Restaurant / Vendor Name
          </label>
          <input
            name="vendor_name"
            value={form.vendor_name}
            onChange={handleChange}
            className="w-full border border-gray-400 bg-white text-black px-3 py-2 rounded"
          />
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Owner / Manager Name
          </label>
          <input
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            className="w-full border border-gray-400 bg-white text-black px-3 py-2 rounded"
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Business Type
          </label>
          <input
            name="business_type"
            value={form.business_type}
            onChange={handleChange}
            placeholder="Restaurant, Cafe, Bakery, etc."
            className="w-full border border-gray-400 bg-white text-black px-3 py-2 rounded"
          />
        </div>

        {/* GST Number */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            GST Number (Optional)
          </label>
          <input
            name="gst_number"
            value={form.gst_number}
            onChange={handleChange}
            className="w-full border border-gray-400 bg-white text-black px-3 py-2 rounded"
          />
        </div>

        {/* FSSAI License */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            FSSAI License Number
          </label>
          <input
            name="fssai_license"
            value={form.fssai_license}
            onChange={handleChange}
            className="w-full border border-gray-400 bg-white text-black px-3 py-2 rounded"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Year of Establishment
          </label>
          <input
            type="number"
            name="year_of_establishment"
            value={form.year_of_establishment}
            onChange={handleChange}
            className="w-full border border-gray-400 bg-white text-black px-3 py-2 rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
