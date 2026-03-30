import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../vendor-api/vendor-api";

export default function ViewCustomer() {

const { id } = useParams();
const [customer,setCustomer] = useState<any>({});

useEffect(()=>{
fetchCustomer();
},[])

const fetchCustomer = async () => {
  const res = await api.get(`/auth/customer/${id}`);
  console.log(res.data); // check what backend returns
  setCustomer(res.data);
};

return (

<div style={styles.page}>

<div style={styles.card}>

<h2 style={styles.title}>Customer Details</h2>

<div style={styles.row}>
<div style={styles.label}>Email</div>
<div style={styles.value}>{customer?.email}</div>
</div>

<div style={styles.row}>
<div style={styles.label}>Mobile</div>
<div style={styles.value}>{customer?.mobile}</div>
</div>

<div style={styles.row}>
<div style={styles.label}>Password</div>
<div style={styles.value}>{customer?.password}</div>
</div>

</div>

</div>

)

}

const styles:any = {

page:{
minHeight:"100vh",
background:"linear-gradient(135deg,#ff9a9e,#fad0c4)",
display:"flex",
justifyContent:"center",
alignItems:"center",
padding:"20px"
},

card:{
background:"white",
borderRadius:"16px",
padding:"35px",
width:"100%",
maxWidth:"520px",
boxShadow:"0 15px 40px rgba(0,0,0,0.15)"
},

title:{
textAlign:"center",
marginBottom:"30px",
fontSize:"26px",
fontWeight:"bold",
color:"#d63384"
},

row:{
display:"grid",
gridTemplateColumns:"140px 1fr",
padding:"14px 0",
borderBottom:"1px solid #eee",
alignItems:"center"
},

label:{
fontWeight:"600",
color:"#d63384"
},

value:{
color:"#444",
wordBreak:"break-all"
}

};