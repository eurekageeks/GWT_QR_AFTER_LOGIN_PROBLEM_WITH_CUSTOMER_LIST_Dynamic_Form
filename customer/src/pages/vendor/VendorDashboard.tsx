import { useState } from "react";
import axios from "axios";

export default function VendorProfile() {
  const [form, setForm] = useState({
    vendor_name: "",
    owner_name: "",
    business_type: "",
    gst_number: "",
    fssai_license: "",
    year_of_establishment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/vendor/profile",
        {
          ...form,
          year_of_establishment: form.year_of_establishment
            ? Number(form.year_of_establishment)
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Vendor details saved successfully");
    } catch (err: any) {
      alert(err.response?.data?.detail || "❌ Failed to save vendor details");
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xxl-10 col-xl-9 col-lg-10">
          <div className="card shadow-lg border-0 rounded-4">
            {/* Header */}
            <div className="card-header bg-success text-white py-4 rounded-top-4">
              <h2 className="mb-1 fw-bold">🏪 Vendor Business Details</h2>
              <p className="mb-0 fs-6">
                Fill in your business and registration information
              </p>
            </div>

            {/* Body */}
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Section */}
                <h4 className="text-success fw-semibold mb-4">
                  Basic Business Information
                </h4>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fs-6">
                      Restaurant / Vendor Name
                    </label>
                    <input
                      type="text"
                      name="vendor_name"
                      className="form-control form-control-lg"
                      placeholder="Eg: Food Plaza"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-6">
                      Owner / Manager Name
                    </label>
                    <input
                      type="text"
                      name="owner_name"
                      className="form-control form-control-lg"
                      placeholder="Eg: Kanishk Malhotra"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-6">
                      Business Type
                    </label>
                    <select
                      name="business_type"
                      className="form-select form-select-lg"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Business Type</option>
                      <option>Restaurant</option>
                      <option>Cafe</option>
                      <option>Food Stall</option>
                      <option>Cloud Kitchen</option>
                      <option>Bakery</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-6">
                      Year of Establishment
                    </label>
                    <input
                      type="number"
                      name="year_of_establishment"
                      className="form-control form-control-lg"
                      placeholder="Eg: 2019"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <hr className="my-5" />

                {/* Registration Section */}
                <h4 className="text-success fw-semibold mb-4">
                  Registration Details <span className="text-muted fs-6">(Optional)</span>
                </h4>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fs-6">GST Number</label>
                    <input
                      type="text"
                      name="gst_number"
                      className="form-control form-control-lg"
                      placeholder="27ABCDE1234F1Z5"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-6">
                      FSSAI License Number
                    </label>
                    <input
                      type="text"
                      name="fssai_license"
                      className="form-control form-control-lg"
                      placeholder="14-digit license number"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="d-flex justify-content-end mt-5">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg px-5"
                  >
                    💾 Save Vendor Details
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="card-footer text-center text-muted py-3">
              Your details will be reviewed by the admin before activation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
