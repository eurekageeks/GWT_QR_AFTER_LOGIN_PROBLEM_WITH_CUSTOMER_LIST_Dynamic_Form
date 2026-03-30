import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../vendor-api/vendor-api";

export default function EditVendor() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  useEffect(() => {
  if (id) {
    fetchVendor();
  }
}, [id]);

  const fetchVendor = async () => {
  try {

    console.log("Vendor ID:", id);

    const res = await api.get(`/auth/vendor/${id}`);

    console.log("Vendor data:", res.data);

    setEmail(res.data.email);
    setMobile(res.data.mobile);
    setCategory(res.data.category_name || "");
    setSubcategory(res.data.sub_category_name || "");

  } catch (err) {
    console.error(err);
  }
};

  const updateVendor = async () => {
    try {

      await api.put(`/auth/vendor/${id}`, {
        email,
        mobile,
        category_name: category,
        sub_category_name: subcategory
      });

      alert("Vendor updated successfully");

     navigate("/dashboard/admin/vendorlist");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>
        <h2 style={styles.title}>Edit Vendor</h2>

        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Mobile</label>
          <input
            style={styles.input}
            value={mobile}
            onChange={(e)=>setMobile(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Category</label>
          <input
            style={styles.input}
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Sub Category</label>
          <input
            style={styles.input}
            value={subcategory}
            onChange={(e)=>setSubcategory(e.target.value)}
          />
        </div>

        <button style={styles.button} onClick={updateVendor}>
          Update Vendor
        </button>

      </div>

    </div>
  );
}

const styles:any = {

  page:{
    minHeight:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"linear-gradient(135deg,#667eea,#764ba2)"
  },

  card:{
    background:"white",
    padding:"30px",
    borderRadius:"10px",
    width:"400px",
    boxShadow:"0 10px 25px rgba(0,0,0,0.2)"
  },

  title:{
    textAlign:"center",
    marginBottom:"20px"
  },

  formGroup:{
    marginBottom:"15px",
    display:"flex",
    flexDirection:"column"
  },

  input:{
    padding:"10px",
    borderRadius:"6px",
    border:"1px solid #ccc"
  },

  button:{
    width:"100%",
    padding:"10px",
    background:"#4f46e5",
    color:"white",
    border:"none",
    borderRadius:"6px",
    cursor:"pointer"
  }

}