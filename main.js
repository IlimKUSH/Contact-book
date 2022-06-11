const API = "http://localhost:8000/contacts";
let inpName = document.getElementById("inp-name");
let inpSurname = document.getElementById("inp-surname");
let inpTel = document.getElementById("inp-tel");
let btnAdd = document.getElementById("btn-add");

btnAdd.addEventListener("click", async function () {
  let newContact = {
    name: inpName.value,
    surname: inpSurname.value,
    phone: inpTel.value,
  };
  console.log(newContact);
  if (
    inpName.value.trim() === "" &&
    inpSurname.value.trim() === "" &&
    inpTel.value.trim() === ""
  ) {
    alert("Заполните поля");
    return;
  }
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  getContacts();
  inpName.value = "";
  inpSurname.value = "";
  inpTel.value = "";
});

let pagination = document.getElementById("pagination");
let page = 1;

let list = document.getElementById("list");

let inpSearch = document.getElementById("inp-search");
inpSearch.addEventListener("input", function () {
  getContacts();
});

async function getContacts() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${inpSearch.value}${page}&_limit=3`
  )
    .then(res => res.json())
    .catch(err => console.log(err));

  let allContacts = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err));
  let lastPage = Math.ceil(allContacts.length / 2);
  // console.log(lastPage);
  list.innerHTML = "";

  response.forEach(item => {
    let newElem = document.createElement("div");

    newElem.id = item.id;
    newElem.innerHTML = `<span class = 'name'>${item.name}</span> <span class = 'surname'>${item.surname}</span> <span class = 'phone'>${item.phone}</span><button class = 'btn-delete'>Delete</button><button class = 'btn-edit'>Edit</button>`;
    list.append(newElem);
  });
  pagination.innerHTML = `<button ${
    page === 1 ? "disabled" : ""
  } id='btn-prev'>prev</button> <span>${page}</span><button ${
    page === lastPage ? "disabled" : ""
  } id='btn-next'>next</button>`;
}
getContacts();
document.addEventListener("click", async function (e) {
  if (e.target.className === "btn-delete") {
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getContacts();
  }
  if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    inpEditName.value = response.name;
    inpEditSurname.value = response.surname;
    inpEditTel.value = response.phone;
    inpEditId.value = response.id;
  }
  if (e.target.id === "btn-next") {
    page++;
    getContacts();
  }

  if (e.target.id === "btn-prev") {
    page--;
    getContacts();
  }
});

let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditName = document.getElementById("inp-edit-name");
let inpEditSurname = document.getElementById("inp-edit-surname");
let inpEditTel = document.getElementById("inp-edit-tel");
let inpEditId = document.getElementById("inp-edit-id");
let btnSaveEdit = document.getElementById("btn-save-edit");

modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});
btnSaveEdit.addEventListener("click", async function () {
  let editedTodo = {
    name: inpEditName.value,
    surname: inpEditSurname.value,
    phone: inpEditTel.value,
  };
  let id = inpEditId.value;
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedTodo),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  modalEdit.style.display = "none";
  getContacts();
});
