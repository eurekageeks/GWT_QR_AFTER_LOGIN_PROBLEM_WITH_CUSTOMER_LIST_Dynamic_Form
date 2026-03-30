import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AddSubCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();
  const { categoryId: routeCategoryId } = useParams();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/admin/categories")
      .then((res) => {
        setCategories(res.data);

        // auto select category if coming from route
        if (routeCategoryId) {
          setCategoryId(routeCategoryId);
        }
      });
  }, [routeCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId || !name || !image) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("name", name);
    formData.append("image", image);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/admin/add-sub-category",
        formData
      );

      alert("Sub-category added ✅");
      navigate("/frontend");
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Add Sub Category</h2>

      <form onSubmit={handleSubmit}>
        <label>Category</label>
        <select
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
  required
  style={{
    width: "100%",
    padding: "8px",
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #ccc",
  }}
>
  <option value="" style={{ color: "#000" }}>
    Select Category
  </option>

  {categories.map((cat) => (
    <option
      key={cat._id}
      value={cat._id}
      style={{ color: "#000", backgroundColor: "#fff" }}
    >
      {cat.title}
    </option>
  ))}
</select>


        <br /><br />

        <label>Sub Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          required
        />

        <br /><br />

        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />

        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
