import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";
import InfoIcon from "@mui/icons-material/Info";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ImageIcon from "@mui/icons-material/Image";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import dynamicApi from "../dynamic-api/dynamic-api";
import { Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import ClinicImagesForm from "../components/clinic-forms/ClinicImagesForm";
import Rating from "@mui/material/Rating";

export default function DynamicForm() {
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
const [successMsg, setSuccessMsg] = useState("");
 

  const steps = [
    "Basic Details",
    "Working Details",
    "Facilities",
    "Contact",
    "Upload Image",
    "Documents Required", 
  ];
  
const clinicServices = [
  "General Checkup",
  "Dental Treatment",
  "Skin Treatment",
  "Physiotherapy",
  "Vaccination",
  "Pathology",
  "Consultation",
  "Minor Procedures",
];
const facilitiesOptions = [
  "Waiting Area",
  "Parking",
  "Pharmacy",
  "Wheelchair Access",
  "AC Rooms",
  "Online Consultation",
];
const amenitiesOptions = [
  "Parking",
  "Pharmacy",
  "Ambulance",
  "Waiting Lounge",
  "Online Payment",
  "Wheelchair Access",
  "AC Rooms",
  "Lab Facility",
  "Digital Reports",
  "Sanitized Environment"
];

const [formData, setFormData] = useState<any>({
  services: [],
  facilities: [],
  doctor_names: [""],
  owner_names: [""],

  opening_time: "",
  closing_time: "",
  working_days: [],
  sunday_available: "",
  available_24x7: "",
  appointment_required: "",
  patient_reviews: [
      {
        
        comment: "",
        rating: 0,
        verified: true,
      },
    ],
});

const handleFileChange = (e: any, field: string) => {
  const files = e.target.files;

  setFormData((prev: any) => ({
    ...prev,
    [field]: files.length > 1 ? Array.from(files) : files[0],
  }));
};

const fileToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const validateStep = () => {
  // ===== STEP 0 =====
  if (activeStep === 0) {
    if (isClinic) {
      if (!formData.clinic_name) return "Clinic Name is required";
      if (!formData.clinic_type) return "Clinic Type is required";

      if (!formData.doctor_names?.some((d: string) => d.trim()))
        return "At least one Doctor is required";

      if (!formData.owner_names?.some((o: string) => o.trim()))
        return "At least one Owner is required";

      if (!formData.contact_person) return "Contact Person is required";
      if (!formData.mobile) return "Mobile Number is required";
      if (!formData.email) return "Email is required";
    } else {
      if (!formData.name) return "Name is required";
      if (!formData.description) return "Description is required";
    }
  }

  // ===== STEP 1 =====
  if (activeStep === 1) {
    if (!formData.opening_time) return "Opening Time is required";
    if (!formData.closing_time) return "Closing Time is required";
    if (!formData.working_days?.length) return "Select working days";
    if (!formData.sunday_available) return "Select Sunday availability";
    if (!formData.available_24x7) return "Select 24x7 availability";
    if (!formData.appointment_required) return "Select appointment requirement";
  }

  // ===== STEP 2 =====
  if (activeStep === 2) {
    if (!formData.facilities?.length) return "Select at least one facility";
  }

  // ===== STEP 3 =====
  if (activeStep === 3) {
    if (!formData.phone) return "Phone number is required";
    if (!formData.clinic_address) return "Address is required";
    if (!formData.city) return "City is required";
    if (!formData.state) return "State is required";
    if (!formData.pincode) return "Pincode is required";
  }

  // ===== STEP 4 =====
  if (activeStep === 4) {
    if (!formData.clinic_logo) return "Clinic logo is required";
    if (!formData.clinic_photos?.length) return "Upload clinic photos";
    if (!formData.doctor_photo) return "Doctor photo is required";
  }

  // STEP 5 → optional docs (skip validation)

  return null;
};

const handleAddField = (field: string) => {
  setFormData({
    ...formData,
    [field]: [...(formData[field] || []), ""],
  });
};
const handleRemoveField = (index: number, field: string) => {
  const updated = [...formData[field]];
  updated.splice(index, 1);

  setFormData({
    ...formData,
    [field]: updated.length ? updated : [""], // keep at least one field
  });
};

const getCategory = () => {
  if (user?.category) return user.category;

  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.category || "No Category";
    }
  } catch (e) {}

  return "No Category";
};

const getSubCategory = () => {
  if (user?.sub_category) return user.sub_category;

  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.sub_category || "No Subcategory";
    }
  } catch (e) {}

  return "No Subcategory";
};

// ✅ NOW safe to use

const subCategory = getSubCategory();

const isClinic = subCategory.toLowerCase().includes("clinic");


const [images, setImages] = useState<File[]>([]);
const [documents, setDocuments] = useState<File[]>([]);
const handleCheckboxChange = (name: string, value: string) => {
  const existing = formData[name] || [];

  if (existing.includes(value)) {
    setFormData({
      ...formData,
      [name]: existing.filter((v: string) => v !== value),
    });
  } else {
    setFormData({
      ...formData,
      [name]: [...existing, value],
    });
  }
};
  

  
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSaveDraft = async () => {
  const base64Images = await Promise.all(
    images.map((file) =>
      file instanceof File ? fileToBase64(file) : file
    )
  );

  const draft = {
    formData,
    images: base64Images, // ✅ store base64
    documents: [],
    category: getCategory(),
    sub_category: getSubCategory(),
  };

  localStorage.setItem("formDraft", JSON.stringify(draft));
  alert("Draft saved ✅");
};
const handleResetDraft = () => {
  localStorage.removeItem("formDraft");

  setFormData({
    services: [],
    facilities: [],
    doctor_names: [""],
    owner_names: [""],
    patient_reviews: [
      {
        comment: "",
        rating: 0,
        verified: true,
      },
    ],
  });

  setImages([]);
  setDocuments([]);
  setActiveStep(0);

  alert("Draft cleared ❌");
};
const initialFormData = {
  services: [],
  facilities: [],
  doctor_names: [""],
  owner_names: [""],
  patient_reviews: [
    {
      comment: "",
      rating: 0,
      verified: true,
    },
  ],
};
const resetForm = () => {
  setFormData(initialFormData);
  setImages([]);
  setDocuments([]);
  setDoctors([
    {
      name: "",
      email: "",
      mobile: "",
      address: "",
      qualification: "",
      specialization: "",
      experience: "",
      fee: "",
      available_days: [],
      photo: "",
      timings: {
        weekdays: { start: "", end: "" },
        saturday: { start: "", end: "" },
        sunday: { start: "", end: "" },
        emergency: false,
      },
    },
  ]);

  setActiveStep(0);

  // optional: clear local draft also
  localStorage.removeItem("formDraft");
};
useEffect(() => {
  const saved = localStorage.getItem("formDraft");

  if (saved) {
    const parsed = JSON.parse(saved);

    setFormData({
      services: [],
      facilities: [],
      doctor_names: [""],
      owner_names: [""],
      ...parsed.formData,
      patient_reviews:
        parsed.formData?.patient_reviews?.length > 0
          ? parsed.formData.patient_reviews
          : [
              {
                comment: "",
                rating: 0,
                verified: true,
              },
            ],
    });

    setImages(parsed.images || []); // ✅ base64 strings
    setDocuments([]);
  }
}, []);
  const handleNext = () => {
  const error = validateStep();

  if (error) {
    setErrorMsg(error);
    setOpenError(true);
    return;
  }

  setActiveStep((prev) => prev + 1);
};
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
 const handleMultipleImages = (e: any) => {
  const files = Array.from(e.target.files);
  setImages((prev) => [...prev, ...files]);
};


const handleDocuments = (e: any) => {
  setDocuments([...documents, ...Array.from(e.target.files)]);
};
const handleSubmit = async () => {
  try {
    const payload = new FormData();

    const data = {
      clinic_name: formData.clinic_name,
      clinic_type: formData.clinic_type,
      phone: formData.phone,
      email: formData.email,
      whatsapp: formData.whatsapp,
      website: formData.website,
      clinic_address: formData.clinic_address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      services: formData.services,
      amenities: formData.amenities,
      payment_methods: formData.payment_methods,
      insurance: formData.insurance,
      doctors: doctors,
      patient_reviews: formData.patient_reviews,
      about_clinic: formData.about_clinic,
      clinic_description: formData.clinic_description,
      specialization: formData.specialization,
      years_of_experience: formData.years_of_experience,
    };

    payload.append("category", getCategory());
    payload.append("sub_category", getSubCategory());
    payload.append("data", JSON.stringify(data));

    if (formData.clinic_logo instanceof File) {
      payload.append("image", formData.clinic_logo);
    }

    images.forEach((img) => {
      if (img instanceof File) {
        payload.append("images", img);
      }
    });

    await dynamicApi.post("/dynamic/business", payload);

    // ✅ SUCCESS POPUP
    setSuccessMsg("Form submitted successfully 🎉");
    setOpenSuccess(true);

    // ✅ RESET FORM AFTER SUCCESS
    resetForm();

  } catch (error) {
    console.error("Submit Error:", error);

    setErrorMsg("Submission failed ❌");
    setOpenError(true);
  }
};
  const handleReviewChange = (index: number, field: string, value: any) => {
  const updated = [...formData.patient_reviews];
  updated[index][field] = value;

  setFormData({
    ...formData,
    patient_reviews: updated,
  });
};

const addReview = () => {
  setFormData({
    ...formData,
    patient_reviews: [
      ...formData.patient_reviews,
      {
        
        comment: "",
        rating: 0,
        verified: false,
      },
    ],
  });
};

const removeReview = (index: number) => {
  const updated = [...formData.patient_reviews];
  updated.splice(index, 1);

  setFormData({
    ...formData,
    patient_reviews: updated,
  });
};
const [doctors, setDoctors] = useState([
  {
    name: "",
    email: "",
    mobile: "",
    address: "",
    qualification: "",
    specialization: "",
    experience: "",
    fee: "",
    available_days: [],
    photo: "",
    timings: {
      weekdays: { start: "", end: "" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
      emergency: false,
    },
  },
]);
const handleTimingChange = (
  index: number,
  day: string,
  field: string,
  value: any
) => {
  const updated = [...doctors];
  updated[index].timings[day][field] = value;
  setDoctors(updated);
};

const handleEmergencyToggle = (index: number) => {
  const updated = [...doctors];
  updated[index].timings.emergency =
    !updated[index].timings.emergency;
  setDoctors(updated);
};
const handleDoctorChange = (index: number, field: string, value: any) => {
  const updated = [...doctors];
  updated[index][field] = value;
  setDoctors(updated);
};
const addDoctor = () => {
  setDoctors([
    ...doctors,
    {
      name: "",
      email: "",
      mobile: "",
      address: "",
      qualification: "",
      specialization: "",
      experience: "",
      fee: "",
      available_days: "",
      photo: "",
    },
  ]);
};
const removeDoctor = (index: number) => {
  const updated = [...doctors];
  updated.splice(index, 1);
  setDoctors(updated);
};
const paymentOptions = [
  "Cash",
  "UPI",
  "Credit/Debit Card",
  "Net Banking",
];

const insuranceOptions = [
  "Max Bupa",
  "ICICI Lombard",
  "Star Health",
  "Mediclaim Accepted",
];
  return (
  <Box
    sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fce4ec, #e3f2fd)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 2,
    }}
  >
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        maxWidth: 900,
        p: 4,
        borderRadius: 4,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg, #e91e63, #9c27b0)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {getCategory()}
        </Typography>

        <Typography variant="body2">
          {getSubCategory()}
        </Typography>
      </Box>
<Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
  Upload Clinic Logo
</Typography>

<Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>

 <Button component="label" variant="outlined" fullWidth>
  Upload Logo
 <input
  hidden
  type="file"
  accept="image/*"
  onChange={(e: any) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        clinic_logo: file, // ✅ STORE FILE, NOT BASE64
      }));
    }
  }}
/>
</Button>
  {/* Preview */}
  {formData.clinic_logo && (
  <Box mt={2} textAlign="center">
    <img
      src={
        typeof formData.clinic_logo === "string"
          ? formData.clinic_logo
          : URL.createObjectURL(formData.clinic_logo)
      }
      alt="logo"
      style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10 }}
    />

    <Button
      color="error"
      onClick={() =>
        setFormData((prev: any) => ({
          ...prev,
          clinic_logo: null,
        }))
      }
    >
      Remove
    </Button>
  </Box>
)}
</Paper>
      

{/* ================= CLINIC IMAGES ================= */}

<Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
  Clinic Images
</Typography>

<Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>

  {/* Upload Button */}
  <Button
    component="label"
    variant="outlined"
    fullWidth
    sx={{ mb: 2 }}
  >
    Upload Clinic Images
    <input
      hidden
      multiple
      type="file"
      accept="image/*"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files) as File[];

        setImages((prev: any[]) => [...prev, ...files]); // ✅ supports File
      }}
    />
  </Button>

  {/* Image Preview Grid */}
  <Grid container spacing={2}>
    {images.map((img: any, index: number) => (
      <Grid size={{ xs: 6, md: 3 }} key={index}>
        <Paper sx={{ p: 1, borderRadius: 2 }}>

          <img
            src={
              typeof img === "string"
                ? img // ✅ base64 (after refresh)
                : URL.createObjectURL(img) // ✅ file (before save)
            }
            alt="clinic"
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
            }}
          />

          <Button
            color="error"
            fullWidth
            onClick={() => {
              const updated = [...images];
              updated.splice(index, 1);
              setImages(updated);
            }}
          >
            Remove
          </Button>

        </Paper>
      </Grid>
    ))}
  </Grid>

  {/* Add More Images */}
  {images.length > 0 && (
    <Button
      component="label"
      variant="contained"
      sx={{ mt: 2 }}
    >
      Add More Images
      <input
        hidden
        multiple
        type="file"
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;

          const files = Array.from(e.target.files) as File[];

          setImages((prev: any[]) => [...prev, ...files]);
        }}
      />
    </Button>
  )}

</Paper>
    {/* ================= ABOUT CLINIC ================= */}
<Paper
  elevation={3}
  sx={{
    mt: 4,
    p: 4,
    borderRadius: 4,
    backgroundColor: "#fafafa",
  }}
>
  {/* Header */}
  <Typography variant="h5" fontWeight="600" mb={1}>
    About Clinic
  </Typography>

  <Typography variant="body2" color="text.secondary" mb={3}>
    Provide basic information about your clinic
  </Typography>

  <Grid container spacing={3} direction="column">

    {/* About Clinic */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="About Clinic"
        name="about_clinic"
        value={formData.about_clinic || ""}
        onChange={handleChange}
        placeholder="Short introduction about clinic"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#fff",
          },
        }}
      />
    </Grid>

    {/* Clinic Description */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        multiline
        rows={8}
        label="Clinic Description"
        name="clinic_description"
        value={formData.clinic_description || ""}
        onChange={handleChange}
        placeholder="Describe clinic services, facilities, and specialties"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#fff",
          },
        }}
      />
    </Grid>

    {/* Specialization */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Specialization"
        name="specialization"
        value={formData.specialization || ""}
        onChange={handleChange}
        placeholder="Dental, Skin, Eye, etc."
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#fff",
          },
        }}
      />
    </Grid>

    {/* Years of Experience */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        type="number"
        label="Years of Experience"
        name="years_of_experience"
        value={formData.years_of_experience || ""}
        onChange={handleChange}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#fff",
          },
        }}
      />
    </Grid>

  </Grid>
</Paper>
{/* ================= DOCTORS SECTION ================= */}

<Paper
  elevation={3}
  sx={{
    mt: 4,
    p: 4,
    borderRadius: 4,
    backgroundColor: "#fafafa",
  }}
>
  {/* Header */}
  <Typography variant="h5" fontWeight="600" mb={1}>
    Doctors
  </Typography>

  <Typography variant="body2" color="text.secondary" mb={3}>
    Add doctor details for your clinic
  </Typography>

  {doctors.map((doc: any, index: number) => (
    <Paper
      key={index}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        backgroundColor: "#fff",
        border: "1px solid #eee",
      }}
    >
      <Grid container spacing={3} direction="column">

        {/* Doctor Photo */}
        <Grid item xs={12}>
          <Button component="label" variant="outlined" fullWidth>
            Upload Doctor Photo
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e: any) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleDoctorChange(index, "photo", reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Button>

          {doc.photo && (
            <Box mt={2} textAlign="center">
              <img
                src={doc.photo}
                alt="doctor"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            </Box>
          )}
        </Grid>

        {/* Doctor Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Doctor Name"
            value={doc.name}
            onChange={(e) =>
              handleDoctorChange(index, "name", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email ID"
            value={doc.email}
            onChange={(e) =>
              handleDoctorChange(index, "email", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mobile No"
            value={doc.mobile}
            onChange={(e) =>
              handleDoctorChange(index, "mobile", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

        {/* Address (Big Field) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Address"
            value={doc.address}
            onChange={(e) =>
              handleDoctorChange(index, "address", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

        {/* Qualification */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Qualification"
            value={doc.qualification}
            onChange={(e) =>
              handleDoctorChange(index, "qualification", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

        {/* Specialization */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Specialization"
            value={doc.specialization}
            onChange={(e) =>
              handleDoctorChange(index, "specialization", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

        {/* Experience */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Experience (Years)"
            value={doc.experience}
            onChange={(e) =>
              handleDoctorChange(index, "experience", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

        {/* Fee */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Consultation Fee"
            value={doc.fee}
            onChange={(e) =>
              handleDoctorChange(index, "fee", e.target.value)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
          />
        </Grid>

    {/* Available Days */}
    <Grid item xs={12}>
      <Select
        multiple
        fullWidth
        value={doc.available_days || []}
        onChange={(e) =>
          handleDoctorChange(index, "available_days", e.target.value)
        }
        displayEmpty
        sx={{ borderRadius: 2, background: "#fff" }}
        renderValue={(selected: any) =>
          selected.length
            ? selected.join(", ")
            : "Select Available Days"
        }
      >
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <MenuItem key={day} value={day}>
            <Checkbox checked={doc.available_days?.includes(day)} />
            <ListItemText primary={day} />
          </MenuItem>
        ))}
      </Select>
    </Grid>

    {/* ================= TIMINGS ================= */}
    <Grid item xs={12}>
      <Typography fontWeight="600" mb={2}>
        Available Timings
      </Typography>

      {/* Weekdays */}
      <Typography fontWeight="500">Mon - Fri</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="time"
          fullWidth
          label="Start Time"
          value={doc.timings.weekdays.start}
          onChange={(e) =>
            handleTimingChange(index, "weekdays", "start", e.target.value)
          }
        />
        <TextField
          type="time"
          fullWidth
          label="End Time"
          value={doc.timings.weekdays.end}
          onChange={(e) =>
            handleTimingChange(index, "weekdays", "end", e.target.value)
          }
        />
      </Box>

      {/* Saturday */}
      <Typography fontWeight="500">Saturday</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="time"
          fullWidth
          label="Start Time"
          value={doc.timings.saturday.start}
          onChange={(e) =>
            handleTimingChange(index, "saturday", "start", e.target.value)
          }
        />
        <TextField
          type="time"
          fullWidth
          label="End Time"
          value={doc.timings.saturday.end}
          onChange={(e) =>
            handleTimingChange(index, "saturday", "end", e.target.value)
          }
        />
      </Box>

      {/* Sunday */}
      <Typography fontWeight="500">Sunday</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="time"
          fullWidth
          label="Start Time"
          value={doc.timings.sunday.start}
          onChange={(e) =>
            handleTimingChange(index, "sunday", "start", e.target.value)
          }
        />
        <TextField
          type="time"
          fullWidth
          label="End Time"
          value={doc.timings.sunday.end}
          onChange={(e) =>
            handleTimingChange(index, "sunday", "end", e.target.value)
          }
        />
      </Box>

      {/* Emergency */}
      <Box mt={2}>
        <Button
          variant={doc.timings.emergency ? "contained" : "outlined"}
          color="error"
          onClick={() => handleEmergencyToggle(index)}
        >
          {doc.timings.emergency
            ? "Emergency Available"
            : "Enable Emergency"}
        </Button>
      </Box>
    </Grid>

    {/* Remove Doctor */}
    <Grid item xs={12}>
      <Button
        color="error"
        variant="outlined"
        fullWidth
        onClick={() => removeDoctor(index)}
      >
        Remove Doctor
      </Button>
    </Grid>

      </Grid>
    </Paper>
  ))}

  {/* Add Doctor Button */}
  <Button variant="contained" onClick={addDoctor}>
    Add Doctor
  </Button>
</Paper>
   
{/* ================= CONSULTATION FEES ================= */}

<Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
  Consultation Fees
</Typography>

<TextField
  fullWidth
  label="Consultation Fees"
  name="consultation_fees"
  value={formData.consultation_fees || ""}
  onChange={handleChange}
/>
<Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
  Facilities & Amenities
</Typography>

<Select
  multiple
  fullWidth
  value={formData.amenities || []}
  onChange={(e) =>
    setFormData({
      ...formData,
      amenities: e.target.value,
    })
  }
>
  {amenitiesOptions.map((item) => (
    <MenuItem key={item} value={item}>
      <Checkbox checked={formData.amenities?.includes(item)} />
      <ListItemText primary={item} />
    </MenuItem>
  ))}
</Select>
{/* ================= CONTACT INFORMATION ================= */}

<Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
  Contact Information
</Typography>

<Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>
  <Grid container spacing={3} direction="column">

    {/* Phone Number */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Phone Number"
        name="phone"
        value={formData.phone || ""}
        onChange={handleChange}
      />
    </Grid>

    {/* WhatsApp Number */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="WhatsApp Number"
        name="whatsapp"
        value={formData.whatsapp || ""}
        onChange={handleChange}
      />
    </Grid>

    {/* Email */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email || ""}
        onChange={handleChange}
      />
    </Grid>

    {/* Website */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Website"
        name="website"
        value={formData.website || ""}
        onChange={handleChange}
      />
    </Grid>

    {/* Address */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Address"
        name="clinic_address"
        value={formData.clinic_address || ""}
        onChange={handleChange}
      />
    </Grid>

    {/* Google Map Location */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Google Map Location (URL)"
        name="map_location"
        value={formData.map_location || ""}
        onChange={handleChange}
        placeholder="Paste Google Maps link"
      />
    </Grid>

    {/* Get Direction Button */}
    {formData.map_location && (
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          href={formData.map_location}
          target="_blank"
        >
          Get Directions
        </Button>
      </Grid>
    )}

  </Grid>
</Paper>
{/* ================= INSURANCE & PAYMENTS ================= */}

<Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
  Insurance & Payments
</Typography>

<Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>

  {/* Payment Methods */}
  <Typography fontWeight="600" mb={1}>
    Payment Methods
  </Typography>

  <Select
    multiple
    fullWidth
    value={formData.payment_methods || []}
    onChange={(e) =>
      setFormData({
        ...formData,
        payment_methods: e.target.value,
      })
    }
    renderValue={(selected: any) =>
      selected.length ? selected.join(", ") : "Select Payment Methods"
    }
    sx={{ mb: 3 }}
  >
    {paymentOptions.map((item) => (
      <MenuItem key={item} value={item}>
        <Checkbox checked={formData.payment_methods?.includes(item)} />
        <ListItemText primary={item} />
      </MenuItem>
    ))}
  </Select>

  {/* Insurance Options */}
  <Typography fontWeight="600" mb={1}>
    Insurance Accepted
  </Typography>

  <Select
    multiple
    fullWidth
    value={formData.insurance || []}
    onChange={(e) =>
      setFormData({
        ...formData,
        insurance: e.target.value,
      })
    }
    renderValue={(selected: any) =>
      selected.length ? selected.join(", ") : "Select Insurance"
    }
  >
    {insuranceOptions.map((item) => (
      <MenuItem key={item} value={item}>
        <Checkbox checked={formData.insurance?.includes(item)} />
        <ListItemText primary={item} />
      </MenuItem>
    ))}
  </Select>

</Paper>
      {/* ================= ACTION BUTTONS ================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 4,
          pt: 2,
          borderTop: "1px solid #eee",
        }}
      >
        <Button variant="outlined" onClick={handleSaveDraft}>
          Save Draft
        </Button>

        <Button variant="outlined" color="error" onClick={handleResetDraft}>
          Reset Draft
        </Button>

        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>

    </Paper>
    <Snackbar
  open={openSuccess}
  autoHideDuration={3000}
  onClose={() => setOpenSuccess(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert
    onClose={() => setOpenSuccess(false)}
    severity="success"
    variant="filled"
    sx={{ width: "100%" }}
  >
    {successMsg}
  </Alert>
</Snackbar>
  </Box>
  );
  };