let addList = false;
const columns = document.querySelector("#columns");
let data = [];
let draggableCardObject = null;
let draggableCardIndex = -1;
let dragggableListIndex = -1;

window.addEventListener("load", event => {
  render();
});

function render() {
  let storageData = window.localStorage.getItem("columns");
  if (storageData != null) {
    storageData = JSON.parse(storageData);
    data = storageData;
    clearColumns();

    data.forEach((column, listIndex) => {
      let list = createList(column.title, listIndex);
      columns.appendChild(list);
      column.cards.forEach((card, cardIndex) => {
        list.appendChild(createCard(card, cardIndex, listIndex));
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

function createList(title, listIndex) {
  let list = createElement("div", {
    className: "list"
  });

  list.addEventListener("dragover", event => {
    event.preventDefault();
  });

  list.addEventListener("dragenter", event => {
    event.preventDefault();
  });

  list.addEventListener("drop", event => {
    console.log(event);
    data[listIndex].cards.push(draggableCardObject);
    data[dragggableListIndex].cards.splice(draggableCardIndex, 1);
    resetVariables();
    console.log(data);
    window.localStorage.setItem("columns", JSON.stringify(data));
    render();
  });

  let listTitle = createElement("h4", {
    type: "text",
    textContent: title
  });

  list.appendChild(listTitle);

  let addListButton = createElement("button", {
    type: "button",
    textContent: "Add Card"
  });
  addListButton.addEventListener("click", event => {
    list.removeChild(addListButton);
    list.appendChild(createCardInput(listIndex));
  });

  list.appendChild(addListButton);

  return list;
}

function createCardInput(listIndex) {
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
    data[listIndex].cards.push({
      text: cardInput.value,
      isDragging: false
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

function createCard(cardData, cardIndex, listIndex) {
  let card = createElement("p", {
    textContent: cardData.text,
    className: "card",
    draggable: true
  });
  card.addEventListener("drag", event => {
    draggableCardObject = cardData;
    draggableCardIndex = cardIndex;
    dragggableListIndex = listIndex;
  });
  return card;
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

function resetVariables() {
  draggableCardObject = null;
  draggableCardIndex = -1;
  dragggableListIndex = -1;
}
