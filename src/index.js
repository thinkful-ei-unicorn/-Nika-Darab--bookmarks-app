/* eslint-disable no-console */
import $ from 'jquery';
import './index.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

function main() {
  console.log('DOM is loaded');
  $('#js-form').click('#submit', function(e){
    e.preventDefault();
    console.log('submit btn clicked');
  });
  // const startMsg = $('<p>Webpack is working!</p>');
  // $('#root').append(startMsg);
}

$(main);