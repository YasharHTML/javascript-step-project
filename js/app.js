const globalStore = [];
window.globalStore = globalStore;

const mapper = {
  bp: "Normal blood pressure",
  bmi: "Body Mass Index",
  cvd: "Cardiovascular History",
  age: "Age",
  lvd: "Last Visit Date",
  visitPurpose: "Visit Purpose",
  visitDesc: "Visit Description",
  urgency: "Urgency",
  id: "Appointment number",
  status: "Status",
};
const cardItem = (card) =>
  `<div class="col-sm-4 mb-3" id="ref-${card.id}" >
    <div class="card border-0">
        <div class="card-header bg-primary bg-opacity-25 d-flex justify-content-end border-0">
            <button
                type="button"
                class="btn-close btn-danger"
                aria-label="Close"
                data-more-id = "${card.id}"
                onclick="deleteCard(${card.id});"
            ></button>
        </div>
        <div class="card-body bg-primary bg-opacity-10">
            <h5 class="card-title" id="visiterFullname">
                ${card.fullname}
            </h5>
            <p class="card-text">
                <div class="line">
                    <span class="label">Doctor:</span>
                    <span class="value" id="doctor">
                        ${card.doctor}
                    </span>
                </div>
                <div id="moreDetails-${card.id}"></div>
            </p>
            
            <button class="btn btn-primary more-btn" data-more-id = "${card.id}" onclick="showMore(this, ${card.id})">
                Show more
            </button>
        </div>
    </div>
</div>
`;

const fillCards = () => {
  getCards().then((response) => {
    createCards(response);
  });
};
const createCards = (cards) => {
  const grid = document.getElementById("visitCardsGrid");
  if (cards.length)
    document.getElementById("noItemsCard").classList.add("d-none");
  window.globalStore = cards;
  grid.innerHTML = "";
  window.globalStore.forEach((card) => (grid.innerHTML += cardItem(card)));
  window.globalStore.forEach((card) => {
    const cardElement = document.querySelector(`#ref-${card.id}`);
    const showMoreBtn = document.querySelector(`[data-more-id = "${card.id}"]`);
    const deleteBtn = document.querySelector(`[data-delete-id = "${card.id}"]`);
    if (cardElement) {
      cardElement.addEventListener("click", function (e) {
        if (!(e.target === showMoreBtn || e.target === deleteBtn)) {
          openModal(e);
          editCard(card.id);
        }
      });
    }
  });
};
function editCard(id) {
  document.getElementById("visitForm").setAttribute("data-card-id", `${id}`);
  document.getElementById("visitForm").reset();

  getCardById(id).then((res) => {
    const visit = createVisitEditClass(res);
    document.getElementById("visitInfo").classList.remove("d-none");
    document.querySelector("#doctorSelectbox").value = visit.doctor;
    document.querySelector("#visitPurposeModal").value = visit.visitPurpose;
    document.querySelector("#visitDescModal").value = visit.visitDesc;
    document.querySelector("#fullnameModal").value = visit.fullname;

    const doctorSpecific = document.getElementById("doctorSpecifiedFields");
    doctorSpecific.innerHTML = "";
    visit.getDoctorFields.forEach((field) => {
      doctorSpecific.innerHTML += visit.createInput(field, res);
    });
  });

  document.querySelector("#visitModalLabel").textContent = "Edit Visit";
}
function openModal(event) {
  if (!event.target.matches(".more-btn")) {
    var modal = new bootstrap.Modal(document.getElementById("visitModal"));
    modal.show();
  }
}
function deleteCard(id) {
  const confirmation = confirm("Are you sure to delete this visit?");
  if (confirmation) {
    deleteCardApi(id).then((res) => {
      fillCards();
    });
  }
}

document.getElementById("filterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const grid = document.getElementById("visitCardsGrid");
  const formData = [...new FormData(e.target).entries()];
  const request = {};
  formData.forEach((data) => {
    request[data[0]] = data[1];
  });

  getCards().then((cards) => {
    grid.innerHTML = "";
    const filteredCards = cards.filter(
      (card) =>
        (card.visitPurpose
          .toUpperCase()
          .includes(request.searchTitle.toUpperCase()) ||
          card.visitDesc
            .toUpperCase()
            .includes(request.searchTitle.toUpperCase())) &&
        (request.status == "all" || card.status == request.status) &&
        (request.urgency == "all" || card.urgency == request.urgency)
    );

    if (filteredCards.length == 0)
      document.getElementById("noFilteredItemsCard").classList.remove("d-none");
    else {
      document.getElementById("noFilteredItemsCard").classList.add("d-none");
      createCards(filteredCards);
    }
  });
});

function showMore(e, id) {
  const card = window.globalStore.find((e) => e.id == id);
  if (card && document.getElementById(`moreDetails-${id}`).innerHTML == "") {
    e.innerHTML = "Show Less";
    for (const key in card) {
      if (key != "fullname" && key != "doctor") {
        const value = card[key];
        const element = document.createElement("div");
        element.classList.add("line");
        element.innerHTML = `<span class="label">${mapper[key]}:</span>
                    <span class="value" id="doctor">
                        ${value}
                    </span>`;
        document
          .querySelector(`#ref-${id} #moreDetails-${id}`)
          .appendChild(element);
      }
    }
  } else {
    e.innerHTML = "Show more";
    document.getElementById(`moreDetails-${id}`).innerHTML = "";
  }
}

window.onload = () => {
  const token = localStorage.getItem("token");
  const loginButton = document.getElementById("loginBtn");
  const createButton = document.getElementById("logged");
  if (token) {
    createButton.classList.remove("d-none");
  } else {
    loginButton.classList.remove("d-none");
  }

  fillCards();
};

function createVisitEditClass(cardData) {
  switch (cardData.doctor) {
    case "cardiologist":
      return new VisitCardiologist(
        cardData.doctor,
        cardData.visitPurpose,
        cardData.visitDesc,
        cardData.fullname,
        cardData.urgency,
        cardData.bp,
        cardData.bmi,
        cardData.cvd,
        cardData.age
      );
    case "dentist":
      return new VisitDentist(
        cardData.doctor,
        cardData.visitPurpose,
        cardData.visitDesc,
        cardData.urgency,
        cardData.fullname,
        cardData.lvd
      );
    case "therapist":
      return new VisitTherapist(
        cardData.doctor,
        cardData.visitPurpose,
        cardData.visitDesc,
        cardData.urgency,
        cardData.fullname,
        cardData.age
      );
    default:
      return {};
  }
}
