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
document.addEventListener('keydown', (e) => {
    if (e.key === ':' && document.activeElement !== commandInput) {
        e.preventDefault();
        commandInput.value = ':';
        commandInput.focus();
        
    }
});
document.addEventListener('keyup', (e) => {
    const prioritySelector = document.getElementById('priority-selector')
    if(document.activeElement === input) {
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
    }
    else if (e.key === 'Escape') {
        commandInput.value= '';
        input.focus();
        return;
    }
    else if (document.activeElement === commandInput && e.key === 'Enter') {
        const tasksInView =  document.querySelectorAll('.todo-container');
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
                showOnly('important');
                
                break;
            case ':mc':
                showOnly('completed');
                //show all checked/completed tasks (as click on menu > checked)
                break;
            case ':md':
                showOnly('deleted');
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
                commandInput.value = '';
                input.focus();
                return;
    }
})
sortButton.addEventListener('click', sortList);
document.addEventListener('click', (e)=> {
    if (e.target.className === 'delete-button') {
        deleteTasks(e.target.parentElement);
    }
    else if (e.target.className === 'checkbox') {
        checkTasks(e.target);
    }
})


addButton.addEventListener('click', (e) => {
    if (input.value === '') {
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
            text: input.value,
            priority: newTaskpriority.value,
            date: newTaskTime,
            'data-status': newTaskStatus
        }
        );
        recreateView(allTasks['my-todo'][-1]);
        
        //      reset page
        updateCounter();
        input.value = "";
        input.focus();
        const didItWork = setPersistent(API_KEY, allTasks);
});

function showOnly(showByStatus = 'relevant') {
    const stringToFilter = input.value;
    if (showByStatus === 'important') {
        const filtered = allTasks['my-todo']
        .filter((item) => {
        return item.priority > 2;
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
        const checkbox = createElementWithAttribute('input', 'type', 'checkbox');
        checkbox.className = 'checkbox';
        
        taskPriority.innerText = item.priority;
        taskCreationTime.innerText = item.date;
        taskText.innerText = item.text;
        task.append(checkbox, taskText, taskCreationTime,  taskPriority, trashSpan);
        console.log(item['data-status']);
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

function deleteTasks(tasks) {
    if(tasks.length === undefined) {
        if (tasks.dataset.status !== 'deleted') {
            console.log(tasks.dataset.status);
            
            tasks.dataset.status = 'deleted';
            tasks.querySelector('.checkbox').hidden = true;
            tasks.querySelector('.delete-button').innerText = 'Restore';
            const deletedTask = allTasks['my-todo']
            .filter((item) => {
                if(item.date === tasks.querySelector('.todo-created-at').innerText) {
                    item['data-status'] = 'deleted';
                }
                return;
            });
        }
        else if (tasks.dataset.status === 'deleted') {
            
            tasks.dataset.status = 'relevant';
            tasks.querySelector('.checkbox').hidden = false;
            tasks.querySelector('.delete-button').innerText = 'delete';
            const deletedTask = allTasks['my-todo']
            .filter((item) => {
                if(item.date === tasks.querySelector('.todo-created-at').innerText) {
                    item['data-status'] = 'relevant';
                }
                return;
            });
        }
            // recreateView();
            // updateCounter();
            input.value = '';
            input.focus();
            setPersistent(API_KEY, allTasks);
            return;
        }
        for (const task of tasks) {
            if (tasks.dataset.status !== 'deleted') {
            
                tasks.dataset.status = 'deleted';
                tasks.querySelector('.checkbox').hidden = true;
                tasks.querySelector('.delete-button').innerText = 'Restore';
                const deletedTask = allTasks['my-todo']
                .filter((item) => {
                    if(item.date === tasks.querySelector('.todo-created-at').innerText){
                        item['data-status'] = 'deleted';
                    }
                    return;
            });
        }
        else if (tasks.dataset.status === 'deleted') {
            
            tasks.dataset.status = 'relevant';
            tasks.querySelector('.checkbox').hidden = false;
            tasks.querySelector('.delete-button').innerText = 'delete';
            const deletedTask = allTasks['my-todo']
            .filter((item) => {
                if(item.date === tasks.querySelector('.todo-created-at').innerText){
                    item['data-status'] = 'relevant';
                }
                return;
            });
    }
    // list.replaceChildren()
    // recreateView();
    // updateCounter();
    input.value = '';
    input.focus();
    setPersistent(API_KEY, allTasks);

}
}

//      consider to unite checkTasks and deleteTasks functions
function checkTasks(tasksToCheck, status) {
    tasksToCheck.parentElement.dataset.status = 'completed';
    const bla = allTasks['my-todo']
        .filter((item) => {
            console.log(item.date, tasksToCheck.parentElement.querySelector('.todo-created-at').innerText);
        if(item.date === tasksToCheck.parentElement.querySelector('.todo-created-at').innerText){
            if(item['data-status'] === 'completed'){
                item['data-status'] = 'relevant';
                return;
            }
            else if(item['data-status'] === 'relevant') {
            item['data-status'] = 'completed';
            }
        }
        return;
    });
    input.value = '';
    input.focus();
    setPersistent(API_KEY, allTasks);
}