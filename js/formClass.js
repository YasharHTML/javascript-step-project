  document.getElementById("doctorSelectbox").addEventListener("change", (e) => {
    document.getElementById("visitInfo").classList.remove("d-none");
    const visit = createVisitClassByDoctor(e.target.value);
    const doctorSpecific = document.getElementById("doctorSpecifiedFields");
    doctorSpecific.innerHTML = "";
    visit.getDoctorFields.forEach((field) => {
      doctorSpecific.innerHTML += visit.createInput(field);
    });
  });
  
  document.getElementById("createVisitBtn").addEventListener("click", () => {
    document.getElementById("visitForm").reset();
    document.getElementById("visitForm").removeAttribute("data-card-id");
    document.querySelector("#visitModalLabel").textContent = "Create Visit";
    document.getElementById("visitInfo").classList.add("d-none");
  });
  
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const email = e.target[1].value;
    const password = e.target[2].value;
    login(email, password);
  });


  function createVisitClassByDoctor(doctor) {
    switch (doctor) {
      case "cardiologist": return new VisitCardiologist(doctor,'','','','','','','','','');
      case "dentist": return new VisitDentist(doctor,'','','','','');
      case "therapist": return new VisitTherapist(doctor,'','','','','');
      default: return {};
    }
  }
  
