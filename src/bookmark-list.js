import $ from 'jquery';
import store from './store';
import api from './api';
import generator from './generator';

function bindEventListeners() {
  handleNewBookmarkClicked();
  handleAddBookmarkClicked();
  handleDeleteBookmarkClicked();
  handleFilterRatingsDropdown();
  handleToggleExpandedBookmarkView();
  handleCancelButton();
  renderError();

}
$.fn.extend({
  serializeJSON: function () {
    const formData = new FormData(this[0]);
    const object = {};
    formData.forEach((value, name) => {
      return (object[name] = value);
    });
    return JSON.stringify(object);
  },
});
// Handler for new bookmark button clicked
function handleNewBookmarkClicked() {
  $('#js-new-bookmark').on('click', () => {
    store.setAddingBookmarkStatus(true);
    render();
  });
}

// Handler for add bookmark clicked
function handleAddBookmarkClicked() {
  $('#js-form-container').on('submit', '#js-new-item-form', (event) => {
    event.preventDefault();
    const serializedJSON = JSON.parse($(event.target).serializeJSON());
    const newBookmarkObject = constructBookmarkObject(serializedJSON);

    api.createNewBookmark(newBookmarkObject).then((newBookmark) => {
      store.addBookmark(newBookmark);
      store.setAddingBookmarkStatus(false);
      render();
    });
  });
}

// Handler for delete bookmark clicked
function handleDeleteBookmarkClicked() {
  $('.js-bookmarks-container').on('click', '.js-btn-delete', (event) => {
    const bookmarkUniqueID = getDataID(event.currentTarget);
    const confirmedDeletion = confirm(
      'Are you sure you want to delete this bookmark?'
    );
    if (confirmedDeletion) {
      api.deleteBookmark(bookmarkUniqueID).then(() => {
        store.findAndDelete(bookmarkUniqueID);
        render();
      });
    }
  });
}


function handleCancelButton() {
  $('#js-form-container').on('click', '#js-cancel-bookmark', () => {
    // If we cancel we set the updating/adding statuses to false
    store.setAddingBookmarkStatus(false);
    // Render
    render();
  });
}

// Handler for filtering based on drop down
function handleFilterRatingsDropdown() {
  $('#js-filter-control').change(() => {
    store.setRatingFilter(getRatingsFilterDropdownValue());
  });


  // Function for getting the desired rating filter value
  function getRatingsFilterDropdownValue() {
    return $('#js-filter-control').val();
  }
}
// Handler for condensing/expanding bookmark
function handleToggleExpandedBookmarkView() {
  $('.js-bookmarks-container').on('click', '.js-bookmark-header', (event) => {
    store.toggleBookmarkExpanded(getDataID(event.currentTarget));
    render();
  });
}
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

// Gets the data-id of a given bookmark
function getDataID(bookmark) {
  return $(bookmark).closest('.js-bookmark-item').attr('data-id');
}

// Function for clearing form values
function clearFormValues() {
  $('#js-form-title').val('');
  $('#js-form-description').val('');
  $('#js-form-url').val('');
  $('#js-form-rating').val('');
}
function genrateError(error){
  return `
        <div class='error-message'>
          <h3>--ERROR--</h3>
          <span>${error}</span>
          <button class='closeError'>Close</button>
        </div>`;
}
// Render page
function renderError()
{
  if(store.error) {
    const error = genrateError(store.error);
    $('#js-error-message').html(error);
  } else {
    $('#js-error-message').html('');
  }
}

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
  } else {
    // Otherwise clear out the HTML in the form container
    $('#js-form-container').html('');
  }

  // Sets form text if there is an editingObject and if not adding a bookmark (this means the form will be cleared if user does edit -> new bookmark)


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
  bindEventListeners,
};