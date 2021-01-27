
function createElementWithAttribute(element, attributeType, attributValue ) {
    const newElement = document.createElement(element);
    newElement[attributeType] = attributValue;
    return newElement;
}

const addButton = document.getElementById('add-button');

const list = document.getElementById('list');




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
    input.value = "";
    input.focus();
})