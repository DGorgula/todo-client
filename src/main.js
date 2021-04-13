//      Welcome to Whatodo Code!
//    through the code there are lots of focus on the input, it's part of a feature I made.

// Get Request to pull the data from JsonBin
const input = document.getElementById("text-input");
input.focus();
const allTasks = { "my-todo": [] };
const list = document.getElementById("View");
const loadingDiv = document.getElementById("loading-div");
getPersistent(API_KEY, loadingDiv);
// updateList(allTasks, list);

//      first declerations
const commandInput = document.getElementById("command-input");
const addButton = document.getElementById("add-button");
const sortButton = document.getElementById("sort-button");
const menu = document.getElementById("menu");
const menuButton = document.getElementById("menu-button");
const main = document.getElementById("main");
const content = document.getElementById("content");
const completeAllButton = document.getElementById("complete-all-button");
const prioritySelectorArrows = document.getElementById("selector-svg");
const deleteAllButton = document.getElementById("delete-all-button");
if (content.getBoundingClientRect().height) {

}
document.addEventListener("keydown", (e) => {
  if (e.key === ":" && document.activeElement !== commandInput) {
    e.preventDefault();
    commandInput.value = ":";
    commandInput.focus();
  }
  else if (e.key === "Tab" && !document.querySelector('.current')) {
    const task = document.querySelector('.todo-container');
    task.classList.add('current');
    task.querySelector('.extended-data').style.display = 'flex';
    commandInput.focus();
    e.preventDefault();
  }
  else if (e.key === "Tab") {
    e.preventDefault();
  }
  else if (e.key === " " && document.activeElement === commandInput) {
    e.preventDefault();
  }
});

addButton.addEventListener("click", addTask);
deleteAllButton.addEventListener("click", deleteOrRestoreAll);
sortButton.addEventListener("click", sortList);
menu.addEventListener("click", menuLinksHandler);
menuButton.addEventListener('click', toggleMenu);
prioritySelectorArrows.addEventListener('click', changePriority);
completeAllButton.addEventListener('click', completeAll);
window.addEventListener('resize', fixMenuDisplay)

document.addEventListener("keyup", (e) => {
  const prioritySelector = document.getElementById("priority-selector");
  const navigator = document.getElementById("navigator");
  const currentInputNavigator = document.getElementById("current-input");
  if (e.key === "Escape") {
    navigator.innerText = "To Do";
    cleanPage();
    return;
  } else if (document.activeElement === input) {
    showOnly();
    if (e.key === "Enter") {
      addButton.click();
      return;
    }
    else if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    else if (e.key === "ArrowUp" && prioritySelector.selectedIndex < 4) {
      prioritySelector.selectedIndex++;
    } else if (e.key === "ArrowDown" && prioritySelector.selectedIndex > 0) {
      prioritySelector.selectedIndex--;
    }
    else {
      currentInputNavigator.innerText = " | " + input.value;
      // showOnly();
    }
  }
  else if (document.activeElement === commandInput && e.key === "ArrowDown") {
    const currentTask = document.querySelector('.current');
    if (!currentTask.nextSibling) {
      return;
    }
    else if (!currentTask.classList.contains('in-choice') && !currentTask.classList.contains('mouse-current')) {
      currentTask.querySelector('.extended-data').style.display = 'none';
    }
    const nextTask = currentTask.nextSibling;
    if (nextTask.getBoundingClientRect().top > document.documentElement.getBoundingClientRect().height) {
      window.scrollBy(0, document.documentElement.getBoundingClientRect().height)
    }
    nextTask.querySelector('.extended-data').style.display = 'flex';
    currentTask.classList.remove('current');
    nextTask.classList.add('current');
  }
  else if (document.activeElement === commandInput && e.key === "ArrowUp") {
    const currentTask = document.querySelector('.current');
    if (!currentTask.previousSibling) {
      return;
    }
    else if (!currentTask.classList.contains('in-choice') && !currentTask.classList.contains('mouse-current')) {
      currentTask.querySelector('.extended-data').style.display = 'none';

    }
    const previousTask = currentTask.previousSibling;
    if (previousTask.getBoundingClientRect().top < 0) {
      window.scrollBy(0, -document.documentElement.getBoundingClientRect().height)
    }
    currentTask.classList.remove('current');
    previousTask.querySelector('.extended-data').style.display = 'flex';
    previousTask.classList.add('current');
  }
  else if (document.activeElement === commandInput && e.key === " ") {
    const currentTask = document.querySelector('.current');
    console.log(currentTask);
    choose(currentTask);
    e.preventDefault();
  }
  else if (document.activeElement === commandInput && e.key === "Enter") {
    const list = document.getElementById("View");
    const keysetDiv = document.getElementById("keyboard-mode-keyset");
    const tasksInView = document.querySelectorAll(".todo-container");
    const navigator = document.getElementById("navigator");
    const currentInputNavigator = document.getElementById("current-input");
    const deleteAllButton = document.getElementById('delete-all-button');
    switch (commandInput.value) {
      case ":k":
        //show Keyboard-Mode keyset
        keysetDiv.hidden = false;
        commandInput.value = '';
        input.focus();
        return;
      case ":s":
        sortList(list.children);
        commandInput.value = '';
        input.focus();
        //sort the list
        return;
      case ":mi":
        navigator.innerText = "Important";
        //show all important tasks (as click on menu > important)
        break;
      case ":mt":
        navigator.innerText = "To Do";
        //show all to do tasks (as click on menu > to do)
        break;
      case ":mc":
        navigator.innerText = "Completed";
        //show all checked/completed tasks (as click on menu > checked)
        break;
      case ":md":
        navigator.innerText = "Deleted";
        //show all deleted tasks (as click on menu > deleted)
        break;
      case ":c":
        completeAllButton.click();
        //check all.
        break;
      case ":d":
        deleteAllButton.click();
        //delete all tasks in View
        break;
      case ":r":
        deleteAllButton.click();
        //restore all tasks in View
        break;
    }
    cleanPage();
    return;
  }
});



// all functions

function showOnly(showByStatus = "relevant") {
  const navigator = document.getElementById("navigator");
  const deleteAllButton = document.getElementById("delete-all-button");
  checkAllToUncheckAllAndReversed(completeAllButton, 'check')
  deleteAllToRestoreAllAndReversed(deleteAllButton, 'delete');
  if (navigator.innerText !== "" && navigator.innerText !== "To Do") {
    showByStatus = navigator.innerText.toLowerCase();
  }
  const stringToFilter = input.value;
  if (showByStatus === "important") {
    const filtered = allTasks["my-todo"].filter((item) => {
      return item.priority > 2 && item.text.includes(stringToFilter) && item['data-status'] !== 'deleted';
    });
    list.replaceChildren();
    recreateView(filtered);
    return;
  } else if (showByStatus) {
    if (showByStatus === 'deleted') {
      deleteAllToRestoreAllAndReversed(deleteAllButton, 'restore');

    }
    else if (showByStatus === 'completed') {
      checkAllToUncheckAllAndReversed(completeAllButton, 'uncheck')

    }
    const filtered = allTasks["my-todo"].filter((item) => {
      return (
        item["data-status"] === showByStatus &&
        item.text.includes(stringToFilter)
      );
    });
    list.replaceChildren();
    recreateView(filtered);
    return;
  }
}

function sortList() {
  const fragment = document.createDocumentFragment();
  const listItems = Array.from(list.children);
  const orderedListItems = listItems.sort((firstItem, secondItem) => {
    const firstPriorityItem = firstItem.querySelector(".todo-priority")
      .innerText;
    const secondPriorityItem = secondItem.querySelector(".todo-priority")
      .innerText;
    return secondPriorityItem - firstPriorityItem;
  });
  for (const item of orderedListItems) {
    fragment.append(item);

  }
  list.append(fragment);
}

function updateCounter() {
  const relevantTasks = allTasks["my-todo"].filter((task) => {
    return task['data-status'] === 'relevant';
  });
  const completedTasks = allTasks["my-todo"].filter((task) => {
    return task['data-status'] === 'completed';
  });
  const deletedTasks = allTasks["my-todo"].filter((task) => {
    return task['data-status'] === 'deleted';
  });
  const importantTasks = allTasks["my-todo"].filter((task) => {
    return task.priority > 2 && !(task['data-status'] === 'deleted');
  });
  document.getElementById("todo-counter").innerText = relevantTasks.length;
  document.getElementById("important-counter").innerText = importantTasks.length;
  document.getElementById("completed-counter").innerText = completedTasks.length;
  document.getElementById("deleted-counter").innerText = deletedTasks.length;
  document.getElementById("counter").innerText = list.querySelectorAll('.todo-container').length;
}

function createElementWithAttribute(element, attributeType, attributValue) {
  const newElement = document.createElement(element);
  newElement[attributeType] = attributValue;
  return newElement;
}

function recreateView(listToView = allTasks["my-todo"]) {
  for (const item of listToView) {
    const task = createElementWithAttribute(
      "div",
      "className",
      "todo-container"
    );
    const taskPriority = createElementWithAttribute(
      "div",
      "className",
      "todo-priority"
    );
    const taskCreationTime = createElementWithAttribute(
      "div",
      "className",
      "todo-created-at"
    );
    const taskText = createElementWithAttribute(
      "div",
      "className",
      "todo-text"
    );
    task.dataset["status"] = item["data-status"];
    const trashSpan = createElementWithAttribute(
      "span",
      "className",
      "delete-button"
    );
    const checkbox = createElementWithAttribute("input", "type", "checkbox");
    const mainData = createElementWithAttribute("section", "className", "main-data");
    const extendedData = createElementWithAttribute("section", "className", "extended-data");
    trashSpan.value = "delete";
    trashSpan.addEventListener("click", deleteTasks);
    checkbox.className = "checkbox";
    checkbox.addEventListener("click", completeTask);
    // const randomColor = createRandomColor();
    taskPriority.innerText = item.priority;
    taskPriority.style.display = "none";
    taskCreationTime.innerText = item.date;
    taskText.innerText = item.text;
    extendedData.append(taskCreationTime, taskPriority, trashSpan);
    mainData.append(checkbox, taskText);
    extendedData.style.display = 'none';
    task.append(mainData, extendedData);
    if (item["data-status"] === "completed") {
      checkbox.checked = true;
      checkbox.classList.add('checked');
    } else if (item["data-status"] === "deleted") {
      checkbox.hidden = true;
      trashSpan.value = "Restore";
      trashSpan.classList.add('deleted');
    }
    task.addEventListener('mouseover', (e) => {
      if (task && e.toElement === task) {
        task.querySelector('.extended-data').style.display = 'flex';
        task.classList.add('mouse-current');
        // e.stopPropagation();
      }
    });
    task.addEventListener('mouseout', (e) => {
      if (!e.toElement) {
        return;
      }
      if (e.toElement.classList.contains('todo-container') || e.toElement.id === 'content' || e.toElement.classList.contains('no-outline')) {
        if (e.fromElement === task && !task.classList.contains('in-choice') && !task.classList.contains('current')) {
          task.querySelector('.extended-data').style.display = 'none';
        }
        task.classList.remove('mouse-current');
      }
    });
    task.addEventListener('click', choose);
    list.append(task);
  }
}

function deleteTasks(tasksToDelete, loadingDiv, action) {
  toggleLoadingScreen(loadingDiv)
  if (action) {
    if (tasksToDelete.length === undefined) {
      // differ between single and multiple
      tasksToDelete = tasksToDelete.target.parentElement;
      deleteOrRestoreTask(tasksToDelete, action);
    } else {
      for (const task of tasksToDelete) {
        deleteOrRestoreTask(task, action);
      }
    }
  } else {
    if (tasksToDelete.length === undefined) {
      // differ between single and multiple
      tasksToDelete = tasksToDelete.target.closest('.todo-container');
      if (tasksToDelete.dataset.status !== "deleted") {
        deleteOrRestoreTask(tasksToDelete, "delete");
      } else {
        deleteOrRestoreTask(tasksToDelete, "restore");
      }
    }
  }
  const hideLoadingDiv = true;
  setPersistent(API_KEY, loadingDiv, allTasks, hideLoadingDiv);
}

function completeTasks(tasksToComplete, loadingDiv, action) {
  toggleLoadingScreen(loadingDiv)

  if (action) {
    if (tasksToComplete.length === undefined) {
      // differ between single and multiple
      tasksToComplete = tasksToComplete.target.parentElement;
      completeTask(tasksToComplete, action);
    } else {
      for (const task of tasksToComplete) {
        completeTask(task, action);
      }
    }
  } else {
    if (tasksToComplete.length === undefined) {
      // differ between single and multiple
      tasksToComplete = tasksToComplete.target.parentElement;
      if (tasksToComplete.dataset.status !== "completed") {
        completeTask(tasksToComplete, "check");
      } else {
        completeTask(tasksToComplete, "uncheck");
      }
    }
  }
  const hideLoadingDiv = true;
  setPersistent(API_KEY, loadingDiv, allTasks, hideLoadingDiv);
}
//      consider to unite taskCompleter and deleteTasks functions
function dataStatusChanger(elementOrObjectType, elementOrObject) {
  if (elementOrObjectType === "element") {
    const task = elementOrObject.closest('.todo-container');
    if (task.dataset.status === "completed") {
      task.dataset.status = "relevant";
      return;
    }
    task.dataset.status = "completed";
    return;
  }
  if (elementOrObject["data-status"] === "completed") {
    elementOrObject["data-status"] = "relevant";
    return;
  } else if (elementOrObject["data-status"] === "relevant") {
    elementOrObject["data-status"] = "completed";
  }
}
function completeTask(task) {
  if (task.target) {
    task = task.target;
  }
  const taskDate = task.closest('.todo-container').querySelector('.todo-created-at');
  dataStatusChanger("element", task);
  const currentTaskObj = allTasks["my-todo"].filter((item) => {
    if (item.date === taskDate.innerText) {
      dataStatusChanger("object", item);
      return true;
    }
  });
  cleanPage();
}
function cleanPage() {
  const keysetDiv = document.getElementById("keyboard-mode-keyset");
  const currentInputNavigator = document.getElementById("current-input");
  currentInputNavigator.innerText = "";
  keysetDiv.hidden = true;
  commandInput.value = "";
  input.value = "";
  input.focus();
  updateCounter();
  showOnly();
}

// async to avoid breaking network flow.
function addMultipleTasks(multipleValue, loadingDiv) {
  realLoadingDiv = document.getElementById('loading-div');
  toggleLoadingScreen(loadingDiv);
  const seperatedValues = multipleValue.split(",");
  const isLastValue = true;
  const isMultipleTasks = true;
  const lastValueIndex = seperatedValues.length - 1;
  for (const value of seperatedValues) {
    if (!value.trim()) {
      continue;
    }
    if (lastValueIndex === seperatedValues.indexOf(value)) {
      addTask(value.trim(), isLastValue, isMultipleTasks);
    }
    else {
      addTask(value.trim(), !isLastValue, isMultipleTasks);
    }
  }
}

function deleteOrRestoreTask(task, action) {
  if (task.length === 0) {
    return;
  }
  if (action === "delete") {
    toStatus = "deleted";
    checkboxHiddenToState = true;
    toButtonContent = "Restore";
  } else if (action === "restore") {
    toStatus = "relevant";
    checkboxHiddenToState = false;
    toButtonContent = "delete";
  }
  task.dataset.status = toStatus;
  task.querySelector(".checkbox").hidden = checkboxHiddenToState;
  relevantTasks = allTasks["my-todo"].filter((item) => {
    if (item.date === task.querySelector(".todo-created-at").innerText) {
      item["data-status"] = toStatus;
    }
    return;
  });
  task.hidden = true;
  showOnly();
}

function deleteOrRestoreAll(event) {
  let deleteButtonText = event.target.dataset.action;
  const editedDeleteButtonText = deleteButtonText
    .toLowerCase()
    .slice(0, 7)
    .trim();
  let itemsToDeleteOrRestore = list.querySelectorAll('.todo-container')
  const inChoice = Array.from(list.querySelectorAll('.in-choice'));
  if (inChoice.length > 0) {
    itemsToDeleteOrRestore = inChoice;
  }
  if (itemsToDeleteOrRestore.length <= 0) {
    alert(`There's nothing to ${editedDeleteButtonText}..`);
    return;
  }
  const action = editedDeleteButtonText;
  deleteTasks(itemsToDeleteOrRestore, loadingDiv, action);
  // deleteAllToRestoreAllAndReversed(event.target);
  cleanPage();
}
function deleteAllToRestoreAllAndReversed(deleteAllButton, action) {
  if (action) {
    deleteAllButton.dataset.action = action;
    return;
  }
  if (deleteAllButton.dataset.action === "delete") {

    deleteAllButton.dataset.action = "restore";
  } else {
    deleteAllButton.dataset.action = "delete";
  }
}
function checkAllToUncheckAllAndReversed(deleteAllButton, action) {
  if (action) {
    completeAllButton.dataset.action = action;
    return;
  }
  if (completeAllButton.dataset.action === "check") {

    completeAllButton.dataset.action = "uncheck";
  } else {
    completeAllButton.dataset.action = "check";
  }
}
function menuLinksHandler(menuLink) {
  const navigator = document.getElementById("navigator");
  const navigationLink = menuLink.target.closest('.navigation-link');
  if (navigationLink) {
    navigator.innerText = navigationLink.querySelector('.counter-text').innerText;
    cleanPage();
  }

  if (document.body.getBoundingClientRect().width <= 700) {
    toggleMenu();
  }
}

function containerButtonsCallback(e) {
  if (e.target.className === "checkbox") {
    const checkbox = e.target;
    completeTask(checkbox);
  } else if (e.target.className === "delete-button") {
    deleteTasks(e.target.parentElement, loadingDiv);
  }
}
function addTask(valueToAdd, isLastValue = true, isMultipleTasks = false) {
  const loadingDiv = document.getElementById('loading-div');
  const newTaskpriority = document.getElementById("priority-selector").value;
  let newTaskString;
  if (typeof valueToAdd === "string") {
    newTaskString = valueToAdd;
  } else {
    newTaskString = input.value;
  }

  if (!newTaskString.trim()) {
    alert("try to enter tasks you wish to remember");
    return;
  } else if (newTaskString.includes(",")) {
    addMultipleTasks(newTaskString, loadingDiv);
    return;
  }
  else if (!isMultipleTasks) {
    toggleLoadingScreen(loadingDiv);
  }
  //          create new task
  const newTaskStatus = "relevant";
  let temporaryDate = new Date();
  temporaryDate = temporaryDate.setHours(temporaryDate.getHours() + 2);
  const newTaskTime = new Date(temporaryDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  allTasks["my-todo"].push({
    text: newTaskString,
    priority: newTaskpriority,
    date: newTaskTime,
    "data-status": newTaskStatus,
  });
  recreateView(allTasks["my-todo"][-1]);

  //      reset page
  updateCounter();
  cleanPage();
  showOnly();
  setPersistent(API_KEY, loadingDiv, allTasks, isLastValue);

}


// need to unite priority change by keyboard and priority change by mouse to the same function.
function changePriority(event) {
  const prioritySelector = document.getElementById('priority-selector');
  const priorityTop = prioritySelectorArrows.getBoundingClientRect().top;
  const priorityHeight = prioritySelectorArrows.getBoundingClientRect().height;
  if (event.y < priorityTop + (priorityHeight / 2) && prioritySelector.selectedIndex < 4) {
    prioritySelector.selectedIndex++;
    return;
  }
  else if (event.y > priorityTop + (priorityHeight / 2) && prioritySelector.selectedIndex > 0) {
    prioritySelector.selectedIndex--;
  }

}
function choose(event) {
  let task = event;
  if (event.target) {
    console.log("a");
    task = event.target;
  }

  if (task.classList.contains('in-choice')) {
    task.classList.remove('in-choice');
    return;
  }
  task.classList.add('in-choice');
}
function completeAll(tasks) {
  let completeButtonText = event.target.dataset.action;
  const editedCompleteButtonText = completeButtonText;
  let itemsToComplete = list.querySelectorAll('.todo-container')
  const inChoice = Array.from(list.querySelectorAll('.in-choice'));
  if (inChoice.length > 0) {
    itemsToComplete = inChoice;
  }
  if (itemsToComplete.length <= 0) {
    alert(`There's nothing to ${editedCompleteButtonText}..`);
    return;
  }
  completeTasks(itemsToComplete, loadingDiv, editedCompleteButtonText);
}

function createRandomColor() {
  const redHue = Math.floor(Math.random() * 256);
  const greenHue = Math.floor(Math.random() * 256);
  const blueHue = Math.floor(Math.random() * 256);
  const randomColor = `${redHue}, ${greenHue}, ${blueHue}`;

  return randomColor;
}
function toggleLoadingScreen() {
  const loadingDiv = document.getElementById('loading-div');
  if (!loadingDiv.classList.contains('show-loading-div')) {
    loadingDiv.classList.add('show-loading-div');
    return;
  }
  else {
    loadingDiv.classList.remove('show-loading-div');
  }
}

function toggleMenu() {
  const menu = document.getElementById('menu');
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
    return;
  }
  menu.style.display = 'block';
}

function fixMenuDisplay(event) {
  const menu = document.getElementById('menu');
  const menuDisplayState = menu.style.display;
  if (event.target.innerWidth > 750 && menuDisplayState === 'none') {
    menu.style.display = 'block';
  }
  else if (event.target.innerWidth <= 750 && menuDisplayState === 'block') {
    menu.style.display = 'none';
  }

}