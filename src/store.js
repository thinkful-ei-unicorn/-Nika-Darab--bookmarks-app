const bookmarks= [];
const ratingFilter = 0;
const editingObject = {};
//function for adding a bookamrk
function addBookmark (bookmarkObject) {
  const defaultObject = {
    expanded : false
  };
  this.bookmarks.push(Object.assign(bookmarkObject, defaultObject));
}

//function for updating bookmarks
function updateBookmark(id, bookmarkToMerge) {
  const found = this.bookmarks.find(bookmark => bookmark.id === id);
  Object.assign(found, bookmarkToMerge);
}

//function for toggling adding bookmark property
function setAddingBookmarksStatus(bool) {
  this.addingBookmark = bool;
}

//function for toggling updating bookmark property
function setUpdatingBookmarkStatus (bool) {
  this.updatingBookmark = bool;
}

// function for deleting a bookmark by ID
function deleteBookmark(id) {
  this.bookmarks = this.bookmarks.filter (bookmark => bookmark.id !== id);
}

//function to filter out rating <
function filterRating(rating){
  setRatingFilter(rating);
  this.bookmarks = filterStoreByRating();
}

//function fpr creating a filtered array based on rating
function filterStoreByRating(){
  this.bookmarks.filter(bookmark => bookmark.rating >= this.ratingFilter);
}

//function fpr toggling the expanded status of a bookmark by ID
function toggleExpand(id){
  const bookmarkToExpand = this.bookmarks.find(bookmark => bookmark.id ===id);
  bookmarkToExpand.expanded = !bookmarkToExpand.expanded;
}

//store and show the error msg
function setErrorMessage(error){
  this.errorMessage = error;
}

//set the ratingfilter
function setRatingFilter(value){
  this.ratingFilter = value;
}

/** navigating the store */

// find and a return a bookmark by id
function findById (id) {
  this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id ===id);
}

//function to find an delete a bookmakr by id
function findAndDelete(id){
  this.bookmarks = this.bookmarks.filter(bookmark=> bookmark.id !== id);
}

//function for checking the hidden status
function checkIfHidden(bookmark){
  return !bookmark.expanded ? 'hidden' : '';
}

//function to see if we are adding a bookmark
function checkIfAdding(){
  return this.addingBookmark;
}

//function to see if we are editing
function checkIfEditing() {
  return this.updatingBookmark;
}
// Function for setting editingObject
function setEditingObject(object) {
  this.editingObject.title = object.title;
  this.editingObject.desc = object.desc;
  this.editingObject.url = object.url;
  this.editingObject.rating = object.rating;
}

// Function for resetting editingObject
function resetEditingObject() {
  this.editingObject = {};
}
export default {
  bookmarks,
  ratingFilter,
  editingObject,
  addBookmark,
  updateBookmark,
  setAddingBookmarksStatus,
  setUpdatingBookmarkStatus,
  deleteBookmark,
  filterRating,
  filterStoreByRating,
  toggleExpand,
  setErrorMessage,
  setRatingFilter,
  findById,
  findAndDelete,
  checkIfHidden,
  checkIfAdding,
  checkIfEditing,
  setEditingObject,
  resetEditingObject

};