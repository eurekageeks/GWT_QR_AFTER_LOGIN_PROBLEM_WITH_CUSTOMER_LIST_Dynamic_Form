import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ width: 200, padding: 20, borderRight: "1px solid #ccc" }}>
      <h3>Admin</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/add-category">Add Category</Link></li>
        <li><Link to="/add-sub-category">Add Sub Category</Link></li>
        <li><Link to="/add-business">Add Business</Link></li>

        {/* ✅ NEW */}
        <li style={{ marginTop: "10px" }}>
          <Link to="/frontend">Frontend (Businesses)</Link>
        </li>
      </ul>
    </div>
  );
}
