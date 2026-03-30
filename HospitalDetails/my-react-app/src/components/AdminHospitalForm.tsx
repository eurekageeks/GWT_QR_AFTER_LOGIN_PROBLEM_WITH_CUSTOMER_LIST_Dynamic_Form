import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import doctorAvatar from "../assets/doctor-avatar.png";
const AdminHospitalForm = () => {
  const [activePanel, setActivePanel] = useState("basic");
  const navigate = useNavigate();
  const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  const [completed, setCompleted] = useState({
    basic: false,
    services: false,
    fees: false,
    contact: false,
  });
  const [doctorFiles, setDoctorFiles] = useState<File[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setDoctorFiles(Array.from(e.target.files));
  }
};
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const formDataToSend = new FormData();

    const hospitalPayload = {
      name: formData.name,
      category: formData.category,
      about: formData.about || null,
      address: formData.address || null,

      location:
        formData.lat && formData.lng
          ? {
              lat: Number(formData.lat),
              lng: Number(formData.lng),
            }
          : null,

      services: formData.services
        ? formData.services.split(",").map((s) => s.trim())
        : [],

      facilities: formData.facilities
        ? formData.facilities.split(",").map((f) => f.trim())
        : [],

      insurance_payment: formData.insurance_payment
        ? formData.insurance_payment.split(",").map((i) => i.trim())
        : [],

      consultation_fees: {
        opd: formData.opd ? Number(formData.opd) : null,
        emergency: formData.emergency ? Number(formData.emergency) : null,
        icu_per_day: formData.icu_per_day
          ? Number(formData.icu_per_day)
          : null,
      },

      timings: {
        open: formData.open || null,
        days: formData.days || null,
      },

      contact: {
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
      },

      doctors: doctors.map((doc) => ({
        name: doc.name,
        specialization: doc.specialization || null,
        experience_years: doc.experience_years
          ? Number(doc.experience_years)
          : null,
        images: [], // backend will fill this
      })),
    };

    // ✅ append JSON correctly
    formDataToSend.append(
      "hospital_json",
      JSON.stringify(hospitalPayload)
    );

    // ✅ append images correctly (IMPORTANT)
    doctors.forEach((doc) => {
      doc.images.forEach((file) => {
        formDataToSend.append("doctor_images", file);
      });
    });

    await API.post("/api/hospitals/", formDataToSend);

    alert("Hospital Created Successfully");
    navigate("/hospital-list");

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};
const [formData, setFormData] = useState({
    name: "",
    category: "Health & Medical",
    about: "",
    address: "",
    lat: "",
    lng: "",
    services: "",
    facilities: "",
    insurance_payment: "",
    opd: "",
    emergency: "",
    icu_per_day: "",
    open: "",
    days: "",
    phone: "",
    email: "",
    website: "",

    
  });

  const [doctors, setDoctors] = useState([
  {
    name: "",
    specialization: "",
    experience_years: "",
    images: [] as File[],
  },
]);

const handleDoctorChange = (
  index: number,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const updatedDoctors = [...doctors];
  updatedDoctors[index][e.target.name] = e.target.value;
  setDoctors(updatedDoctors);
};

const handleDoctorFileChange = (
  index: number,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (e.target.files) {
    const updatedDoctors = [...doctors];
    updatedDoctors[index].images = Array.from(e.target.files);
    setDoctors(updatedDoctors);
  }
};
const addDoctor = () => {
  setDoctors([
    ...doctors,
    { name: "", specialization: "", experience_years: "", images: [] },
  ]);
};

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSectionSave = (section: string, nextSection: string) => {
    setCompleted({ ...completed, [section]: true });
    setActivePanel(nextSection);
  };

  
   
 return (
  <div className="container mt-5 mb-5">
    <div className="card border-0 shadow-lg p-5 rounded-4">
      
      <div className="text-center mb-4">
        <h3 className="fw-bold">🏥 Create Hospital Profile</h3>
        <p className="text-muted">Fill details step-by-step</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="accordion" id="hospitalAccordion">

          {/* ========== 01 BASIC DETAILS ========== */}
          <div className="accordion-item border-0 mb-3 shadow-sm rounded-3">
            <h2 className="accordion-header">
              <button
                type="button"
                className={`accordion-button fw-semibold ${
                  activePanel !== "basic" ? "collapsed" : ""
                }`}
                onClick={() => setActivePanel("basic")}
              >
                <span className="me-3 badge bg-primary rounded-circle p-3">
                  01
                </span>
                Basic Details
                {completed.basic && (
                  <span className="badge bg-success ms-3">✔ Completed</span>
                )}
              </button>
            </h2>

            <div className={`accordion-collapse collapse ${activePanel === "basic" ? "show" : ""}`}>
              <div className="accordion-body">

                <input name="name" placeholder="Hospital Name"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="address" placeholder="Address"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <textarea name="about" placeholder="About Hospital"
                  className="form-control mb-3"
                  rows={3}
                  onChange={handleChange} />

                <div className="row">
                  <div className="col-md-6">
                    <input name="lat" placeholder="Latitude"
                      className="form-control mb-3"
                      onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <input name="lng" placeholder="Longitude"
                      className="form-control mb-3"
                      onChange={handleChange} />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={() => handleSectionSave("basic", "services")}
                >
                  Save & Continue →
                </button>

              </div>
            </div>
          </div>

          {/* ========== 02 SERVICES ========== */}
          <div className="accordion-item border-0 mb-3 shadow-sm rounded-3">
            <h2 className="accordion-header">
              <button
                type="button"
                className={`accordion-button fw-semibold ${
                  activePanel !== "services" ? "collapsed" : ""
                }`}
                onClick={() => setActivePanel("services")}
              >
                <span className="me-3 badge bg-success rounded-circle p-3">
                  02
                </span>
                Services & Facilities
                {completed.services && (
                  <span className="badge bg-success ms-3">✔ Completed</span>
                )}
              </button>
            </h2>

            <div className={`accordion-collapse collapse ${activePanel === "services" ? "show" : ""}`}>
              <div className="accordion-body">

                <input name="services"
                  placeholder="Services (comma separated)"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="facilities"
                  placeholder="Facilities (comma separated)"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="insurance_payment"
                  placeholder="Insurance & Payment"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={() => handleSectionSave("services", "fees")}
                >
                  Save & Continue →
                </button>

              </div>
            </div>
          </div>

          {/* ========== 03 FEES ========== */}
          <div className="accordion-item border-0 mb-3 shadow-sm rounded-3">
            <h2 className="accordion-header">
              <button
                type="button"
                className={`accordion-button fw-semibold ${
                  activePanel !== "fees" ? "collapsed" : ""
                }`}
                onClick={() => setActivePanel("fees")}
              >
                <span className="me-3 badge bg-warning text-dark rounded-circle p-3">
                  03
                </span>
                Fees & Timings
                {completed.fees && (
                  <span className="badge bg-success ms-3">✔ Completed</span>
                )}
              </button>
            </h2>

            <div className={`accordion-collapse collapse ${activePanel === "fees" ? "show" : ""}`}>
              <div className="accordion-body">

                <input name="opd" placeholder="OPD Fee"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="emergency" placeholder="Emergency Fee"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="icu_per_day" placeholder="ICU per Day"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="open" placeholder="Opening Time"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="days" placeholder="Working Days"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <button
                  type="button"
                  className="btn btn-warning text-dark px-4"
                  onClick={() => handleSectionSave("fees", "contact")}
                >
                  Save & Continue →
                </button>

              </div>
            </div>
          </div>
         {/* ========== 04 DOCTORS ========== */}
<div className="accordion-item border-0 mb-3 shadow-sm rounded-3">
  <h2 className="accordion-header">
    <button
      type="button"
      className={`accordion-button fw-semibold ${
        activePanel !== "doctors" ? "collapsed" : ""
      }`}
      onClick={() => setActivePanel("doctors")}
    >
      <span className="me-3 badge bg-secondary rounded-circle p-3">
        04
      </span>
      Doctors Information
    </button>
  </h2>

 <div className="accordion-body">

  {doctors.map((doctor, index) => (
    <div key={index} className="border rounded p-3 mb-4">

      <h6 className="fw-bold mb-3">
        Doctor {index + 1}
      </h6>

      <input
        name="name"
        placeholder="Doctor Name"
        className="form-control mb-3"
        value={doctor.name}
        onChange={(e) => handleDoctorChange(index, e)}
      />

      <input
        name="specialization"
        placeholder="Specialization"
        className="form-control mb-3"
        value={doctor.specialization}
        onChange={(e) => handleDoctorChange(index, e)}
      />

      <input
        name="experience_years"
        placeholder="Experience (Years)"
        className="form-control mb-3"
        value={doctor.experience_years}
        onChange={(e) => handleDoctorChange(index, e)}
      />
    <input
  type="file"
  accept="image/*"
  className="form-control mb-3"
  onChange={(e) => handleDoctorFileChange(index, e)}
/>
    

    </div>
  ))}

  {/* ➕ Add More Doctor Button */}
  <button
    type="button"
    className="btn btn-outline-primary"
    onClick={addDoctor}
  >
    ➕ Add Another Doctor
  </button>

</div>
          </div>
          {/* ========== 04 CONTACT ========== */}
          <div className="accordion-item border-0 shadow-sm rounded-3">
            <h2 className="accordion-header">
              <button
                type="button"
                className={`accordion-button fw-semibold ${
                  activePanel !== "contact" ? "collapsed" : ""
                }`}
                onClick={() => setActivePanel("contact")}
              >
                <span className="me-3 badge bg-info rounded-circle p-3">
                  04
                </span>
                Contact Information
                {completed.contact && (
                  <span className="badge bg-success ms-3">✔ Completed</span>
                )}
              </button>
            </h2>

            <div className={`accordion-collapse collapse ${activePanel === "contact" ? "show" : ""}`}>
              <div className="accordion-body">

                <input name="phone" placeholder="Phone"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="email" placeholder="Email"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <input name="website" placeholder="Website"
                  className="form-control mb-3"
                  onChange={handleChange} />

                <button type="submit" className="btn btn-success px-4">
                  🚀 Save Hospital
                </button>

              </div>
            </div>
          </div>

                  </div> 
        </form>
      </div> 
    </div> 
  );
};

export default AdminHospitalForm;