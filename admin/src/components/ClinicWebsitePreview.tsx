import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ClinicWebsitePreview({ data }) {

  return (
    <Paper sx={{ p: 3, minHeight: 500 }}>

      <Typography variant="h5" mb={2}>
        Clinic Website Preview
      </Typography>

      {/* About Clinic */}
      {data.aboutClinic && (
        <Box mb={2}>
          <Typography variant="h6">
            About Clinic
          </Typography>

          <Typography>
            {data.aboutClinic.aboutClinic}
          </Typography>

          <Typography>
            {data.aboutClinic.description}
          </Typography>
        </Box>
      )}

      {/* Doctor Section */}
      {data.doctors && (
        <Box>
          <Typography variant="h6">
            Doctors
          </Typography>

          {data.doctors.map((doc, i) => (
            <Typography key={i}>
              {doc.name}
            </Typography>
          ))}
        </Box>
      )}

    </Paper>
  );
}