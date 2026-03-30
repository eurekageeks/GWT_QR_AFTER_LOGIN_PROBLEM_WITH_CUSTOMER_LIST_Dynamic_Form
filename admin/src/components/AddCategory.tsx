import { useState } from "react";
import api from "../frontend-api/api";

export default function AddCategory() {
  const [name, setName] = useState("");

  const submit = async () => {
    const form = new FormData();
    form.append("name", name);

    await api.post("/admin/categories", form);
    alert("Category added");
    setName("");
  };

  return (
    <div>
      <h2>Add Category</h2>

      <label>Category Name</label><br />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
