const login = (email, password) => {
  return fetch("https://ajax.test-danit.com/api/v2/cards/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      if (res.status === 200) {
        localStorage.setItem("token", await res.text());
        return (window.location.href = "/");
      }
      throw "wrong password";
    })
    .catch(alert);
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

const getCards = () => {
  return fetch("https://ajax.test-danit.com/api/v2/cards", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
};

const getCardById = (id) => {
  return fetch("https://ajax.test-danit.com/api/v2/cards/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
};

const createCard = (body) => {
  return fetch("https://ajax.test-danit.com/api/v2/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ ...body, status: "open" }),
  }).then((response) => response.json());
};

const updateCard = (id, body) => {
  return fetch("https://ajax.test-danit.com/api/v2/cards/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      id,
      ...body,
    }),
  }).then((response) => response.json());
};

const deleteCardApi = (id) => {
  return fetch("https://ajax.test-danit.com/api/v2/cards/" + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

document.getElementById("visitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = [...new FormData(e.target).entries()];
  const request = {};
  const cardId = e.target.getAttribute("data-card-id");

  formData.forEach((data) => {
    request[data[0]] = data[1];
  });

  if (cardId) {
    updateCard(cardId, request)
      .then(() => {
        fillCards();
        closeModal();
      })
      .catch((err) => console.error(err));
  } else
    createCard(request)
      .then(() => {
        fillCards();
        closeModal();
      })
      .catch((err) => console.error(err));
});

function closeModal() {
  const modal = document.querySelector("#visitModal");
  modal.classList.remove("show");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeAttribute("role");

  const modalBackdrop = document.querySelector(".modal-backdrop");
  if (modalBackdrop) {
    document.body.removeChild(modalBackdrop);
  }
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  document.body.style.padding = 0;
}
