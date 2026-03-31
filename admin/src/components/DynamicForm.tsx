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


export default function DynamicForm() {
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  
 

  const steps = [
    "Basic Details",
    "Fees",
    "Facilities",
    "Contact",
    "Upload Image",
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
  doctor_names: [""],   // ✅ array
  owner_names: [""],    // ✅ array
});

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

        {/* ================= CLINIC DETAILS ================= */}
        {isClinic && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Clinic Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Clinic Name"
                      name="clinic_name"
                      value={formData.clinic_name || ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Select
                      fullWidth
                      displayEmpty
                      name="clinic_type"
                      value={formData.clinic_type || ""}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select Clinic Type</MenuItem>
                      <MenuItem value="Dental">Dental</MenuItem>
                      <MenuItem value="Eye">Eye</MenuItem>
                      <MenuItem value="Skin">Skin</MenuItem>
                      <MenuItem value="General Physician">
                        General Physician
                      </MenuItem>
                      <MenuItem value="Physiotherapy">
                        Physiotherapy
                      </MenuItem>
                      <MenuItem value="Ayurveda">Ayurveda</MenuItem>
                      <MenuItem value="Homeopathy">Homeopathy</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* ================= DOCTOR TABLE ================= */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Doctor List
                </Typography>

                {(formData.doctor_names || []).map((doc, index) => (
                  <Grid container spacing={2} key={index} mb={1}>
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label={`Doctor ${index + 1}`}
                        value={doc}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            e.target.value,
                            "doctor_names"
                          )
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
                        Remove
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

            {/* ================= OWNER TABLE ================= */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Owner List
                </Typography>

                {(formData.owner_names || []).map((owner, index) => (
                  <Grid container spacing={2} key={index} mb={1}>
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label={`Owner ${index + 1}`}
                        value={owner}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            e.target.value,
                            "owner_names"
                          )
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
                        Remove
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

            {/* ================= CONTACT DETAILS ================= */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography fontWeight="bold" mb={2} color="#e91e63">
                  Contact Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Person"
                      name="contact_person"
                      value={formData.contact_person || ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      name="mobile"
                      value={formData.mobile || ""}
                      onChange={handleChange}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Alternate Mobile"
                      name="alternate_mobile"
                      value={formData.alternate_mobile || ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      type="email"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* ================= DEFAULT CATEGORY ================= */}
        {!isClinic && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography fontWeight="bold" mb={2} color="#e91e63">
                Basic Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
   case 1:
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center">
        <AttachMoneyIcon sx={{ color: "#e91e63", mr: 1 }} />
        Fees Details
      </Typography>

      <TextField
        fullWidth
        label="Consultation Fees"
        name="fees"
        value={formData.fees || ""}
        onChange={handleChange}
        variant="outlined"
        placeholder="Enter fees (e.g. 500)"
        sx={{
          background: "#fff",
          borderRadius: 2,
        }}
        InputProps={{
          startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: "#999" }} />,
        }}
      />
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
      <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center">
        <ContactPhoneIcon sx={{ color: "#e91e63", mr: 1 }} />
        Contact Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            sx={{ background: "#fff", borderRadius: 2 }}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ background: "#fff", borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
    case 4:
      return (
        <>
          <Typography mb={2}>
            <ImageIcon sx={{ color: "#e91e63", mr: 1 }} />
            Upload & Services
          </Typography>

          {/* SERVICES */}
          {isClinic && (
  <>
    <Typography mb={1}>Clinic Services</Typography>
    <Grid container>
      {clinicServices.map((service) => (
        <Grid item xs={6} key={service}>
          <label>
            <input
              type="checkbox"
              checked={formData.services?.includes(service)}
              onChange={() =>
                handleCheckboxChange("services", service)
              }
            />
            {service}
          </label>
        </Grid>
      ))}
    </Grid>
  </>
)}
          {/* IMAGES */}
          <Box mt={3}>
            <Button component="label" startIcon={<CloudUploadIcon />}>
              Upload Images
              <input hidden type="file" multiple onChange={handleMultipleImages} />
            </Button>

            {images.map((img, i) => (
              <Typography key={i}>{img.name}</Typography>
            ))}
          </Box>

          {/* DOCUMENTS */}
          <Box mt={3}>
            <Button component="label">
              Upload Documents (PDF)
              <input
                hidden
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleDocuments}
              />
            </Button>

            {documents.map((doc, i) => (
              <Typography key={i}>{doc.name}</Typography>
            ))}
          </Box>
        </>
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

  {/* ✅ NEW RESET BUTTON */}
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
</Box>    </Paper>
    </Box>
  );
}