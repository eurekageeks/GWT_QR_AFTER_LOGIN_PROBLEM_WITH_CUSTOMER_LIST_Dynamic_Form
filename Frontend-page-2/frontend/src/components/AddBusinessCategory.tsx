import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddBusinessCategory() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name");
      return;
    }

    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/admin/add-category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Category added successfully ✅");

      // ✅ GET NEW CATEGORY ID
      const categoryId = res.data.data._id;

      // reset form
      setName("");
      setImage(null);

      // ✅ REDIRECT TO ADD SUB CATEGORY PAGE
      navigate(`/add-sub-category/${categoryId}`);
    } catch (error: any) {
      alert(
        error?.response?.data?.detail || "Error adding category ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Add Business Category</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Eg: Food"
            required
          />
        </div>

        <br />

        <div>
          <label>Upload Image</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
