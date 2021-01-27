function sortList() {
    const fragment = document.createDocumentFragment();
    const listItems = Array.from(list.children);

    const orderedListItems = listItems.sort((firstItem, secondItem)=>{
        const firstItemPriority = firstItem.querySelector('.todo-priority').innerText;
        const secondItemPriority = secondItem.querySelector('.todo-priority').innerText;
        return firstItemPriority - secondItemPriority;
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

//      here the code begin to run!
const addButton = document.getElementById('add-button');
const sortButton = document.getElementById('sort-button');
const list = document.getElementById('list');
updateCounter();

sortButton.addEventListener('click', sortList);


addButton.addEventListener('click', (e) => {
    const input = document.getElementById('text-input');
    const priority = document.getElementById('priority-selector');
    
    //      create new list item
    const newItem = createElementWithAttribute('li', 'className', 'item');
    const newItemPriority = createElementWithAttribute('div', 'className', 'todo-priority');
    const newItemCreationTime = createElementWithAttribute('div', 'className', 'todo-created-at');
    const newItemText = createElementWithAttribute('div', 'className', 'todo-text');
    newItemText.innerText = input.value;
    newItemPriority.innerText = priority.value;
    newItem.append(newItemPriority, newItemCreationTime, newItemText);

    //      reset text-input
    list.append(newItem);
    updateCounter();
    input.value = "";
    input.focus();
})