import $ from 'jquery';

// Base url for API
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/nikadarab/bookmarks';

/**
 * listApiFetch - Wrapper function for native `fetch` to standardize error handling.
 * @param {string} url
 * @param {object} options
 * @returns {Promise}
 */
const listApiFetch = function (...args) {
  // setup var in scope outside of promise chain
  let error;
  return fetch(...args)
    .then((res) => {
      if (!res.ok) {
        // if response is not 2xx, start building error object
        error = { code: res.status };

        // if response is not JSON type, place statusText in error object and
        // immediately reject promise
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }

      // otherwise, return parsed JSON
      return res.json();
    })
    .then((data) => {
      // if error exists, place the JSON message into the error object and
      // reject the Promise with your error object so it lands in the next
      // catch.  IMPORTANT: Check how the API sends errors -- not all APIs
      // will respond with a JSON object containing message key
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      // otherwise, return the json as normal resolved Promise
      return data;
    });
};

// Function for sending GET request to the DB
function getBookmarks() {
  return listApiFetch(`${BASE_URL}`);
}

// Function for creating a new bookmark to POST to DB
function createNewBookmark(bookmarkObject) {
  return listApiFetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookmarkObject),
  });
}

// Function for sending a DELETE request to the DB
function deleteBookmark(id) {
  return listApiFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}
// Function for updating a new bookmark
function updateBookmark(id, updateObject) {
  return listApiFetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateObject),
  });
}

export default {
  createNewBookmark,
  deleteBookmark,
  getBookmarks,
  updateBookmark,
};
