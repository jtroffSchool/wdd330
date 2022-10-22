const taskInput = document.querySelector('#taskToAdd');
const taskList = document.querySelector('#taskList')
const addButton = document.querySelector('#addBtn');
const retrieveTasks = document.querySelector('#retrieve');

function addNewTask(){

    const liElement = document.createElement('li');
    let textNode = null;

    if(taskInput.value === ''){
        textNode = document.createTextNode('Actually enter a task next time!');
    }
    else {
        textNode = document.createTextNode(taskInput.value);
    }
    
    liElement.appendChild(textNode);
    taskList.appendChild(liElement);
    taskInput.value = '';

    addCloseSpan(liElement);

}

function addCloseSpan(liElement){
    const spanElement = document.createElement('span');
    const textNode = document.createTextNode('\u00D7');
    spanElement.className = 'close';
    spanElement.appendChild(textNode);
    liElement.appendChild(spanElement);
    spanElement.addEventListener('click', () => liElement.style.display = 'none');
}

function toggleCheckedTask(event){
    if(event.target.tagName === 'LI'){
        event.target.classList.toggle('checked');
    }
}

function retrieveHidden(){
    const childrenArray = Array.from(taskList.children);
    childrenArray.forEach(child => child.style.display = 'flex');
}
addButton.addEventListener('click', addNewTask);
taskList.addEventListener('click', toggleCheckedTask, false);
retrieveTasks.addEventListener('click', retrieveHidden);