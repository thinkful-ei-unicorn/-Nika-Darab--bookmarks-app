import $ from 'jquery';
// // import 'normalize.css';
import './index.css';
import api from './api';
import store from './store';
import bookmark from './bookmark-list';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

const main = function () {
  api.getBookmarks().then((items) => {
    items.forEach((item) => store.addBookmark(item));
    bookmark.render();
  });
  // Bind the event listeners
  bookmark.bindEventListeners();
  bookmark.render();
};

$(main);
