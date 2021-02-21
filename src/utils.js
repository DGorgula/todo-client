const API_KEY = '$2b$10$zZDdF7tEnFjVuWTOTyEIhuxHrQKMtNfrGQojBkNT5Hl1PBUn/LQ4K'; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";
let binId = '3769dc4d-4551-4dd9-89cf-e8be417bcd43';
let tempBinId = '2a15e540-782e-4bd0-bb7e-ff0a9a8f350e';


// Gets data from persistent storage by the given key and returns it
function getPersistent(key, loadingDiv) {
  const request = {
    headers: {
  }};
  // loadingDiv.classList.add('show-loading-div');
  toggleLoadingScreen(loadingDiv);
  try {
    
    fetch(`http://localhost:3000/${binId}`, request)
    .then((rawResponse => {
      rawResponse.json()
      .then((response) => {
        console.log(response);
        toggleLoadingScreen(loadingDiv);
        // loadingDiv.classList.remove('show-loading-div');
        allTasks['my-todo'] = response["my-todo"];
        // recreateView(allTasks['my-todo']);
        showOnly();
        updateCounter();
      })
      .catch((error) => {
        console.log(`something went wrong with the database: ${error.stack}`); 
      }
      )
    }) )
  } catch (error) {
    toggleLoadingScreen(loadingDiv);
     console.log(`something went wrong with the database: ${error.stack}`);
     alert("oops, something went wrong");
  }
  }
  
  // Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
function setPersistent(key, loadingDiv, data, hideLoadingDiv = false) {
  const request = {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json' 
  },
  body: JSON.stringify(data)
};
  try {
    
    fetch(`http://localhost:3000/${binId}`, request)
    .then((response, error) => {
      if (error) {
        console.log(`something went wrong loading the data to the database: ${error.stack}`);
      }
      if (hideLoadingDiv) {
        toggleLoadingScreen(loadingDiv)
      }
      
      showOnly();
      updateCounter();
    }
    ).catch((error) => {
      console.log(`something went wrong loading the data to the database: ${error.stack}`); 
    }
    )
    
    return true;
  }
  catch (error) {
    toggleLoadingScreen(loadingDiv);
     console.log(`something went wrong with the database: ${error.stack}`);
     alert("oops, something went wrong");
  }
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



