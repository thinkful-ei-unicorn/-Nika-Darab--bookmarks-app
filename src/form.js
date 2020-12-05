 return `
    <form id='js-new-item-form'>
    <fieldset>
    <legend>New Bookmark</legend>
      <div>
        <!-- Title -->
        <label for='js-form-title'>Title</label>
        <li class='new-item-li'><input type='text' id='js-form-title' name='title' placeholder='Best css tricks' required></li>
        <!-- Description -->
        <label for='js-form-description'>Description</label>
        <li class='new-item-li'><textarea id='js-form-description' name='description' placeholder="This is a list of best css tricks"></textarea>
      </div>
      <div>
      <!-- URL -->
        <label for='js-form-url'>URL</label>
        <li class='new-item-li'><input type='url' id='js-form-url' name='url' placeholder='https://css-tricks.com/' required></li>
        <!-- Rating -->
        <label for='js-form-rating' id='rating-label'>Rating: </label>
        <select id='js-form-rating' name='rating' aria-labelledby='rating-label' required>
          <option value='5' selected>5</option>
          <option value='4'>4</option>
          <option value='3'>3</option>
          <option value='2'>2</option>
          <option value='1'>1</option>
        </select>
      </div>
      <!-- Add button -->
      <div class='add-btn-container'>
        <button type='submit' id='js-add-bookmark' class='add-button'>ADD BOOKMARK</button>
        <button type='button' id='js-cancel-bookmark'>CANCEL</button>
      </div>
      </fieldset>
    </form>
    `;