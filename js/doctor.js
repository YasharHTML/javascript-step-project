class Visit{
    constructor( doctor, visitPurpose, visitDesc, urgency, fullname ) {
        this.doctor = doctor;
        this.visitPurpose = visitPurpose;
        this.visitDesc = visitDesc;
        this.urgency = urgency;
        this.fullname = fullname;
    }
    createInput({ title, type, name }, visitData = null) {
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
}

class VisitCardiologist extends Visit {
    constructor(
        doctor,
        visitPurpose,
        visitDesc,
        fullname,
        urgency,
        bp,
        bmi,
        cvd,
        age,
    ) {
        super(doctor, visitPurpose, visitDesc, urgency, fullname );
        this.bp = bp;
        this.bmi = bmi;
        this.cvd = cvd;
        this.age = age;
    }

    get getDoctorFields() {
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
    }
}

class VisitDentist extends Visit {
    constructor(
        doctor,
        visitPurpose,
        visitDesc,
        urgency,
        fullname,
        lvd
) {
        super(doctor, visitPurpose, visitDesc, urgency, fullname );
        this.lvd = lvd;
    }
    get getDoctorFields() {
        return [{ title: "Last Visit Date", type: "text", name: "lvd" }];
    }

}

class VisitTherapist extends Visit {
    constructor(
        doctor,
        visitPurpose,
        visitDesc,
        urgency,
        fullname,
        age,
    ) {
        super(doctor, visitPurpose, visitDesc, urgency, fullname );
        this.age = age;
    }
    get getDoctorFields() {
        return [{ title: "Age", type: "number", name: "age" }];
    }
}
