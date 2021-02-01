const API_KEY = '$2b$10$zZDdF7tEnFjVuWTOTyEIhuxHrQKMtNfrGQojBkNT5Hl1PBUn/LQ4K'; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";


// Gets data from persistent storage by the given key and returns it
async function getPersistent(key) {
  let response;
  const request = {
    headers: {'X-Master-Key': key
}};
  let respond = await fetch(`https://api.jsonbin.io/v3/b/6012bfd76bdb326ce4bc67af/latest`, request);
  const texted = await respond.text();
  const jsoned = JSON.parse(texted);
  const content = jsoned['record'];
  // orderList(content);
  
  return content;

  
  }

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent(key, data) {
  const request = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' , 'X-Master-Key': key
},
body: JSON.stringify(data)};
  const respond = await fetch("https://api.jsonbin.io/v3/b/6012bfd76bdb326ce4bc67af", request);
  
  return true;
}




//maybe should run this without a function in the main.
async function updateList(allTasks, list){
try {
  const importedList = await getPersistent(API_KEY);
  const jsonedList = await importedList;
  // console.log(relevantTasks(), allTasks['my-todo'][0]['data-status']);
  allTasks['my-todo'] = jsonedList['my-todo'];
} catch(e) {
  alert('There was a problem getting data from the server,\n Please try to reload.\nThe specific error message is:\n' + e);
  }
  recreateView(allTasks['my-todo']);
  // showOnly();
  updateCounter();
}



