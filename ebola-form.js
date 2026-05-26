document.addEventListener("DOMContentLoaded", async () => {

  const SUPABASE_URL =
    "https://pbxwkrvfzwbnkndjmkui.supabase.co";

  const SUPABASE_ANON_KEY =
    "TA_CLE_ICI";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("Supabase chargé");

  const form = document.getElementById("ebolaSurveyForm");

  console.log("Form trouvé :", form);

  if (!form) {
    console.error("Formulaire introuvable");
    return;
  }

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const data = {

      organisation:
        document.getElementById("organisation")?.value || "",

      organization_type:
        document.getElementById("organization_type")?.value || "",

      province:
        document.getElementById("province")?.value || "",

      territory:
        document.getElementById("territory")?.value || "",

      health_zone:
        document.getElementById("health_zone")?.value || "",

      border_area:
        document.getElementById("border_area")?.value || "",

      respondent_sex:
        document.getElementById("respondent_sex")?.value || "",

      respondent_role:
        document.getElementById("respondent_role")?.value || "",

      affected_group:
        document.getElementById("affected_group")?.value || "",

      ebola_impact:
        document.getElementById("ebola_impact")?.value || "",

      border_closure_impact:
        document.getElementById("border_closure_impact")?.value || "",

      women_specific_risks:
        document.getElementById("women_specific_risks")?.value || "",

      gbv_risks_observed:
        document.getElementById("gbv_risks_observed")?.value || "",

      access_to_services:
        document.getElementById("access_to_services")?.value || "",

      priority_needs:
        document.getElementById("priority_needs")?.value || "",

      community_recommendations:
        document.getElementById("community_recommendations")?.value || "",

      consent:
        document.getElementById("consent")?.checked || false
    };

    console.log("Données envoyées :", data);

    const { error } = await supabaseClient
      .from("giha_ebola_border_survey")
      .insert([data]);

    if (error) {

      console.error("Erreur Supabase :", error);

      alert("Erreur : " + error.message);

      return;
    }

    alert("Formulaire soumis avec succès.");

    form.reset();
  });

});
