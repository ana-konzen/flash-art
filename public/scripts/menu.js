async function createMenu() {
  const clearButton = document.getElementById("clearButton");
  const containers = {
    info: document.getElementById("infoCont"),
    form: document.getElementById("formCont"),
    list: document.getElementById("artistList"),
    generator: document.getElementById("generatorCont"),
    save: document.getElementById("saveCont"),
    seed: document.getElementById("seedCont"),
  };

  const buttons = {
    info: document.getElementById("infoButton"),
    form: document.getElementById("uploadButton"),
    list: document.getElementById("listButton"),
    generator: document.getElementById("genButton"),
    save: document.getElementById("saveButton"),
  };

  hideAllExcept([containers.info, containers.seed]);
  buttons.info.classList.add("selected");

  buttons.info.onclick = function () {
    hideAllExcept([containers.info, containers.list, containers.generator, containers.save, containers.seed]);
    deselectAllExcept([buttons.info, buttons.list, buttons.generator, buttons.save]);
    toggleSelect("info");
  };

  buttons.form.onclick = function () {
    hideAllExcept([containers.form]);
    deselectAllExcept([buttons.form]);
    toggleSelect("form");
  };

  buttons.list.onclick = function () {
    hideAllExcept([containers.list, containers.info, containers.save, containers.seed]);
    deselectAllExcept([buttons.list, buttons.info, buttons.save]);
    toggleSelect("list");
    containers.seed.style.display = "block";
  };

  buttons.generator.onclick = function () {
    hideAllExcept([containers.generator, containers.info, containers.save, containers.seed]);
    deselectAllExcept([buttons.generator, buttons.info, buttons.save]);
    new p5(clearCanvas);
    indexes = [];
    const artButtons = document.getElementsByClassName("artistBtn");
    for (const btn of artButtons) {
      btn.classList.remove("selected");
    }
    toggleSelect("generator");
    containers.seed.style.display = "block";
  };

  buttons.save.onclick = function () {
    hideAllExcept([containers.save, containers.list, containers.info, containers.generator, containers.seed]);
    deselectAllExcept([buttons.save, buttons.list, buttons.info, buttons.generator]);
    toggleSelect("save");
  };

  function hideAllExcept(containersToShow) {
    Object.values(containers).forEach((section) => {
      if (!containersToShow.includes(section)) {
        section.style.display = "none";
      }
    });
  }

  function deselectAllExcept(buttonsToSelect) {
    Object.values(buttons).forEach((button) => {
      if (!buttonsToSelect.includes(button)) {
        button.classList.remove("selected");
      }
    });
  }

  function toggleSelect(type) {
    if (buttons[type].classList.contains("selected")) {
      buttons[type].classList.remove("selected");
      containers[type].style.display = "none";
    } else {
      buttons[type].classList.add("selected");
      containers[type].style.display = "block";
    }
  }

  clearButton.onclick = function () {
    const minusButtons = document.querySelectorAll(".minus");
    minusButtons.forEach((btn) => {
      btn.disabled = true;
      btn.classList.add("disabled");
    });
    indexes = [];
    new p5(clearCanvas);
    const artButtons = document.getElementsByClassName("artistBtn");
    for (const btn of artButtons) {
      btn.classList.remove("selected");
    }
  };
}
