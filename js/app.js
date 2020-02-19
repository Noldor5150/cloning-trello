let addList = false;
const columns = document.querySelector("#columns");
let data = [];
let listCounter = 0;
let cardCounter = 0;

window.addEventListener("load", event => {
  render();
});

function render() {
  let storageData = window.localStorage.getItem("columns");
  if (storageData != null) {
    storageData = JSON.parse(storageData);
    data = storageData;
    clearColumns();
    data.forEach(column => {
      columns.appendChild(createList(column.title, column.id));
      listCounter++;
      column.cards.forEach(card => {
        document
          .querySelector("#" + column.id)
          .appendChild(createCard(card.text));
        cardCounter++;
      });
    });
  }

  createAddAnotherListButton();
}

function createAddAnotherListButton() {
  let addAnotherList = createElement("button", {
    type: "button",
    textContent: "+ Add Another List",
    className: "addAnotherListButton"
  });
  addAnotherList.addEventListener("click", event => {
    columns.removeChild(addAnotherList);
    columns.appendChild(createListInput());
  });

  columns.appendChild(addAnotherList);
}

function createListInput() {
  let list = createElement("div", {
    className: "listInput"
  });

  let listTitle = createElement("input", {
    type: "text",
    placeholder: "Enter List Title"
  });

  list.appendChild(listTitle);

  let listButtons = createElement("div", {
    className: "listButtons"
  });

  let addListButton = createElement("button", {
    type: "button",
    textContent: "Add List"
  });
  addListButton.addEventListener("click", event => {
    data.push({
      id: "list-" + listCounter,
      title: listTitle.value,
      cards: []
    });
    columns.removeChild(list);
    window.localStorage.setItem("columns", JSON.stringify(data));
    render();
  });
  listButtons.appendChild(addListButton);

  let exitListButton = createElement("button", {
    type: "button",
    textContent: "x"
  });
  exitListButton.addEventListener("click", event => {
    columns.removeChild(list);
    createAddAnotherListButton();
  });
  listButtons.appendChild(exitListButton);

  list.appendChild(listButtons);

  return list;
}

function createList(title, listId) {
  let list = createElement("div", {
    className: "list",
    id: listId
  });

  let listTitle = createElement("h4", {
    type: "text",
    textContent: title
  });

  list.appendChild(listTitle);

  let listButtons = createElement("div", {
    className: "cardButtons"
  });

  let addListButton = createElement("button", {
    type: "button",
    textContent: "Add Card"
  });
  addListButton.addEventListener("click", event => {
    list.removeChild(addListButton);
    list.appendChild(createCardInput());
  });

  list.appendChild(addListButton);

  return list;
}

function createCardInput() {
  let card = createElement("div");
  let cardInput = createElement("input", {
    type: "text",
    placeholder: "Enter text for this card"
  });
  let cardButtons = createElement("div", {
    className: "cardButtons"
  });

  let addCardButton = createElement("button", {
    type: "button",
    textContent: "Add Card"
  });
  addCardButton.addEventListener("click", event => {
    console.log(listCounter);
    data[listCounter].cards.push({
      id: "card-" + cardCounter,
      text: cardInput.value
    });
    window.localStorage.setItem("columns", JSON.stringify(data));
    render();
  });
  cardButtons.appendChild(addCardButton);

  let exitCardButton = createElement("button", {
    type: "button",
    textContent: "x"
  });
  exitCardButton.addEventListener("click", event => {
    render();
  });
  cardButtons.appendChild(exitCardButton);
  card.appendChild(cardInput);
  card.appendChild(cardButtons);

  return card;
}

function createCard(text) {
  return createElement("p", {
    textContent: text,
    className: "card",
    id: "card-" + cardCounter
  });
}

function createElement(type, params) {
  let element = document.createElement(type);
  if (params) {
    Object.entries(params).forEach(parameter => {
      element[parameter[0]] = parameter[1];
    });
  }

  return element;
}

function clearColumns() {
  columns.innerHTML = "";
}
