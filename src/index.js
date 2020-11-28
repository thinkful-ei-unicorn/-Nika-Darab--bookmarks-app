/* eslint-disable no-console */
import $ from 'jquery';
// import 'normalize.css';
import './index.css';
import api from './api';
import store from './store';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

function main() {
  api.getItems()
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      // shoppingList.render();
    });
  // console.log('DOM is loaded');
  // $('#js-form').click('#submit', function(e){
  //   e.preventDefault();
  //   console.log('submit btn clicked');
  // });
  // const startMsg = $('<p>Webpack is working!</p>');
  // $('#root').append(startMsg);
}

$(main);