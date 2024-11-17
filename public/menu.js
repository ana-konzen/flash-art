async function createMenu() {
  const containers = {
    info: document.getElementById("infoCont"),
    form: document.getElementById("formCont"),
    list: document.getElementById("artistList"),
    generator: document.getElementById("generatorCont"),
  };

  const buttons = {
    info: document.getElementById("infoButton"),
    form: document.getElementById("uploadButton"),
    list: document.getElementById("listButton"),
    generator: document.getElementById("genButton"),
  };

  hideAllExcept([containers.info]);
  buttons.info.classList.add("selected");

  buttons.info.onclick = function () {
    hideAllExcept([containers.info, containers.list, containers.generator]);
    deselectAllExcept([buttons.info, buttons.list, buttons.generator]);
    toggleSelect("info", "block");
  };

  buttons.form.onclick = function () {
    hideAllExcept([containers.form]);
    deselectAllExcept([buttons.form]);
    toggleSelect("form", "block");
  };

  buttons.list.onclick = function () {
    hideAllExcept([containers.list, containers.info]);
    deselectAllExcept([buttons.list, buttons.info]);
    toggleSelect("list", "flex");
  };

  buttons.generator.onclick = function () {
    hideAllExcept([containers.generator, containers.info]);
    deselectAllExcept([buttons.generator, buttons.info]);
    new p5(clearCanvas);
    indexes = [];
    toggleSelect("generator", "flex");
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

  function toggleSelect(type, displayType) {
    if (buttons[type].classList.contains("selected")) {
      buttons[type].classList.remove("selected");
      containers[type].style.display = "none";
    } else {
      buttons[type].classList.add("selected");
      containers[type].style.display = displayType;
    }
  }
}
