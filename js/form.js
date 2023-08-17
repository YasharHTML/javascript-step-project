function getInputFields(doctor) {
  switch (doctor) {
    case "cardiologist":
      return [
        { title: "Normal blood pressure", type: "number", name: "bp" },
        { title: "Body Mass Index (BMI)", type: "number", name: "bmi" },
        {
          title: "Previously diagnosed cardiovascular diseases",
          type: "text",
          name: "cvd",
        },
        { title: "Age", type: "number", name: "age" },
      ];
    case "dentist":
      return [{ title: "Last Visit Date", type: "text", name: "lvd" }];
    case "therapist":
      return [{ title: "Age", type: "number", name: "age" }];
  }
}

function createInput({ title, type, name }, visitData = null) {
  let value = visitData ? visitData[name] : "";

  return `<div class="mb-3">
            <div class="form-floating">
                <input
                    type="${type}"
                    class="form-control"
                    id="${name}"
                    name="${name}"
                    value="${value}"
                />
                <label for="${name}">${title}</label>
            </div>
        </div>`;
}

document.getElementById("doctorSelectbox").addEventListener("change", (e) => {
  document.getElementById("visitInfo").classList.remove("d-none");
  const inputFieldsByDoctor = getInputFields(e.target.value);
  const doctorSpecific = document.getElementById("doctorSpecifiedFields");
  doctorSpecific.innerHTML = "";
  inputFieldsByDoctor.forEach((field) => {
    doctorSpecific.innerHTML += createInput(field);
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
