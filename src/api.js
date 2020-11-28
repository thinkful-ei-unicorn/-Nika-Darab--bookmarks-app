
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/[nikadarab]';
//function to send GET requests
function getBookmarks(){
  return fetch(`${BASE_URL}/items`);
}
//function for creating a new bookmark to POST
function createNewBookMark(newBookmark){
  return fetch (`${BASE_URL}/items`, {
    mathod: 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({newBookmark}),
  });
}

//function for sending Delete request 
function deleteBookmark(id) {
  return fetch(`${BASE_URL}/bookmarks/${id}`,{
    method: 'DELETE'
  });
}

//function for updating a new bookmark
function updateBookmark (id,updateBookmark) {
  return fetch(`${BASE_URL}/bookmarks/${id}`,{
    method:'PATCH',
    header : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify(updateBookmark)
  });
}

export default {
  getBookmarks,
  createNewBookMark,
  deleteBookmark,
  updateBookmark
};
