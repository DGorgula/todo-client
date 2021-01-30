
//      here the code begin to run!
const input = document.getElementById('text-input');
input.focus();
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        addButton.click();
    }
})
const allToDos = {'my-todo': []};
const addButton = document.getElementById('add-button');
const sortButton = document.getElementById('sort-button');
const list = document.getElementById('View');
updateList(allToDos, list);
console.log(allToDos);
sortButton.addEventListener('click', sortList);


addButton.addEventListener('click', (e) => {
    const newTasktext = document.getElementById('text-input').value;
    const newTaskpriority = document.getElementById('priority-selector');
    const newTaskStatus = setStatus(newTaskpriority.value)
    const newTask = createElementWithAttribute('div', 'className', 'todo-container');
    const trashSpan = createElementWithAttribute('span', 'className', 'delete-button');
    const checkSpan = createElementWithAttribute('span', 'className', 'check-button');
    const newTaskStatusSpan = createElementWithAttribute('span', 'data-status', newTaskStatus);
    newTask.dataset['status'] = newTaskStatus;
    const newPriorityDiv = createElementWithAttribute('div', 'className', 'todo-priority');
    const newCreationTimeDiv = createElementWithAttribute('div', 'className', 'todo-created-at');
    const newTextDiv = createElementWithAttribute('div', 'className', 'todo-text');
    newCreationTimeDiv.innerText = new Date().toISOString().slice(0, 19).replace('T', ' ');
    newTextDiv.innerText = input.value;
    newPriorityDiv.innerText = newTaskpriority.value;
    newTask.append(checkSpan, newTextDiv, newCreationTimeDiv,  newPriorityDiv, trashSpan, newTaskStatusSpan);
    
    //      reset text-input
    list.append(newTask);
    input.value = "";
    input.focus();
    updateCounter();

    //      create new list item
    allToDos['my-todo'].push(
        {
                text: newTasktext,
                priority: newTaskpriority.value,
                date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                'data-status': newTaskStatus
            }
        );
        const didItWork = setPersistent(API_KEY, allToDos);
})


function setStatus(priority) {
    if(priority>="3"){
        return 'important';
    }
    return 'normal';
}


function sortList() {
    const fragment = document.createDocumentFragment();
    const listItems = Array.from(list.children);

    const orderedListItems = listItems.sort((firstItem, secondItem)=>{
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