import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";

import ClinicAboutForm from "./clinic-forms/ClinicAboutForm";


import ClinicWebsitePreview from "./ClinicWebsitePreview";

export default function ClinicDashboard() {

  const [clinicData, setClinicData] = useState({});

  const updatePreview = (data) => {
    setClinicData(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <Grid container spacing={2}>

      {/* LEFT FORM */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>

          <ClinicAboutForm updatePreview={updatePreview} />
         

        </Paper>
      </Grid>

      {/* RIGHT PREVIEW */}
      <Grid item xs={12} md={6}>
        <ClinicWebsitePreview data={clinicData} />
      </Grid>

    </Grid>
  );
}