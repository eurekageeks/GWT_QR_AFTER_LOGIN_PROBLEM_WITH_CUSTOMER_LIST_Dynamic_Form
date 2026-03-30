import { useEffect, useState } from "react";
import api from "../vendor-api/vendor-api";
import { useNavigate } from "react-router-dom";
export default function CustomerList() {

const [page, setPage] = useState(1);
const [customers, setCustomers] = useState<any[]>([]);
const [search, setSearch] = useState("");
const [customersPerPage, setCustomersPerPage] = useState(10);

const filteredCustomers = customers.filter((c) =>
  c.email.toLowerCase().includes(search.toLowerCase()) ||
  c.mobile.includes(search)
);

const startIndex = (page - 1) * customersPerPage;

const paginatedCustomers = filteredCustomers.slice(
  startIndex,
  startIndex + customersPerPage
);

const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

useEffect(() => {
  setPage(1);
}, [search, customersPerPage]);

const [selected, setSelected] = useState<string[]>([]);

const toggleSelect = (id: string) => {
  if (selected.includes(id)) {
    setSelected(selected.filter((v) => v !== id));
  } else {
    setSelected([...selected, id]);
  }
};

const deleteSelected = async () => {

  if (selected.length === 0) {
    alert("Please select customers to delete");
    return;
  }

  if (!window.confirm("Delete selected customers?")) return;

  try {

    await Promise.all(
      selected.map((id) => api.delete(`/auth/customer/${id}`))
    );

    setSelected([]);
    fetchCustomers();

  } catch (err) {
    console.error(err);
  }

};

useEffect(() => {
  fetchCustomers();
}, []);

const fetchCustomers = async () => {
  try {
    const res = await api.get("/auth/customers");
    setCustomers(res.data);
  } catch (err) {
    console.error(err);
  }
};
const navigate = useNavigate();

const editCustomer = (id: string) => {
  navigate(`/dashboard/admin/editcustomer/${id}`);
};

const viewCustomer = (id: string) => {
  navigate(`/dashboard/admin/viewcustomer/${id}`);
};
const deleteCustomer = async (id: string) => {

  if (!window.confirm("Are you sure you want to delete this customer?")) return;

  try {
    await api.delete(`/auth/customer/${id}`);
    fetchCustomers();
  } catch (err) {
    console.error(err);
  }

};

return (

<div style={styles.page}>

<div style={styles.card}>

<h2 style={styles.title}>Customer List</h2>

<button
style={styles.deleteBtn}
onClick={deleteSelected}
>
Delete Selected
</button>

<div style={styles.topControls}>

<input
type="text"
placeholder="Search customers..."
value={search}
onChange={(e) => {
setSearch(e.target.value);
setPage(1);
}}
style={styles.searchInput}
/>

<select
value={customersPerPage}
onChange={(e) => {
setCustomersPerPage(Number(e.target.value));
setPage(1);
}}
style={styles.select}
>
<option value={10}>10</option>
<option value={50}>50</option>
<option value={100}>100</option>
</select>

</div>

<div style={styles.tableWrapper}>

<table style={styles.table}>

<thead>

<tr style={styles.headerRow}>
<th style={styles.th}>S.No</th>
<th style={styles.th}></th>
<th style={styles.th}>Email</th>
<th style={styles.th}>Mobile</th>
<th style={styles.th}>Password</th>
<th style={styles.th}>Actions</th>
</tr>

</thead>

<tbody>

{paginatedCustomers.map((c, index) => (

<tr key={c.id} style={styles.row}>

<td style={styles.td}>
{(page - 1) * customersPerPage + index + 1}
</td>

<td style={styles.td}>
<input
type="checkbox"
checked={selected.includes(c.id)}
onChange={() => toggleSelect(c.id)}
/>
</td>

<td style={styles.td}>{c.email}</td>

<td style={styles.td}>{c.mobile}</td>

<td style={styles.td}>
{c.password ? c.password.substring(0, 20) + "..." : ""}
</td>

<td style={styles.td}>

<td style={styles.td}>

<button
style={styles.viewBtn}
onClick={() => viewCustomer(c.id)}
>
View
</button>

<button
style={styles.editBtn}
onClick={() => editCustomer(c.id)}
>
Edit
</button>

<button
style={styles.deleteRowBtn}
onClick={() => deleteCustomer(c.id)}
>
Delete
</button>

</td>

</td>

</tr>

))}

</tbody>

</table>

</div>

<div style={styles.pagination}>

<button
style={styles.pageBtn}
disabled={page === 1}
onClick={() => setPage(page - 1)}
>
Previous
</button>

<span style={styles.pageText}>
Page {page} of {totalPages}
</span>

<button
style={styles.pageBtn}
disabled={page === totalPages}
onClick={() => setPage(page + 1)}
>
Next
</button>

</div>

</div>

</div>

);

}

const styles:any = {

page:{
minHeight:"100vh",
background:"linear-gradient(135deg,#ff9a9e,#fad0c4)",
display:"flex",
justifyContent:"center",
alignItems:"flex-start",
padding:"20px"
},

card:{
background:"white",
borderRadius:"14px",
padding:"25px",
width:"100%",
maxWidth:"1100px",
boxShadow:"0 15px 40px rgba(0,0,0,0.15)"
},

title:{
textAlign:"center",
marginBottom:"20px",
fontSize:"26px",
fontWeight:"bold",
color:"#d63384"
},

topControls:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
gap:"10px",
flexWrap:"wrap",
marginBottom:"15px"
},

searchInput:{
padding:"10px",
minWidth:"220px",
borderRadius:"8px",
border:"1px solid #ddd",
outline:"none",
fontSize:"14px"
},

select:{
padding:"10px",
borderRadius:"8px",
border:"1px solid #ddd",
fontSize:"14px",
cursor:"pointer"
},

tableWrapper:{
width:"100%",
overflowX:"auto"
},

table:{
width:"100%",
borderCollapse:"collapse",
minWidth:"750px"
},

headerRow:{
background:"#ff4d94",
color:"white"
},

th:{
padding:"14px",
textAlign:"left",
fontSize:"15px"
},

row:{
borderBottom:"1px solid #eee"
},

td:{
padding:"14px",
fontSize:"14px"
},

deleteRowBtn:{
background:"#ef4444",
color:"white",
border:"none",
padding:"6px 12px",
borderRadius:"6px",
cursor:"pointer"
},

deleteBtn:{
background:"#ff4d94",
color:"white",
border:"none",
padding:"10px 16px",
borderRadius:"8px",
cursor:"pointer",
marginBottom:"15px"
},

pagination:{
marginTop:"20px",
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:"10px",
flexWrap:"wrap"
},

pageBtn:{
padding:"8px 14px",
background:"#ff4d94",
color:"white",
border:"none",
borderRadius:"6px",
cursor:"pointer"
},

pageText:{
fontWeight:"500"
},

viewBtn:{
background:"#22c55e",
color:"white",
border:"none",
padding:"6px 12px",
marginRight:"6px",
borderRadius:"6px",
cursor:"pointer"
},

editBtn:{
background:"#3b82f6",
color:"white",
border:"none",
padding:"6px 12px",
marginRight:"6px",
borderRadius:"6px",
cursor:"pointer"
},
};