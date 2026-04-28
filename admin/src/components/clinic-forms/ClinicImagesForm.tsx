import React from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

interface Props {
  formData: any;
  handleFileChange: (e: any, field: string) => void;
}

export default function ClinicImagesForm({
  formData,
  handleFileChange,
}: Props) {
  return (
    <Box>
      {/* HEADER */}
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        display="flex"
        alignItems="center"
      >
        <ImageIcon sx={{ color: "#e91e63", mr: 1 }} />
        Clinic Images
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>

            {/* Clinic Logo */}
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

                {formData?.clinic_logo && (
                  <Typography fontSize={12} mt={1}>
                    {formData.clinic_logo.name}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* Clinic Photos */}
            <Grid container spacing={2} alignItems="center" mb={2}>
              <Grid item xs={4}>
                <Typography>Clinic Photos</Typography>
              </Grid>

              <Grid item xs={8}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Clinic Photos
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

                {formData?.clinic_photos && (
                  <Typography fontSize={12} mt={1}>
                    {Array.isArray(formData.clinic_photos)
                      ? formData.clinic_photos.length + " files selected"
                      : formData.clinic_photos.name}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* Doctor Photo */}
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

                {formData?.doctor_photo && (
                  <Typography fontSize={12} mt={1}>
                    {formData.doctor_photo.name}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* Prescription Sample */}
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

                {formData?.prescription_sample && (
                  <Typography fontSize={12} mt={1}>
                    {formData.prescription_sample.name}
                  </Typography>
                )}
              </Grid>
            </Grid>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}