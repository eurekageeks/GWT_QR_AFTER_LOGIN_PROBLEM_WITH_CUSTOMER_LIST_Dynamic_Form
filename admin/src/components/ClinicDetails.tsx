import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dynamicApi from "../dynamic-api/dynamic-api";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
} from "@mui/material";

export default function ClinicDetails() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    fetchClinic();
  }, []);

  const fetchClinic = async () => {
    try {
      const res = await dynamicApi.get(`/dynamic/business/${id}`);
      setClinic(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!clinic) return <h2>Loading...</h2>;

  const data = clinic.data;

  return (
    <Box sx={{ p: 4, background: "#f5f7fb" }}>

      {/* HEADER */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4">
          {data.clinic_name}
        </Typography>

        <Typography color="gray">
          {data.specialization}
        </Typography>

        <Typography>
          {data.years_of_experience} Years Experience
        </Typography>
      </Paper>

      {/* ABOUT */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">About</Typography>
        <Typography>{data.about_clinic}</Typography>
      </Paper>

      {/* DOCTORS */}
      <Typography variant="h6" mt={3}>
        Doctors
      </Typography>

      <Grid container spacing={2}>
        {data.doctors?.map((doc, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <img
                src={doc.photo}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                }}
              />

              <Typography fontWeight="bold">
                {doc.name}
              </Typography>

              <Typography>{doc.specialization}</Typography>

              <Typography>
                {doc.experience} yrs
              </Typography>

              <Typography>₹{doc.fee}</Typography>

              <Button fullWidth variant="contained">
                Book Appointment
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* SERVICES */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Services</Typography>

        {data.services?.map((s, i) => (
          <Chip key={i} label={s} sx={{ m: 0.5 }} />
        ))}
      </Paper>

      {/* AMENITIES */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Amenities</Typography>

        {data.amenities?.map((a, i) => (
          <Chip key={i} label={a} sx={{ m: 0.5 }} />
        ))}
      </Paper>

      {/* CONTACT */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Contact</Typography>

        <Typography>📞 {data.phone}</Typography>
        <Typography>📧 {data.email}</Typography>
        <Typography>📍 {data.clinic_address}</Typography>
      </Paper>

    </Box>
  );
}