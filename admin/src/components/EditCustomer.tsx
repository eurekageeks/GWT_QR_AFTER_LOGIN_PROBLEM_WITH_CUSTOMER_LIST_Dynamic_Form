import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../vendor-api/vendor-api";

export default function EditCustomer(){

const {id} = useParams();
const navigate = useNavigate();

const [email,setEmail] = useState("");
const [mobile,setMobile] = useState("");
const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);

useEffect(()=>{
fetchCustomer();
},[])

const fetchCustomer = async () => {
const res = await api.get(`/auth/customer/${id}`);
setEmail(res.data.email);
setMobile(res.data.mobile);
setPassword(res.data.password);
}

const updateCustomer = async () => {

await api.put(`/auth/customer/${id}`,{
email,
mobile,
password
})

alert("Customer Updated");
navigate("/dashboard/admin/customerlist");

}

return(

<div style={styles.page}>

<div style={styles.card}>

<h2 style={styles.title}>Edit Customer</h2>

<div style={styles.formGroup}>
<label style={styles.label}>Email</label>
<input
style={styles.input}
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"
/>
</div>

<div style={styles.formGroup}>
<label style={styles.label}>Mobile</label>
<input
style={styles.input}
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
placeholder="Mobile"
/>
</div>

<div style={styles.formGroup}>
<label style={styles.label}>Password</label>

<div style={styles.passwordBox}>

<input
style={styles.input}
type={showPassword ? "text" : "password"}
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Password"
/>

<button
type="button"
style={styles.showBtn}
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "Hide" : "Show"}
</button>

</div>

</div>

<button
style={styles.updateBtn}
onClick={updateCustomer}
>
Update Customer
</button>

</div>

</div>

)

}

const styles:any={

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
padding:"35px",
borderRadius:"16px",
width:"100%",
maxWidth:"500px",
boxShadow:"0 15px 40px rgba(0,0,0,0.15)"
},

title:{
textAlign:"center",
marginBottom:"25px",
color:"#d63384",
fontSize:"26px"
},

formGroup:{
marginBottom:"18px",
display:"flex",
flexDirection:"column"
},

label:{
marginBottom:"6px",
fontWeight:"600",
color:"#d63384"
},

input:{
padding:"10px",
borderRadius:"8px",
border:"1px solid #ddd",
fontSize:"14px",
width:"100%"
},

passwordBox:{
display:"flex",
gap:"8px"
},

showBtn:{
background:"#ff4d94",
color:"white",
border:"none",
padding:"8px 12px",
borderRadius:"6px",
cursor:"pointer"
},

updateBtn:{
width:"100%",
background:"#ff4d94",
color:"white",
border:"none",
padding:"12px",
borderRadius:"8px",
fontSize:"15px",
cursor:"pointer",
marginTop:"10px"
}

}