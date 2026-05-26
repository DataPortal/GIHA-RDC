const SUPABASE_URL = "https://TON-PROJET.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieHdrcnZmendibmtuZGpta3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzI4ODQsImV4cCI6MjA5NDg0ODg4NH0.DnxRQPzJPFuxkK66vS_Epap47mKtwXCpYedaI-87BMw";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const form = document.getElementById("ebolaSurveyForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  alert("Le JavaScript fonctionne. Envoi vers Supabase...");

  const data = {
    organisation: document.getElementById("organisation").value.trim(),
    organization_type: document.getElementById("organization_type").value,
    province: document.getElementById("province").value,
    territory: document.getElementById("territory").value.trim(),
    health_zone: document.getElementById("health_zone").value.trim(),
    border_area: document.getElementById("border_area").value.trim(),
    respondent_sex: document.getElementById("respondent_sex").value,
    respondent_role: document.getElementById("respondent_role").value.trim(),
    affected_group: document.getElementById("affected_group").value,
    ebola_impact: document.getElementById("ebola_impact").value.trim(),
    border_closure_impact: document.getElementById("border_closure_impact").value.trim(),
    women_specific_risks: document.getElementById("women_specific_risks").value.trim(),
    gbv_risks_observed: document.getElementById("gbv_risks_observed").value.trim(),
    access_to_services: document.getElementById("access_to_services").value.trim(),
    priority_needs: document.getElementById("priority_needs").value.trim(),
    community_recommendations: document.getElementById("community_recommendations").value.trim(),
    consent: document.getElementById("consent").checked
  };

  const { error } = await supabaseClient
    .from("giha_ebola_border_survey")
    .insert(data);

  if (error) {
    console.error("Erreur Supabase :", error);
    alert("Erreur Supabase : " + error.message);
    return;
  }

  alert("Données enregistrées avec succès dans Supabase.");
  form.reset();
});
