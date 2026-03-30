import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

export default function VendorList() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${API_URL}/vendor/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVendors(res.data);
      } catch (err) {
        console.error("Failed to fetch vendors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [token]);

  if (loading) {
    return <p className="text-center">Loading vendors...</p>;
  }

  return (
    <div className="card shadow rounded-4">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">🏪 Vendor List</h4>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Vendor Name</th>
              <th>Owner Name</th>
              <th>Business Type</th>
              <th>Year</th>
              <th>GST</th>
              <th>FSSAI</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((v, i) => (
              <tr key={v._id}>
                <td>{i + 1}</td>
                <td>{v.vendor_name}</td>
                <td>{v.owner_name}</td>
                <td>{v.business_type}</td>
                <td>{v.year_of_establishment || "-"}</td>
                <td>{v.gst_number || "-"}</td>
                <td>{v.fssai_license || "-"}</td>
                <td>{v.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
