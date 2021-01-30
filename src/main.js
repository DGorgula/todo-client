
//      here the code begin to run!
const allToDos = {'my-todo': []};
const addButton = document.getElementById('add-button');
const sortButton = document.getElementById('sort-button');
const list = document.getElementById('View');
updateList(allToDos, list);
console.log(allToDos);
sortButton.addEventListener('click', sortList);


addButton.addEventListener('click', (e) => {
    const text = document.getElementById('text-input').value;
    const input = document.getElementById('text-input');
    const priority = document.getElementById('priority-selector');
    const newItem = createElementWithAttribute('div', 'className', 'todo-container');
    const trashSpan = createElementWithAttribute('span', 'class', 'delete-button');
    const checkSpan = createElementWithAttribute('span', 'class', 'check-button');
    const newItemPriority = createElementWithAttribute('div', 'className', 'todo-priority');
    const newItemCreationTime = createElementWithAttribute('div', 'className', 'todo-created-at');
    const newItemText = createElementWithAttribute('div', 'className', 'todo-text');
    newItemCreationTime.innerText = new Date().toISOString().slice(0, 19).replace('T', ' ');
    newItemText.innerText = input.value;
    newItemPriority.innerText = priority.value;
    newItem.append(checkSpan, newItemText, newItemCreationTime,  newItemPriority, trashSpan);
    
    //      reset text-input
    list.append(newItem);
    input.value = "";
    input.focus();
    updateCounter();

    //      create new list item
    allToDos['my-todo'].push(
        {
                text: text,
                priority: priority.value,
                date: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
        );
        const didItWork = setPersistent(API_KEY, allToDos);
})

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