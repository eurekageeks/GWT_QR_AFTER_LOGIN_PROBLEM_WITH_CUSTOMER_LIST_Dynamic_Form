import { useEffect, useState } from "react";
import api from "../frontend-api/api";

export default function AddBusiness() {
  const [categories, setCategories] = useState<any[]>([]);
  {/*const [subCategories, setSubCategories] = useState<any[]>([]);*/}
  const [categoryId, setCategoryId] = useState("");
  {/*const [subCategoryId, setSubCategoryId] = useState("");*/}
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
    //formData.append("sub_category_id", subCategoryId);
    formData.append("image", image);

    await api.post("/admin/businesses", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Business added successfully");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add Business
        </h2>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => loadSubCategories(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
       
        {/* Sub Category */}
        {/*
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Sub Category
          </label>
          <select
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
            disabled={!categoryId}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Sub Category</option>
            {subCategories.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        */}
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Business Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-4 h-32 w-full object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
            hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Add Business
        </button>
      </div>
    </div>
  );
}
