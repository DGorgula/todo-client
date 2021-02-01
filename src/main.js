// list.replaceChildren();   important code for recreateView()
//      here the code begin to run!
const input = document.getElementById('text-input');
const commandInput = document.getElementById('command-input');
input.focus();
const allTasks = {'my-todo': []};
const list = document.getElementById('View');
updateList(allTasks, list);
const addButton = document.getElementById('add-button');
const sortButton = document.getElementById('sort-button');
const menu = document.getElementById('menu');
const deleteAllButton = document.getElementById('delete-all-button');
document.addEventListener('keydown', (e) => {
    if (e.key === ':' && document.activeElement !== commandInput) {
        e.preventDefault();
        commandInput.value = ':';
        commandInput.focus();
        
    }
});

deleteAllButton.addEventListener('click', deleteOrRestoreAll);

function deleteOrRestoreAll(event) {
    const action = event.target.innerText.toLowerCase().slice(0,7).trim();
    console.log(action);
    deleteTasks(list.children, action);
    pageClean();
}
onclick="deleteTasks(list.children)"        /// build event listener
document.addEventListener('keyup', (e) => {
    const prioritySelector = document.getElementById('priority-selector');
    const navigator = document.getElementById('navigator');
    const currentInputNavigator = document.getElementById('current-input');
    if (e.key === 'Escape') {
        navigator.innerText = 'All';
        pageClean();
        return;
    }
    else if(document.activeElement === input) {
        showOnly();
        if (e.key === 'Enter') {
            addButton.click();
            return;
        }
        else if (e.key === 'ArrowUp') {
            
            prioritySelector.selectedIndex++;
        }
        else if (e.key === 'ArrowDown') {
            prioritySelector.selectedIndex--;
            
        }
        else {
            currentInputNavigator.innerText = ' > '+input.value;
            // showOnly();
        }
    }
    else if (document.activeElement === commandInput && e.key === 'Enter') {
        const tasksInView =  document.querySelectorAll('.todo-container');
        const navigator =  document.getElementById('navigator');
        const currentInputNavigator = document.getElementById('current-input');
        switch (commandInput.value) {
            case ':s':
                //sort the list
                sortList();
                break;
            case ':+':
                //font-size increase
                break;
            case ':-':
                //font-size decrease
                break;
            case ':mi':
                //show all important tasks (as click on menu > important)
                navigator.innerText = 'important';
                break;
            case ':mc':
                navigator.innerText = 'completed';
                //show all checked/completed tasks (as click on menu > checked)
                break;
            case ':md':
                navigator.innerText = 'deleted';
                    //show all deleted tasks (as click on menu > deleted)
                break;
            case ':c':
                //check current. c[1-9] will check the containter 
                break;
            case ':d1':
                deleteTasks(tasksInView[0]);
                //delete current. d[1-9] will delete the containter 
                break;
                case ':da':
                deleteTasks(tasksInView);
                //delete all tasks in View
                break;
                default:
                    break;
                }
                pageClean()
                return;
    }
})
sortButton.addEventListener('click', sortList);

menu.addEventListener('click', menuLinksHandler);

function menuLinksHandler(menuLink) {
    if (menuLink.target.id === 'menu') {
        return;
    }
    const navigator =  document.getElementById('navigator');
    navigator.innerText = menuLink.target.innerText.toLowerCase();
    pageClean();
}

function containerButtonsCallback(e) {
    if (e.target.className === 'checkbox') {
        const checkbox = e.target;
        taskCompleter(checkbox);
    }
    else if(e.target.className === 'delete-button'){
        deleteTasks(e.target.parentElement);
    }

}
addButton.addEventListener('click', addTask);
function addTask(valueToAdd) {
    let newTaskString;
    if (typeof(valueToAdd) === 'string') {
        newTaskString = valueToAdd;
    }
    else {
        newTaskString = input.value;
    }

    if (!newTaskString.trim()) {
        alert('try to enter tasks you wish to remember');
        return;
    }
    else if (newTaskString.includes(',')) {
        addMultipleTasks(newTaskString);
        return;
    }
    //          create new task
    const newTaskpriority = document.getElementById('priority-selector');
    const newTaskStatus = 'relevant';
    let temporaryDate = new Date();
    temporaryDate = temporaryDate.setHours(temporaryDate.getHours()+2);
    const newTaskTime = new Date(temporaryDate).toISOString().slice(0, 19).replace('T', ' ');
    allTasks['my-todo'].push(
        {
            text: newTaskString,
            priority: newTaskpriority.value,
            date: newTaskTime,
            'data-status': newTaskStatus
        }
        );
        recreateView(allTasks['my-todo'][-1]);
        
        //      reset page
        updateCounter();
        pageClean();
        showOnly();
        try{
        return setPersistent(API_KEY, allTasks);
        }
        catch(e) {
            alert('There was a problem sending data to the server,\n Please try to reload and repeat your last actions.\nThe specific error message is:\n' + e);
        }
}

function showOnly(showByStatus = 'relevant') {
    const navigator = document.getElementById('navigator');
    if (navigator.innerText !== '' && navigator.innerText !== 'All') {
        showByStatus = navigator.innerText;
    }
    const stringToFilter = input.value;
    if (showByStatus === 'important') {
        const filtered = allTasks['my-todo']
        .filter((item) => {
        return item.priority > 2 && item.text.includes(stringToFilter);
        })
        list.replaceChildren();
        recreateView(filtered);
        return;
    }
    else if(showByStatus){
        const filtered = allTasks['my-todo']
        .filter((item) => {
        return (item['data-status'] === showByStatus && item.text.includes(stringToFilter));
        })
        list.replaceChildren();
        recreateView(filtered);
        return;
    }
}


function sortList() {
    const fragment = document.createDocumentFragment();
    const listItems = Array.from(list.children);
    const orderedListItems = listItems
    .sort((firstItem, secondItem)=> {
        const firstItemPriority = firstItem.querySelector('.todo-priority').innerText;
        const secondItemPriority = secondItem.querySelector('.todo-priority').innerText;
        return secondItemPriority - firstItemPriority;
    });

    for (const item of orderedListItems) {
        fragment.append(item);
    }
    list.appendChild(fragment);
}

function updateCounter() {
    document.getElementById('counter').innerText = list.children.length;
}

function createElementWithAttribute(element, attributeType, attributValue ) {
    const newElement = document.createElement(element);
    newElement[attributeType] = attributValue;
    return newElement;
}

function recreateView(listToView = allTasks['my-todo']) {
    for (const item of listToView ) {
        const task = createElementWithAttribute('div', 'className', 'todo-container');
        const taskPriority = createElementWithAttribute('div', 'className', 'todo-priority');
        const taskCreationTime = createElementWithAttribute('div', 'className', 'todo-created-at');
        const taskText = createElementWithAttribute('div', 'className', 'todo-text');
        task.dataset['status'] = item['data-status']
        const trashSpan = createElementWithAttribute('span', 'className', 'delete-button');
        trashSpan.innerText = 'delete';
        trashSpan.addEventListener( 'click', deleteTasks);
        const checkbox = createElementWithAttribute('input', 'type', 'checkbox');
        checkbox.className = 'checkbox';
        checkbox.addEventListener('click', taskCompleter);
        taskPriority.innerText = item.priority;
        taskCreationTime.innerText = item.date;
        taskText.innerText = item.text;
        task.append(checkbox, taskText, taskCreationTime,  taskPriority, trashSpan);
        if (item['data-status'] === 'completed') {
            checkbox.checked = true;
        }
        else if (item['data-status'] === 'deleted') {
            checkbox.hidden = true;
            trashSpan.innerText = 'Restore';
        }
        list.append(task);
    }
  }

async function deleteTasks(tasksToDelete, action) {
    if (action) {
        if(tasksToDelete.length === undefined) {        // differ between single and multiple 
            tasksToDelete = tasksToDelete.target.parentElement;
            deleteOrRestoreTask(tasksToDelete, action);
        }
        else {
            for (const task of tasksToDelete) {
                deleteOrRestoreTask(task, action);
            }
        }
    }
    else {
        if (tasksToDelete.dataset.status !== 'deleted') {
            deleteOrRestoreTask(tasksToDelete, 'delete');
        }
        else {
            deleteOrRestoreTask(tasksToDelete, 'restore');
        }
    }
    try{
        await setPersistent(API_KEY, allTasks);
    }
    catch(e) {
        alert('There was a problem sending data to the server,\n Please try to reload and repeat your last actions.\nThe specific error message is:\n' + e);
    }
    showOnly();
}
            //      consider to unite taskCompleter and deleteTasks functions
function dataStatusChanger(elementOrObjectType, elementOrObject) {
    if (elementOrObjectType === 'element') {
        console.log(elementOrObject);
        if (elementOrObject.parentElement.dataset.status === 'completed') {
            elementOrObject.parentElement.dataset.status = 'relevant';
            return;
        }
        elementOrObject.parentElement.dataset.status = 'completed';
        return;
    }
    if(elementOrObject['data-status'] === 'completed'){
        elementOrObject['data-status'] = 'relevant';
        return;
    }
    else if(elementOrObject['data-status'] === 'relevant') {
        elementOrObject['data-status'] = 'completed';
    }
}
function taskCompleter(task) {
    if(task.target){
        task= task.target;
    }
    console.log("im here!", task.target);
    dataStatusChanger('element', task);
    console.log("sadf");
    const currentTaskObj = allTasks['my-todo']
    .filter((item) => {
        if(item.date === task.parentElement.querySelector('.todo-created-at').innerText){
            dataStatusChanger('object', item)
            return true;
        }
    });
    pageClean();
    try{
        setPersistent(API_KEY, allTasks);
    }
    catch(e) {
        alert('There was a problem sending data to the server,\n Please try to reload and repeat your last actions.\nThe specific error message is:\n' + e);
    }
}
function pageClean() {
    const currentInputNavigator = document.getElementById('current-input');
    currentInputNavigator.innerText = '';
    commandInput.value= '';
    input.value = '';
    input.focus();
    showOnly();
}

// async to avoid breaking network flow.
async function addMultipleTasks(multipleValue) {
    const seperatedValues = multipleValue.split(',');
    for (const value of seperatedValues) {
        await addTask(value.trim());   
    }
}

function menuHandler(params) {
    console.log(" i am not defined!");
}

function deleteOrRestoreTask(task, action) {
    if (action === 'delete') {
        toStatus = 'deleted';
        checkboxHiddenToState = true;
        toButtonContent = "Restore";
    }
    else if (action === 'restore') {
        toStatus = 'relevant';
        checkboxHiddenToState = false;
        toButtonContent = 'delete';
    }
    
    task.dataset.status = toStatus;
    task.querySelector('.checkbox').hidden = checkboxHiddenToState;
    task.querySelector('.delete-button').innerText = toButtonContent;
    relevantTasks = allTasks['my-todo']
    .filter((item) => {
        if(item.date === task.querySelector('.todo-created-at').innerText) {
            item['data-status'] = toStatus;
            }
            return;
        });
        task.hidden = true;
    }