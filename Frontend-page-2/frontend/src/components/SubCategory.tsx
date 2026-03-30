import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SubCategory() {
  const { categoryId } = useParams();
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/subcategories/${categoryId}`)
      .then((res) => setSubCategories(res.data));
  }, [categoryId]);

  return (
    <div>
      <h2>Sub Categories</h2>

      {subCategories.map((sub: any) => (
        <div key={sub._id}>
          <img src={sub.image} width={120} />
          <p>{sub.name}</p>
        </div>
      ))}
    </div>
  );
}
