// Using classes as part of ES6, as well as
// using different methods that are part of ES6

// Under the hood it is happening the same way, 
// but it looks a lot better, syntactical sugar

class Book {
  constructor(title, author, isbn, className) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.className = className;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
  
    // Insert cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td class="star"><a href="#" title="Favorite" class="${book.className}"><img src="images/star.png"></a></td>
      <td><a href="#" title="Remove" class="delete">X<a></td>
      `;
  
    list.appendChild(row);
  }

  createAlert(message, className) {
    if (document.querySelector('.alert')) {
      // Delete old alert if exists
      document.querySelector('.alert').remove();
    }
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add ID
    div.id = 'alert';
    // Add text
    div.appendChild(document.createTextNode(message));
    // Add delete button
    div.innerHTML = `
    ${message}
    <a href="#" title="Hide Error" class="deleteError">X<a>
    `
    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#book-form');
    // Add event listener for deleting error
    div.querySelector('.deleteError').addEventListener('click', function(e) {
      div.remove();
    })
    // Insert alert
    container.append(div);
  }

  deleteBook(target) {
    target.parentElement.parentElement.remove();
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  favoriteBook(target) {
    // Initialize variables for parent elements
    const table = target.parentElement.parentElement.parentElement.parentElement;
    const tr = target.parentElement.parentElement.parentElement;
    let linkClass = target.parentElement.className;
    let title = target.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    let author = target.parentElement.parentElement.previousElementSibling.previousElementSibling.textContent;
    let ISBN = target.parentElement.parentElement.previousElementSibling.textContent;
    // Determine if they are favorited or not
    if (linkClass === 'favoriteButton') {
      // Set class to favorited
      linkClass = 'favoriteButton favorited';
      // Change tooltip
      target.parentElement.title = 'Unfavorite';
      // Set the actual class to the variable we changed
      target.parentElement.className = linkClass;
      // Instantiate book
      const book = new Book(title, author, ISBN, linkClass);
      // Store in local storage and prepend
      Store.favoriteBookLS(true, tr, table, book, ISBN);
    } else if (linkClass === 'favoriteButton favorited') {
      // Set class to regular class it starts as
      linkClass = 'favoriteButton';
      // Change tooltip
      target.parentElement.title = 'Favorite';
      // Set the actual class to the variable we changed
      target.parentElement.className = linkClass;
      // Instantiate book
      const book = new Book(title, author, ISBN, linkClass);
      // Store in local storage and prepend
      Store.favoriteBookLS(false, tr, table, book, ISBN);
    }
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    // Initialize books
    let books;
    // If the LS storage books key is empty, make books an empty array
    // If not, then get the books from LS and return them
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      // Needs to be a JS object, so we need to user the JSON.parse()
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    // Instantiate books
    const books = Store.getBooks();

    // Loop through books to add the books in LS to the UI
    books.forEach(function(book) {
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book);
    })
  }

  static addBook(book) {
    // Instantiate books
    const books = Store.getBooks();

    // Add book to bottom of LS
    books.push(book);

    // Instantiate LS
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    // Instantiate books
    const books = Store.getBooks();
    // Remove the book from LS by finding it through a loop
    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    // Instantiate LS
    localStorage.setItem('books', JSON.stringify(books));
  }

  static favoriteBookLS(isFavoriting, tableRow, tableVar, book, isbn) {
    // Instantiate books
    const books = Store.getBooks();
    // Remove the book from LS by finding it through a loop
    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    if (isFavoriting) {
      // Add book to top of table
      tableVar.prepend(tableRow);
      // Add book to top of LS
      books.unshift(book);
    } else {
      // Add book to bottom of table
      tableVar.append(tableRow);
      // Add book to bottom of LS
      books.push(book);
    }
    // Set book change in LS
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
  // Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
  
  // Instantiate book
  const book = new Book(title, author, isbn, 'favoriteButton');

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (title === '' || author === '' || isbn === '') {
    // Error alert
    ui.createAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to LS
    Store.addBook(book);

    // Show success
    ui.createAlert('Book Added!', 'success');

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

    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    // Show message
    ui.createAlert('Book Removed!', 'success');
  } else if (e.target.parentElement.parentElement.className === 'star') {
    ui.favoriteBook(e.target);

    // Determine whether it is favoriting or unfavoriting
    if (e.target.parentElement.className === 'favoriteButton favorited'){
      // Show message
      ui.createAlert('Book Favorited!', 'success');
    } else {
      // Show message
      ui.createAlert('Book Unfavorited!', 'success');
    }
  }
  e.preventDefault();
})
