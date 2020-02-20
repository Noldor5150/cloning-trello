const columns = document.querySelector("#columns");
let data = [];
let startCardObject = null;
let startCardIndex = -1;
let startListIndex = -1;
let finishCardIndex = -1;
let finishListIndex = -1;

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
      let cardContainer = createElement("div", { className: "cardContainer" });
      columns.appendChild(list);
      column.cards.forEach((card, cardIndex) => {
        cardContainer.appendChild(createCard(card, cardIndex, listIndex));
      });
      list.appendChild(cardContainer);
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

  let titleContainer = createElement("div", { className: "titleContainer" });

  titleContainer.addEventListener("dragover", event => {
    event.preventDefault();
    if (finishCardIndex == -1) {
      if (document.querySelector(".cardSpace")) {
        document
          .querySelector(".cardSpace")
          .parentNode.removeChild(document.querySelector(".cardSpace"));
      }
      list.lastChild.appendChild(createCardSpace());
    }
  });

  list.addEventListener("dragover", event => {
    event.preventDefault();
    if (startListIndex !== listIndex) {
      finishListIndex = listIndex;
    }
  });

  titleContainer.addEventListener("dragenter", event => {
    event.preventDefault();
    // if (document.querySelector('.cardSpace')) {
    //   document
    //     .querySelector('.cardSpace')
    //     .parentNode.removeChild(document.querySelector('.cardSpace'));
    // }
  });

  list.addEventListener("dragenter", event => {
    event.preventDefault();
  });

  list.addEventListener("dragleave", event => {
    event.preventDefault();
  });

  list.addEventListener("drop", event => {
    if (finishListIndex > -1 && finishCardIndex > -1) {
      data[startListIndex].cards.splice(startCardIndex, 1);
      data[listIndex].cards.splice(finishCardIndex, 0, startCardObject);
    }
    if (finishListIndex > -1 && finishCardIndex == -1) {
      data[startListIndex].cards.splice(startCardIndex, 1);
      data[listIndex].cards.push(startCardObject);
    }
    if (finishListIndex == -1 && finishCardIndex > -1) {
      data[startListIndex].cards.splice(startCardIndex, 1);
      data[listIndex].cards.splice(finishCardIndex, 0, startCardObject);
    }

    resetVariables();
    window.localStorage.setItem("columns", JSON.stringify(data));
    render();
  });

  let listTitle = createElement("h4", {
    type: "text",
    textContent: title
  });

  titleContainer.appendChild(listTitle);

  let addListButton = createElement("button", {
    type: "button",
    textContent: "Add Card"
  });
  addListButton.addEventListener("click", event => {
    list.removeChild(addListButton);
    list.appendChild(createCardInput(listIndex));
  });

  titleContainer.appendChild(addListButton);
  list.appendChild(titleContainer);

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

function createCard(cardData, cardIndex, listIndex) {
  let card = createElement("p", {
    textContent: cardData.text,
    className: "card",
    draggable: true
  });

  card.addEventListener("drag", event => {
    startCardObject = cardData;
    startCardIndex = cardIndex;
    startListIndex = listIndex;
    card.className = "cardShadow";
    card.textContent = "";
  });

  card.addEventListener("dragend", event => {
    render();
  });

  card.addEventListener("dragover", event => {
    if (cardIndex !== startCardIndex || listIndex !== startListIndex) {
      finishCardIndex = cardIndex;
      if (!document.querySelector(".cardSpace")) {
        let cardSpace = createCardSpace();
        cardSpace.addEventListener("dragover", event => {
          if (cardIndex !== startCardIndex || listIndex !== startListIndex) {
            finishCardIndex = cardIndex;
          }
        });
        if (document.querySelector(".cardShadow")) {
          document
            .querySelector(".cardShadow")
            .parentNode.removeChild(document.querySelector(".cardShadow"));
        }
        console.log(finishCardIndex);

        if (data[listIndex].cards.length - 1 !== cardIndex) {
          card.parentNode.insertBefore(cardSpace, card);
          console.log("before");
        } else {
          card.parentNode.insertBefore(cardSpace, card.nextSibling);
          console.log("after");
        }
      }
    }
  });

  card.addEventListener("dragenter", event => {
    event.preventDefault();
    if (document.querySelector(".cardSpace")) {
      document
        .querySelector(".cardSpace")
        .parentNode.removeChild(document.querySelector(".cardSpace"));
    }
  });

  card.addEventListener("dragleave", event => {
    event.preventDefault();
    if (cardIndex == finishCardIndex) {
      finishCardIndex = -1;
    }
  });

  return card;
}

function createCardSpace() {
  return createElement("div", { className: "cardSpace" });
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
  startCardObject = null;
  startCardIndex = -1;
  startListIndex = -1;
  finishCardIndex = -1;
  finishListIndex = -1;
}
