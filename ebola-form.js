const SUPABASE_URL = "https://TON-PROJET.supabase.co";
const SUPABASE_ANON_KEY = "TA_CLE_ANON";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

document.getElementById("ebolaSurveyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    organisation: document.getElementById("organisation").value,
    province: document.getElementById("province").value,
    territory: document.getElementById("territory").value,
    health_zone: document.getElementById("health_zone").value,
    border_area: document.getElementById("border_area").value,
    respondent_sex: document.getElementById("respondent_sex").value,
    ebola_impact: document.getElementById("ebola_impact").value,
    border_closure_impact: document.getElementById("border_closure_impact").value,
    women_specific_risks: document.getElementById("women_specific_risks").value,
    gbv_risks_observed: document.getElementById("gbv_risks_observed").value,
    access_to_services: document.getElementById("access_to_services").value,
    priority_needs: document.getElementById("priority_needs").value,
    community_recommendations: document.getElementById("community_recommendations").value,
    consent: document.getElementById("consent").checked
  };

  const { error } = await supabaseClient
    .from("giha_ebola_border_survey")
    .insert([data]);

  if (error) {
    console.error(error);
    alert("Erreur lors de l’envoi du formulaire.");
    return;
  }

  alert("Formulaire soumis avec succès.");
  e.target.reset();
});
