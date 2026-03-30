import { useEffect, useState } from "react";
import api from "../api/api";

export default function AddBusiness() {
  const [categories, setCategories] = useState<any[]>([]);
  //const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  //const [subCategoryId, setSubCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    api.get("/admin/categories").then(res => setCategories(res.data));
  }, []);

  {/*const loadSubCategories = async (id: string) => {
    setCategoryId(id);
    setSubCategoryId("");
    const res = await api.get(`/admin/sub-categories/${id}`);
    setSubCategories(res.data);
  }; */}

  const submit = async () => {
    if (!categoryId || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", categoryId);
   // formData.append("sub_category_id", subCategoryId);
    formData.append("image", image);

    await api.post("/admin/businesses", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Business added successfully");
    setImage(null);
  };

  return (
    <>
      {/* INTERNAL CSS */}
      <style>
        {`
          body {
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            margin: 0;
            padding: 0;
          }

          .add-business {
            max-width: 520px;
            margin: 40px auto;
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
          input[type="file"] {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #d1d5db;
            background-color: #fff;
            font-size: 14px;
            transition: all 0.2s ease;
          }

          select:focus,
          input[type="file"]:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          }

          input[type="file"]::-webkit-file-upload-button {
            background: #eff6ff;
            border: none;
            padding: 8px 14px;
            margin-right: 12px;
            border-radius: 8px;
            color: #2563eb;
            font-weight: 500;
            cursor: pointer;
          }

          input[type="file"]::-webkit-file-upload-button:hover {
            background: #dbeafe;
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

          /* RESPONSIVE STYLES */
          @media (max-width: 600px) {
            .add-business {
              margin: 20px 16px;
              padding: 20px;
            }

            h2 {
              font-size: 22px;
            }

            select,
            input[type="file"] {
              font-size: 13px;
              padding: 8px 10px;
            }

            button {
              font-size: 14px;
              padding: 10px;
            }
          }
        `}
      </style>

      {/* UI */}
      <div className="add-business">
        <h2>Add Business</h2>

        <label>Select Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
>
          <option value="">Select</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <br /><br />
      {/*}
        <label>Select Sub Category</label>
        <select value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
          <option value="">Select</option>
          {subCategories.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select> */}

        <br /><br />

        <label>Upload Business Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <button onClick={submit}>Submit</button>
      </div>
    </>
  );
}
