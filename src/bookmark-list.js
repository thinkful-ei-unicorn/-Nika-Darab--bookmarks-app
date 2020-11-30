import $ from 'jquery';
import store from './store';
import api from './api';
import generator from './generator';

/***** Event listener handlers *****/
// Handle binding all event listeners
function bindEventListeners() {
  handleNewBookmarkClicked();
  handleAddBookmarkClicked();
  handleDeleteBookmarkClicked();
  handleFilterRatingsDropdown();
  handleToggleExpandedBookmarkView();
  handleEditBookmarkClicked();
  handleCancelButton();
}
$.fn.extend({
  serializeJSON: function() {
    const formData = new FormData(this[0]);
    const object = {};
    formData.forEach((value, name) => {
      return (object[name] = value);
    });
    return JSON.stringify(object);
  }
});
// Handler for new bookmark button clicked
function handleNewBookmarkClicked() {
  $('#js-new-bookmark').on('click', () => {
    store.setAddingBookmarkStatus(true);
    store.setUpdatingBookmarkStatus(false);
    render();
  });
}

// Handler for add bookmark clicked
function handleAddBookmarkClicked() {
  $('#js-form-container').on('submit', '#js-new-item-form', event => {
    event.preventDefault();
    // Serialize the JSON and parse it into an object
    const serializedJSON = JSON.parse($(event.target).serializeJSON());
    const newBookmarkObject = constructBookmarkObject(serializedJSON);

    api.createNewBookmark(newBookmarkObject)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.setAddingBookmarkStatus(false);
        render();
      });
  });
}

// Handler for delete bookmark clicked
function handleDeleteBookmarkClicked() {
  $('.js-bookmarks-container').on('click', '.js-btn-delete', event => {
    // Captured the bookmark's ID
    const bookmarkUniqueID = getDataID(event.currentTarget);
    // Prompt user for confirmation
    const confirmedDeletion = confirm(
      'Are you sure you want to delete this bookmark?'
    );
      // Use the ID to delete the item from the DB
    if (confirmedDeletion) {
      api.deleteBookmark(bookmarkUniqueID)
        .then(()=> {
          store.findAndDelete(bookmarkUniqueID);
          render();
        });
      
    }
  });
}

// Handler for edit button
function handleEditBookmarkClicked() {
  $('.js-bookmarks-container').on('click', '.js-btn-edit', event => {
    // Capture the data ID and find the relevant object in the store
    const bookmarkUniqueID = getDataID(event.currentTarget);
    const currentBookmarkObject = store.findByID(bookmarkUniqueID);

    // Set updating status to true, adding status to false, and assign the editing object in store
    store.setUpdatingBookmarkStatus(true);
    store.setAddingBookmarkStatus(false);
    store.setEditingObject(currentBookmarkObject);
    // Render page
    render();

    //update
    $('#js-edit-form').on('submit', event => {
      event.preventDefault();

      // Capture all the field values and pass them to the object constructor
      const title = $('#js-form-title').val();
      const description = $('#js-form-description').val();
      const url = $('#js-form-url').val();
      const rating = $('#js-form-rating').val();

      const editedObject = constructBookmarkObject({
        title: title,
        rating: rating,
        description: description,
        url: url
      });

      // Update the bookmark in the api
      api.updateBookmark(bookmarkUniqueID,editedObject)
        .then(() => {
          // Update bookmark in store, reset updating status and editing object
          store.updateBookmark(bookmarkUniqueID, editedObject);
          store.setUpdatingBookmarkStatus(false);
          store.resetEditingObject();
          // Render
          render();
        }
        );
    });
  });
}


// Handler for cancel button
function handleCancelButton() {
  $('#js-form-container').on('click', '#js-cancel-bookmark', () => {
    // If we cancel we set the updating/adding statuses to false
    store.setAddingBookmarkStatus(false);
    store.setUpdatingBookmarkStatus(false);
    // Render
    render();
  });
}

// Handler for filtering based on drop down
function handleFilterRatingsDropdown() {
  $('#js-filter-control').change(() => {
    store.setRatingFilter(getRatingsFilterDropdownValue());
    render();
  });
}

// Function for getting the desired rating filter value
function getRatingsFilterDropdownValue() {
  return $('#js-filter-control').val();
}

// Handler for condensing/expanding bookmark
function handleToggleExpandedBookmarkView() {
  $('.js-bookmarks-container').on('click', '.js-bookmark-header', event => {
    store.toggleBookmarkExpanded(getDataID(event.currentTarget));
    render();
  });
}

/***** Utility functions *****/
// Function for constructing a new bookmark object
function constructBookmarkObject(serializedJSON) {
  const newObject = {};

  // Make sure that object properties are valid before adding them to update object
  if (serializedJSON.title.length > 0) {
    newObject['title'] = serializedJSON.title;
  } else {
    newObject['title'] = '';
  }

  if (serializedJSON.url.length > 5) {
    newObject['url'] = serializedJSON.url;
  } else {
    newObject['url'] = '';
  }

  if (serializedJSON.description.length > 0) {
    newObject['desc'] = serializedJSON.description;
  }

  if (
    parseInt(serializedJSON.rating) > 0 &&
      parseInt(serializedJSON.rating) <= 5
  ) {
    newObject['rating'] = serializedJSON.rating;
  }

  return newObject;
}

/*** Data ID functions ***/
// Gets the data-id of a given bookmark
function getDataID(bookmark) {
  return getDataIDAttributeValue(bookmark);
}

// Function for getting the data-id attribute of the nearest js-bookmark-item
function getDataIDAttributeValue(bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-item')
    .attr('data-id');
}

// Function for clearing form values
function clearFormValues() {
  $('#js-form-title').val('');
  $('#js-form-description').val('');
  $('#js-form-url').val('');
  $('#js-form-rating').val('');
}

// Render page
function render() {
  // store bookmarks as a variable
  const bookmarks = store.bookmarks;
  // Get the current filter value
  const filterValue = store.ratingFilter;
  // Get the generated HTML for the bookmarks list
  let bookmarkListHTML;

  // If addingBookmark is true we need to render the form
  if (store.checkIfAddingBookmark()) {
    // Add the form onto the page
    $('#js-form-container').html(generator.generateNewBookmarkFormHTML());
  } else if (store.checkIfEditingBookmark()) {
    $('#js-form-container').html(generator.generateUpdateBookmarkForm());
  } else {
    // Otherwise clear out the HTML in the form container
    $('#js-form-container').html('');
  }

  // Sets form text if there is an editingObject and if not adding a bookmark (this means the form will be cleared if user does edit -> new bookmark)
  if (store.editingObject && !store.checkIfAddingBookmark()) {
    $('#js-form-title').val(store.editingObject.title);
    $('#js-form-description').val(store.editingObject.desc);
    $('#js-form-url').val(store.editingObject.url);
    $('#js-form-rating').val(store.editingObject.rating);
  } else if (!store.checkIfAddingBookmark()) {
    clearFormValues();
  }

  // Displays errors if found
  if (store.errorMessage) {
    $('#js-error-message').html(store.errorMessage);
    store.setErrorMessage('');
  } else {
    $('#js-error-message').html('');
  }

  // If a ratingFilter is active only render the relevant parts of store
  if (filterValue > 0) {
    // Restrict rendering
    bookmarkListHTML = generator.generateBookmarksListHTML(
      bookmarks,
      filterValue
    );
    // Render the bookmarks list
    $('.js-bookmarks-container').html(bookmarkListHTML);
  } else {
    // Render everything
    bookmarkListHTML = generator.generateBookmarksListHTML(
      bookmarks,
      filterValue
    );
    $('.js-bookmarks-container').html(bookmarkListHTML);
  }
}


export default {
  render,
  bindEventListeners
};