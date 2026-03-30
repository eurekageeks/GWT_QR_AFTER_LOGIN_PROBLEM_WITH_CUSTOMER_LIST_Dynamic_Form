import { useEffect, useState } from "react";
import api from "../vendor-api/vendor-api";
import { useNavigate } from "react-router-dom";

export default function VendorList() {

const [page, setPage] = useState(1);
const [vendors, setVendors] = useState<any[]>([]);
const [search, setSearch] = useState("");
const [vendorsPerPage, setVendorsPerPage] = useState(10);

const filteredVendors = vendors.filter((v) =>
  v.email.toLowerCase().includes(search.toLowerCase()) ||
  v.mobile.includes(search) ||
  (v.category_name || "").toLowerCase().includes(search.toLowerCase()) ||
  (v.sub_category_name || "").toLowerCase().includes(search.toLowerCase())
);

const startIndex = (page - 1) * vendorsPerPage;

const paginatedVendors = filteredVendors.slice(
  startIndex,
  startIndex + vendorsPerPage
);

const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

useEffect(() => {
  setPage(1);
}, [search, vendorsPerPage]);

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
    alert("Please select vendors to delete");
    return;
  }

  if (!window.confirm("Delete selected vendors?")) return;

  try {

    await Promise.all(
      selected.map((id) => api.delete(`/auth/vendor/${id}`))
    );

    setSelected([]);
    fetchVendors();

  } catch (err) {
    console.error(err);
  }

};

useEffect(() => {
  fetchVendors();
}, []);

const fetchVendors = async () => {
  try {
    const res = await api.get("/auth/vendors");
    setVendors(res.data);
  } catch (err) {
    console.error(err);
  }
};

const navigate = useNavigate();

const deleteVendor = async (id: string) => {

  if (!window.confirm("Are you sure you want to delete this vendor?")) return;

  try {
    await api.delete(`/auth/vendor/${id}`);
    fetchVendors();
  } catch (err) {
    console.error(err);
  }

};

const editVendor = (id: string) => {
  navigate(`/dashboard/admin/editvendor/${id}`);
};

const viewVendor = (id: string) => {
  navigate(`/dashboard/admin/viewvendor/${id}`);
};

return (

<div style={styles.page}>

<div style={styles.card}>

<h2 style={styles.title}>Service Providers List</h2>

<button
style={styles.deleteBtn}
onClick={deleteSelected}
>
Delete Selected
</button>

<div style={styles.topControls}>

<input
type="text"
placeholder="Search vendors..."
value={search}
onChange={(e) => {
setSearch(e.target.value);
setPage(1);
}}
style={styles.searchInput}
/>

<select
value={vendorsPerPage}
onChange={(e) => {
setVendorsPerPage(Number(e.target.value));
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
<th style={styles.th}>Category</th>
<th style={styles.th}>Sub Category</th>
<th style={styles.th}>Actions</th>
</tr>

</thead>

<tbody>

{paginatedVendors.map((v, index) => (

<tr key={v.id} style={styles.row}>

<td style={styles.td}>
{(page - 1) * vendorsPerPage + index + 1}
</td>

<td style={styles.td}>
<input
type="checkbox"
checked={selected.includes(v.id)}
onChange={() => toggleSelect(v.id)}
/>
</td>

<td style={styles.td}>{v.email}</td>

<td style={styles.td}>{v.mobile}</td>

<td style={styles.td}>
{v.category_name ? (
<span style={styles.badgePink}>{v.category_name}</span>
) : (
<span style={styles.badgeGray}>N/A</span>
)}
</td>

<td style={styles.td}>
{v.sub_category_name ? (
<span style={styles.badgePurple}>{v.sub_category_name}</span>
) : (
<span style={styles.badgeGray}>N/A</span>
)}
</td>

<td style={styles.td}>

<button
style={styles.viewBtn}
onClick={() => viewVendor(v.id)}
>
View
</button>

<button
style={styles.editBtn}
onClick={() => editVendor(v.id)}
>
Edit
</button>

<button
style={styles.deleteRowBtn}
onClick={() => deleteVendor(v.id)}
>
Delete
</button>

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

badgePink:{
background:"#ff4d94",
color:"white",
padding:"6px 10px",
borderRadius:"20px",
fontSize:"12px"
},

badgePurple:{
background:"#a855f7",
color:"white",
padding:"6px 10px",
borderRadius:"20px",
fontSize:"12px"
},

badgeGray:{
background:"#9ca3af",
color:"white",
padding:"6px 10px",
borderRadius:"20px",
fontSize:"12px"
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
}

};