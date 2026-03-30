import { useEffect, useState } from "react";
import api from "../frontend-api/api";

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
    <div>
      <h2>Add Sub Category</h2>

      <label>Select Category</label><br />
      <select onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select><br /><br />

      <label>Sub Category Name</label><br />
      <input value={name} onChange={(e) => setName(e.target.value)} /><br /><br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
