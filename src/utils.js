const API_KEY = '$2b$10$zZDdF7tEnFjVuWTOTyEIhuxHrQKMtNfrGQojBkNT5Hl1PBUn/LQ4K'; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";


// Gets data from persistent storage by the given key and returns it
function getPersistent(key, loadingDiv) {
  const request = {
    headers: {'X-Master-Key': key
  }};
  // loadingDiv.classList.add('show-loading-div');
  toggleLoadingScreen(loadingDiv);
  fetch(`https://api.jsonbin.io/v3/b/601d120506934b65f52ebb62/latest`, request)
  .then((rawResponse => {
    rawResponse.json()
    .then((response) => {
      toggleLoadingScreen(loadingDiv);
      // loadingDiv.classList.remove('show-loading-div');
      allTasks['my-todo'] = response.record["my-todo"];
      recreateView(allTasks['my-todo']);
      updateCounter();
  })
}) )
}

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
function setPersistent(key, loadingDiv, data, hideLoadingDiv = false) {
  const request = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' , 'X-Master-Key': key
  },
  body: JSON.stringify(data)};
  fetch("https://api.jsonbin.io/v3/b/601d120506934b65f52ebb62", request)
  .then((response) => {
    if (hideLoadingDiv) {
      toggleLoadingScreen(loadingDiv)
    }

    showOnly();
    updateCounter();
  }
  )
  
  return true;
}




//maybe should run this without a function in the main.
// async function updateList(allTasks, list){
// // try {
//   const importedList = await 
//   //  jsonedList['my-todo'];
// // } catch(e) {
//   // alert('There was a problem getting data from the server,\n Please try to reload.\nThe specific error message is:\n' + e);
//   // }
//   // showOnly();
// }



