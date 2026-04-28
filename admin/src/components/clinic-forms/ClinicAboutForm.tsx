export default function ClinicAboutForm({ formData, setFormData }: any) {
  return (
    <>
      <TextField
        fullWidth
        label="About Clinic"
        value={formData.about_clinic || ""}
        onChange={(e) =>
          setFormData({ ...formData, about_clinic: e.target.value })
        }
      />

      <TextField
        fullWidth
        label="Specialization"
        value={formData.specialization || ""}
        onChange={(e) =>
          setFormData({ ...formData, specialization: e.target.value })
        }
        sx={{ mt: 2 }}
      />
    </>
  );
}