// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

UI.prototype.addBookToList = function(book) {
  const list = document.getElementById('book-list');
  // Create tr element
  const row = document.createElement('tr');

  // Insert cols
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td class="star"><a href="#" title="Favorite" class="favoriteButton"><img src="images/star.png"></a></td>
    <td><a href="#" title="Remove" class="delete">X<a></td>
    `;

    list.appendChild(row);
}

// Show Alert
UI.prototype.showAlert = function(message, className) {
  // Create div
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector('.container');
  // Get form
  const form = document.querySelector('#book-form');
  // Insert alert
  container.insertBefore(div, form);

  // Timeout after 3 seconds
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 3000);
}

// Delete Book
UI.prototype.deleteBook = function(target) {
  target.parentElement.parentElement.remove();
}

// Favorite Row
UI.prototype.favoriteBook = function(target) {
  // Initialize variables for parent elements
  const table = target.parentElement.parentElement.parentElement.parentElement;
  const tr = target.parentElement.parentElement.parentElement;
  let linkClass = target.parentElement.className;
  // Determine if they are favorited or not
  if (linkClass === 'favoriteButton') {
    // Set class to favorited
    linkClass = 'favoriteButton favorited';
    // Change tooltip
    target.parentElement.title = 'Unfavorite';
    // Insert the row at the top of the rows
    table.insertBefore(tr, table.firstChild);
  } else if (linkClass === 'favoriteButton favorited') {
    // Set class to regular class it starts as
    linkClass = 'favoriteButton';
    // Change tooltip
    target.parentElement.title = 'Favorite';
    // Insert the row at the bottom of the rows
    table.appendChild(tr, table.lastChild);
  }
  // Set the actual class to the variable we changed
  target.parentElement.className = linkClass;
}

// Clear Fields
UI.prototype.clearFields = function() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
  // Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
  
  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (title === '' || author === '' || isbn === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Show success
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
})

// Add event listeners for delete and favorite book
document.getElementById('book-list').addEventListener('click', function(e) {
  // Instantiate UI
  const ui = new UI();

  // Determine whether it is deleting or favoriting
  if (e.target.className === 'delete') {
    ui.deleteBook(e.target);

    // Show message
    ui.showAlert('Book Removed!', 'success');
  } else if (e.target.parentElement.parentElement.className === 'star') {
    ui.favoriteBook(e.target);

    // Determine whether it is favoriting or unfavoriting
    if (e.target.parentElement.className === 'favoriteButton favorited'){
      // Show message
      ui.showAlert('Book Favorited!', 'success');
    } else {
      // Show message
      ui.showAlert('Book Unfavorited!', 'success');
    }
  }

  e.preventDefault();
})