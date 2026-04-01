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


export default function DynamicForm() {
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  
 

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
});
const handleFileChange = (e: any, field: string) => {
  const files = e.target.files;

  setFormData((prev: any) => ({
    ...prev,
    [field]: files.length > 1 ? Array.from(files) : files[0],
  }));
};
const handleResetDraft = () => {
  localStorage.removeItem("formDraft");

  setFormData({
    services: [],
    facilities: [],
    doctor_names: [""],
    owner_names: [""],
  });

  setImages([]);
  setDocuments([]);
  setActiveStep(0);

  alert("Draft cleared ❌");
};
const handleArrayChange = (index: number, value: string, field: string) => {
  const updated = [...formData[field]];
  updated[index] = value;

  setFormData({
    ...formData,
    [field]: updated,
  });
};

const [errorMsg, setErrorMsg] = useState("");
const [openError, setOpenError] = useState(false);
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

 const handleSaveDraft = () => {
  const draft = {
    formData,
    images,
    documents,
    category: getCategory(),
    sub_category: getSubCategory(),
  };

  localStorage.setItem("formDraft", JSON.stringify(draft));
  alert("Draft saved ✅");
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
      ...parsed.formData, // ✅ overwrite if exists
    });

    setImages(parsed.images || []);
    setDocuments(parsed.documents || []);
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
  setImages([...images, ...Array.from(e.target.files)]);
};


const handleDocuments = (e: any) => {
  setDocuments([...documents, ...Array.from(e.target.files)]);
};
  const handleSubmit = async () => {
  const payload = new FormData();

  payload.append("category", getCategory());
  payload.append("sub_category", getSubCategory());
  payload.append("data", JSON.stringify(formData));

  images.forEach((img) => payload.append("images", img));
  documents.forEach((doc) => payload.append("documents", doc));

  try {
    await dynamicApi.post("/dynamic/business", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Saved successfully ✅");

    setFormData({ services: [], facilities: [] });
    setImages([]);
    setDocuments([]);
    setActiveStep(0);

  } catch (err) {
    console.error(err);
    alert("Error saving data ❌");
  }
};

  const renderStepContent = () => {
  switch (activeStep) {

  case 0:
  return (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        display="flex"
        alignItems="center"
      >
        <InfoIcon sx={{ color: "#e91e63", mr: 1 }} />
        Basic Information
      </Typography>

      <Grid container spacing={3}>

        {/* ================= CLINIC ================= */}
        {isClinic && (
          <>
            {/* ===== Clinic Details ===== */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Clinic Details
                </Typography>

                {/* Clinic Name */}
                <Grid container spacing={2} alignItems="center" mb={1}>
                  <Grid item xs={4}>
                    <Typography>Clinic Name</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      size="small"
                      name="clinic_name"
                      value={formData.clinic_name || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                {/* Clinic Type */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography>Clinic Type</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Select
                      fullWidth
                      size="small"
                      name="clinic_type"
                      value={formData.clinic_type || ""}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Dental">Dental</MenuItem>
                      <MenuItem value="Eye">Eye</MenuItem>
                      <MenuItem value="Skin">Skin</MenuItem>
                      <MenuItem value="General Physician">General Physician</MenuItem>
                      <MenuItem value="Physiotherapy">Physiotherapy</MenuItem>
                      <MenuItem value="Ayurveda">Ayurveda</MenuItem>
                      <MenuItem value="Homeopathy">Homeopathy</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Snackbar
  open={openError}
  autoHideDuration={3000}
  onClose={() => setOpenError(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert severity="error" variant="filled">
    {errorMsg}
  </Alert>
</Snackbar>
              </Paper>
            </Grid>

            {/* ===== Doctor List ===== */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Doctor List
                </Typography>

                {(formData.doctor_names || []).map((doc, index) => (
                  <Grid container spacing={2} alignItems="center" key={index} mb={1}>
                    
                    <Grid item xs={4}>
                      <Typography>Doctor {index + 1}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        value={doc}
                        onChange={(e) =>
                          handleArrayChange(index, e.target.value, "doctor_names")
                        }
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <Button
                        fullWidth
                        color="error"
                        variant="outlined"
                        onClick={() =>
                          handleRemoveField(index, "doctor_names")
                        }
                      >
                        X
                      </Button>
                    </Grid>

                  </Grid>
                ))}

                <Button
                  variant="contained"
                  sx={{ mt: 1, background: "#e91e63" }}
                  onClick={() => handleAddField("doctor_names")}
                >
                  + Add Doctor
                </Button>
              </Paper>
            </Grid>

            {/* ===== Owner List ===== */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Owner List
                </Typography>

                {(formData.owner_names || []).map((owner, index) => (
                  <Grid container spacing={2} alignItems="center" key={index} mb={1}>
                    
                    <Grid item xs={4}>
                      <Typography>Owner {index + 1}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        value={owner}
                        onChange={(e) =>
                          handleArrayChange(index, e.target.value, "owner_names")
                        }
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <Button
                        fullWidth
                        color="error"
                        variant="outlined"
                        onClick={() =>
                          handleRemoveField(index, "owner_names")
                        }
                      >
                        X
                      </Button>
                    </Grid>

                  </Grid>
                ))}

                <Button
                  variant="contained"
                  sx={{ mt: 1, background: "#e91e63" }}
                  onClick={() => handleAddField("owner_names")}
                >
                  + Add Owner
                </Button>
              </Paper>
            </Grid>

            {/* ===== Contact ===== */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Contact Details
                </Typography>

                {[
                  { label: "Contact Person", name: "contact_person" },
                  { label: "Mobile Number", name: "mobile" },
                  { label: "Alternate Mobile", name: "alternate_mobile" },
                  { label: "Email", name: "email" },
                ].map((field) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    key={field.name}
                    mb={1}
                  >
                    <Grid item xs={4}>
                      <Typography>{field.label}</Typography>
                    </Grid>

                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        size="small"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Paper>
            </Grid>
          </>
        )}

        {/* ===== DEFAULT ===== */}
        {!isClinic && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography fontWeight="bold" mb={2} color="#e91e63">
                Basic Details
              </Typography>

              {[
                { label: "Name", name: "name" },
                { label: "Description", name: "description" },
              ].map((field) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={field.name}
                  mb={1}
                >
                  <Grid item xs={4}>
                    <Typography>{field.label}</Typography>
                  </Grid>

                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      size="small"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              ))}
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
 case 1:
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        display="flex"
        alignItems="center"
      >
        <LocalHospitalIcon sx={{ color: "#e91e63", mr: 1 }} />
        Working Details
      </Typography>

      <Grid container spacing={2}>

        {/* Opening Time */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Opening Time"
            name="opening_time"
            type="time"
            value={formData.opening_time || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Closing Time */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Closing Time"
            name="closing_time"
            type="time"
            value={formData.closing_time || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Working Days */}
        <Grid item xs={12}>
          <Select
            multiple
            fullWidth
            displayEmpty
            value={formData.working_days || []}
            onChange={(e) =>
              setFormData({
                ...formData,
                working_days: e.target.value,
              })
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
                <Checkbox
                  checked={formData.working_days?.includes(day)}
                />
                <ListItemText primary={day} />
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Sunday Available */}
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            displayEmpty
            name="sunday_available"
            value={formData.sunday_available || ""}
            onChange={handleChange}
          >
            <MenuItem value="">Sunday Available?</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </Grid>

        {/* 24x7 Available */}
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            displayEmpty
            name="available_24x7"
            value={formData.available_24x7 || ""}
            onChange={handleChange}
          >
            <MenuItem value="">24x7 Available?</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </Grid>

        {/* Appointment Required */}
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            displayEmpty
            name="appointment_required"
            value={formData.appointment_required || ""}
            onChange={handleChange}
          >
            <MenuItem value="">Appointment Required?</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </Grid>

      </Grid>
    </Box>
  );
   case 2:
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center">
        <LocalHospitalIcon sx={{ color: "#e91e63", mr: 1 }} />
        Facilities
      </Typography>

      <Select
        multiple
        fullWidth
        value={formData.facilities || []}
        onChange={(e) =>
          setFormData({
            ...formData,
            facilities: e.target.value as string[],
          })
        }
        displayEmpty
        sx={{
          background: "#fff",
          borderRadius: 2,
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {(selected as string[]).map((value) => (
              <Box
                key={value}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  background: "#e91e63",
                  color: "#fff",
                  fontSize: 12,
                }}
              >
                {value}
              </Box>
            ))}
          </Box>
        )}
      >
        {facilitiesOptions.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={formData.facilities?.includes(name)} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
   case 3:
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        display="flex"
        alignItems="center"
      >
        <ContactPhoneIcon sx={{ color: "#e91e63", mr: 1 }} />
        Contact & Location Details
      </Typography>

      <Grid container spacing={2}>
        {/* PHONE */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        {/* CLINIC ADDRESS */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Clinic Address"
            name="clinic_address"
            value={formData.clinic_address || ""}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        {/* AREA */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Area / Locality"
            name="area"
            value={formData.area || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* CITY */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* STATE */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* PINCODE */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={formData.pincode || ""}
            onChange={handleChange}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>

        {/* LANDMARK */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Landmark"
            name="landmark"
            value={formData.landmark || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* LATITUDE */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Latitude"
            name="latitude"
            value={formData.latitude || ""}
            onChange={handleChange}
            placeholder="e.g. 28.6139"
          />
        </Grid>

        {/* LONGITUDE */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Longitude"
            name="longitude"
            value={formData.longitude || ""}
            onChange={handleChange}
            placeholder="e.g. 77.2090"
          />
        </Grid>
      </Grid>
    </Box>
  );
   case 4:
  return (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        display="flex"
        alignItems="center"
      >
        📁 Media Upload
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>

            {/* ===== Clinic Logo ===== */}
            <Grid container spacing={2} alignItems="center" mb={2}>
              <Grid item xs={4}>
                <Typography>Clinic Logo</Typography>
              </Grid>
              <Grid item xs={8}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e, "clinic_logo")
                    }
                  />
                </Button>
              </Grid>
            </Grid>

            {/* ===== Clinic Photos ===== */}
            <Grid container spacing={2} alignItems="center" mb={2}>
              <Grid item xs={4}>
                <Typography>Clinic Photos</Typography>
              </Grid>
              <Grid item xs={8}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Photos
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e, "clinic_photos")
                    }
                  />
                </Button>
              </Grid>
            </Grid>

            {/* ===== Doctor Photo ===== */}
            <Grid container spacing={2} alignItems="center" mb={2}>
              <Grid item xs={4}>
                <Typography>Doctor Photo</Typography>
              </Grid>
              <Grid item xs={8}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Doctor Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e, "doctor_photo")
                    }
                  />
                </Button>
              </Grid>
            </Grid>

            {/* ===== Prescription Sample ===== */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography>Prescription Sample (Optional)</Typography>
              </Grid>
              <Grid item xs={8}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Prescription
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      handleFileChange(e, "prescription_sample")
                    }
                  />
                </Button>
              </Grid>
            </Grid>

          </Paper>
        </Grid>
      </Grid>
    </>
  );
    case 5:
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        display="flex"
        alignItems="center"
      >
        <AttachMoneyIcon sx={{ color: "#e91e63", mr: 1 }} />
        Documents Required
      </Typography>

      <Grid container spacing={2}>

        {[
          "Clinic Registration Certificate",
          "Doctor Medical License",
          "PAN Card",
          "Aadhaar Card",
          "GST (optional)",
        ].map((doc) => (
          <Grid item xs={12} md={6} key={doc}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>{doc}</Typography>

              <Button component="label" size="small" variant="outlined">
                Upload
                <input
                  hidden
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e: any) =>
                    setDocuments([
                      ...documents,
                      ...Array.from(e.target.files),
                    ])
                  }
                />
              </Button>
            </Paper>
          </Grid>
        ))}

      </Grid>

      {/* Uploaded Files */}
      <Box mt={3}>
        <Typography fontWeight="bold">Uploaded Documents:</Typography>

        {documents.map((doc, i) => (
          <Typography key={i} fontSize={13}>
            {doc.name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
    default:
      return null;
  }
};

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
        {/* ✅ HEADER CARD */}
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

       <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
  {steps.map((label, index) => (
    <Step key={label}>
      <StepLabel
        onClick={() => setActiveStep(index)}
        sx={{
          cursor: "pointer",
          "& .MuiStepLabel-label": {
            fontWeight: activeStep === index ? "bold" : "normal",
          },
        }}
      >
        {label}
      </StepLabel>
    </Step>
  ))}
</Stepper>
{/* ✅ FORM CONTENT */}
<Box
  sx={{
    mt: 2,
    minHeight: 250,
    transition: "all 0.3s ease",
  }}
>
  {renderStepContent()}
</Box>

{/* ✅ STEP INFO */}
<Typography
  variant="body2"
  color="text.secondary"
  sx={{ mt: 2, textAlign: "center" }}
>
  Step {activeStep + 1} of {steps.length}
</Typography>

{/* ✅ ACTION BUTTONS (STICKY FOOTER STYLE) */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 4,
    pt: 2,
    borderTop: "1px solid #eee",
  }}
>
  {/* LEFT SIDE */}
  <Box>
    <Button
      variant="outlined"
      disabled={activeStep === 0}
      onClick={handleBack}
      sx={{ borderRadius: 2, mr: 2 }}
    >
      Back
    </Button>

    <Button
      variant="outlined"
      onClick={handleSaveDraft}
      sx={{ borderRadius: 2, mr: 2 }}
    >
      Save Draft
    </Button>

    <Button
      variant="outlined"
      color="error"
      onClick={handleResetDraft}
      sx={{ borderRadius: 2 }}
    >
      Reset Draft
    </Button>
  </Box>

  {/* RIGHT SIDE */}
  <Box>
    {activeStep < steps.length - 1 && (
      <Button
        variant="contained"
        onClick={handleNext}
        sx={{
          borderRadius: 2,
          background: "linear-gradient(90deg, #e91e63, #9c27b0)",
        }}
      >
        Next →
      </Button>
    )}

    {activeStep === steps.length - 1 && (
      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        sx={{ borderRadius: 2 }}
      >
        Submit ✅
      </Button>
    )}
  </Box>
</Box>
    {/* RIGHT SIDE */}
   </Paper>
    </Box>
  );
}