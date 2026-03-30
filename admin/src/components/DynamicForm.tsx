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
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import dynamicApi from "../dynamic-api/dynamic-api";

export default function DynamicForm() {
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [image, setImage] = useState<File | null>(null);

  const steps = [
    "Basic Details",
    "Fees",
    "Facilities",
    "Contact",
    "Upload Image",
  ];

  const getCategory = () => {
    if (user?.category) return user.category;

    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.category || "No Category";
    }

    return "No Category";
  };

  const getSubCategory = () => {
    if (user?.sub_category) return user.sub_category;

    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.sub_category || "No Subcategory";
    }

    return "No Subcategory";
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    payload.append("category", getCategory());
    payload.append("sub_category", getSubCategory());
    payload.append("data", JSON.stringify(formData));

    if (image) payload.append("image", image);

    try {
      await dynamicApi.post("/dynamic/business", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Saved successfully ✅");
      setFormData({});
      setImage(null);
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
            <Typography mb={2}>
              <InfoIcon sx={{ color: "#e91e63", mr: 1 }} />
              Basic Information
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
          </>
        );

      case 1:
        return (
          <>
            <Typography mb={2}>
              <AttachMoneyIcon sx={{ color: "#e91e63", mr: 1 }} />
              Fees Details
            </Typography>

            <TextField
              fullWidth
              label="Consultation Fees"
              name="fees"
              value={formData.fees || ""}
              onChange={handleChange}
            />
          </>
        );

      case 2:
        return (
          <>
            <Typography mb={2}>
              <LocalHospitalIcon sx={{ color: "#e91e63", mr: 1 }} />
              Facilities
            </Typography>

            <TextField
              fullWidth
              label="Facilities"
              name="facilities"
              value={formData.facilities || ""}
              onChange={handleChange}
            />
          </>
        );

      case 3:
        return (
          <>
            <Typography mb={2}>
              <ContactPhoneIcon sx={{ color: "#e91e63", mr: 1 }} />
              Contact Details
            </Typography>

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </>
        );

      case 4:
        return (
          <>
            <Typography mb={2}>
              <ImageIcon sx={{ color: "#e91e63", mr: 1 }} />
              Upload Image
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ borderColor: "#e91e63", color: "#e91e63" }}
            >
              Upload Image
              <input hidden type="file" onChange={handleImageChange} />
            </Button>

            {image && (
              <Typography mt={2} color="#e91e63">
                {image.name}
              </Typography>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 950, mx: "auto", mt: 4 }}>

      {/* HEADER */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg, #e91e63, #f48fb1)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {getCategory()}
        </Typography>
        <Typography>{getSubCategory()}</Typography>
      </Paper>

      {/* STEPPER */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                {index + 1}. {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        {/* BUTTONS */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              sx={{
                background: "linear-gradient(90deg, #e91e63, #c2185b)",
              }}
            >
              Save Business
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                background: "linear-gradient(90deg, #e91e63, #c2185b)",
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}