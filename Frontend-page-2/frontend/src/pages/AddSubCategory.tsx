import { useEffect, useState } from "react";
import api from "../api/api";

export default function AddSubCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/admin/categories").then(res => setCategories(res.data));
  }, []);

  const submit = async () => {
    const form = new FormData();
    form.append("category_id", categoryId);
    form.append("name", name);

    await api.post("/admin/sub-categories", form);
    alert("Sub-category added");
    setName("");
  };

  return (
    <>
      {/* INTERNAL CSS (same style as AddBusiness / AddCategory) */}
      <style>
        {`
          body {
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .card {
            max-width: 520px;
            margin: 60px auto;
            background: #ffffff;
            padding: 28px 32px;
            border-radius: 16px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
          }

          h2 {
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 24px;
          }

          label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 6px;
          }

          select,
          input {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #d1d5db;
            font-size: 14px;
            transition: all 0.2s ease;
          }

          select:focus,
          input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          }

          button {
            width: 100%;
            margin-top: 20px;
            padding: 12px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }

          button:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
          }

          button:active {
            transform: translateY(0);
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
          }

          input::placeholder {
            color: #9ca3af;
          }
        `}
      </style>

      {/* UI */}
      <div className="card">
        <h2>Add Sub Category</h2>

        <label>Select Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <br /><br />

        <label>Sub Category Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter sub-category name"
        />

        <button onClick={submit}>Submit</button>
      </div>
    </>
  );
}
