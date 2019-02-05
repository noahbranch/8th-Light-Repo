function getQuery() {
  var basicSearch = $('#searchQuery').val();
  var author = $('#authorSearch').val() ? `+inauthor${$('#authorSearch').val()}` : '';
  var title = $('#titleSearch').val() ? `+intitle${$('#titleSearch').val()}` : '';
  var publisher = $('#pubSearch').val() ? `+inpublisher${$('#pubSearch').val()}` : '';
  var subject = $('#subjectSearch').val() ? `+subject${$('#subjectSearch').val()}` : '';
  var isbn = $('#isbnSearch').val() ? `+isbn${$('#isbnSearch').val()}` : '';
  return `${basicSearch}${author}${title}${publisher}${isbn}${subject}`;
};

async function searchBook() {
  await getBooks(0);
  $('#lowNum').text(1);
  $('#bigNum').text(10);
};

async function getBooks(startIndex) { //Get books
  $('.btn').prop('disabled', true);
  $.get('https://www.googleapis.com/books/v1/volumes?q=' + getQuery() + '&startIndex=' + startIndex + '&maxResults=10&key=AIzaSyAUDi2XPJCOlyCHZVBHIOOnXyiFD8HlC24')
    .done(function (data) {
      if (data.totalItems > 0 && data.items != undefined) {
        $('#resultsList button').remove();
        data.items.forEach(book => {
          $('#resultsList').append('<button class="btn btn-default bookLink" onclick="loadBook(\'' + book.id + '\')">' + book.volumeInfo.title + '</button>');
        });
      } else {
        showError('No results found!');
      }
      $('.btn').prop('disabled', false);
      return data.totalItems;
    })
    .fail(function (data) {
      showError(data.status);
      $('.btn').prop('disabled', false);
    });
};
async function loadBook(volumeId) {
  $.get('https://www.googleapis.com/books/v1/volumes/' + volumeId)
    .done(function (data) {
      $('#bookTitle').text(data.volumeInfo.title);
      $('#author').text(data.volumeInfo.authors.toString().replace(',', '; ') || 'Author Unknown');
      $('#moreInfo').text('More Info')
      $('#moreInfo').attr('href', data.volumeInfo.infoLink);
      $('#publisher').text('Published by: ' + (data.volumeInfo.publisher || 'Unknown'));
      $('#bookDescription').html(data.volumeInfo.description || 'No summary available');
      $('#bookImage').attr('src', data.volumeInfo.imageLinks.thumbnail || 'nobook.png')
    }).fail(function() {
      showError('Issue retrieving volume from Google Books');
  });
};

async function nextPage() {
  var highNum = parseInt($('#bigNum').text());
  var lowNum = parseInt($('#lowNum').text());
  await getBooks(lowNum + 10);
  $('#lowNum').text(lowNum + 10);
  $('#bigNum').text(highNum + 10);
};

async function prevPage() {
  var highNum = parseInt($('#bigNum').text());
  var lowNum = parseInt($('#lowNum').text());
  if (lowNum - 10 >= 1) {
    await getBooks(lowNum - 10);
    $('#lowNum').text(lowNum - 10);
    $('#bigNum').text(highNum - 10);
  }
};

function toggleAdvanced() {
  var advSearch = $('#advancedSearch');
  if (advSearch.css('display') == 'none') {
    $('#advancedOpen').text('Hide Advanced Search');
    advSearch.css('display', 'block');
  } else {
    advSearch.css('display', 'none');
    $('#advancedOpen').text('Show Advanced Search');
  }
};

function showError(error) {
  switch (error) {
    case 400:
      var errorMesssage = 'Please enter a search term';
      break;
    case 403:
      var errorMesssage = 'The limit for searches through the API has been reached!';
      break;
    default:
      var errorMesssage = error;
      break;
  }
  $('#toast').addClass('show').text(errorMesssage);
  setTimeout(function () {
    $('#toast').removeClass('show');
  }, 3000);
};
function updatePages(startIndex, totalItems) {
    if (startIndex > 0) {
        $('#lowNum').text(startIndex);
        $('#highNum').text(startIndex - 10);
    }
}
