async function createMenu() {
  const clearButton = document.getElementById("clearButton");
  const containers = {
    info: document.getElementById("infoCont"),
    settings: document.getElementById("settingsCont"),
    form: document.getElementById("formCont"),
    list: document.getElementById("artistList"),
    generator: document.getElementById("generatorCont"),
    save: document.getElementById("saveCont"),
  };

  const buttons = {
    info: document.getElementById("infoButton"),
    settings: document.getElementById("settingsButton"),
    form: document.getElementById("uploadButton"),
    list: document.getElementById("listButton"),
    generator: document.getElementById("genButton"),
    save: document.getElementById("saveButton"),
  };

  hideAllExcept([containers.info, containers.settings]);
  buttons.info.classList.add("selected");
  buttons.settings.classList.add("selected");

  buttons.info.onclick = function () {
    hideAllExcept([
      containers.info,
      containers.list,
      containers.generator,
      containers.save,
      containers.settings,
    ]);
    deselectAllExcept([buttons.info, buttons.list, buttons.generator, buttons.save, buttons.settings]);
    toggleSelect("info");
  };

  buttons.settings.onclick = function () {
    hideAllExcept([
      containers.settings,
      containers.info,
      containers.list,
      containers.generator,
      containers.save,
    ]);
    deselectAllExcept([buttons.settings, buttons.info, buttons.list, buttons.generator, buttons.save]);
    toggleSelect("settings");
  };

  buttons.form.onclick = function () {
    hideAllExcept([containers.form]);
    deselectAllExcept([buttons.form]);
    toggleSelect("form");
  };

  buttons.list.onclick = function () {
    hideAllExcept([containers.list, containers.info, containers.save, containers.settings]);
    deselectAllExcept([buttons.list, buttons.info, buttons.save, buttons.settings]);
    toggleSelect("list");
  };

  buttons.generator.onclick = function () {
    hideAllExcept([containers.generator, containers.info, containers.save, containers.settings]);
    deselectAllExcept([buttons.generator, buttons.info, buttons.save, buttons.settings]);
    new p5(clearCanvas);
    indexes = [];
    const artButtons = document.getElementsByClassName("artistBtn");
    for (const btn of artButtons) {
      btn.classList.remove("selected");
    }
    toggleSelect("generator");
  };

  buttons.save.onclick = function () {
    hideAllExcept([
      containers.save,
      containers.list,
      containers.info,
      containers.generator,
      containers.settings,
    ]);
    deselectAllExcept([buttons.save, buttons.list, buttons.info, buttons.generator, buttons.settings]);
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
