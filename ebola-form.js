document.addEventListener("DOMContentLoaded", async () => {

  /*
  =====================================================
  CONFIGURATION SUPABASE
  =====================================================
  */

  const SUPABASE_URL =
"https://pbxwkrvfzwbnkndjmkui.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieHdrcnZmendibmtuZGpta3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzI4ODQsImV4cCI6MjA5NDg0ODg4NH0.DnxRQPzJPFuxkK66vS_Epap47mKtwXCpYedaI-87BMw";

  /*
  =====================================================
  INITIALISATION SUPABASE
  =====================================================
  */

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("Supabase initialisé");

  /*
  =====================================================
  RECUPERATION DU FORMULAIRE
  =====================================================
  */

  const form = document.getElementById("ebolaSurveyForm");

  if (!form) {
    console.error("Formulaire introuvable");
    return;
  }

  console.log("Formulaire détecté");

  /*
  =====================================================
  SOUMISSION DU FORMULAIRE
  =====================================================
  */

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    console.log("Soumission en cours...");

    /*
    =====================================================
    BOUTON LOADING
    =====================================================
    */

    const submitButton =
      document.querySelector(".btn-primary");

    submitButton.disabled = true;
    submitButton.innerHTML = "Envoi en cours...";

    /*
    =====================================================
    RECUPERATION DES DONNEES
    =====================================================
    */

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

    console.log("Données collectées :", data);

    /*
    =====================================================
    INSERTION SUPABASE
    =====================================================
    */

    try {

      const { error } = await supabaseClient
        .from("giha_ebola_border_survey")
        .insert([data]);

      /*
      =====================================================
      GESTION ERREUR
      =====================================================
      */

      if (error) {

        console.error("Erreur Supabase :", error);

        alert(
          "Erreur lors de l’enregistrement : " +
          error.message
        );

        submitButton.disabled = false;
        submitButton.innerHTML =
          "Soumettre le formulaire";

        return;
      }

      /*
      =====================================================
      SUCCES
      =====================================================
      */

      console.log("Données enregistrées");

      alert(
        "Formulaire soumis avec succès."
      );

      form.reset();

    } catch (err) {

      console.error("Erreur globale :", err);

      alert(
        "Une erreur technique est survenue."
      );

    } finally {

      submitButton.disabled = false;

      submitButton.innerHTML =
        "Soumettre le formulaire";
    }

  });

  /*
  =====================================================
  TEST CONNEXION SUPABASE
  =====================================================
  */

  try {

    const { data, error } = await supabaseClient
      .from("giha_ebola_border_survey")
      .select("*")
      .limit(1);

    if (error) {

      console.error(
        "Erreur connexion Supabase :",
        error
      );

    } else {

      console.log(
        "Connexion Supabase OK",
        data
      );
    }

  } catch (err) {

    console.error(
      "Erreur test connexion :",
      err
    );
  }

});
