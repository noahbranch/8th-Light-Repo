var books;
var pageIndex = 0;
var totalPages = 0;

$(document).ready(function () {

});

function getQuery() {
    var query = $('#searchQuery').val();
    var advQuery = '';

    if ($('#authorSearch').val() != '') {
        advQuery += '+inauthor:' + $('#authorSearch').val();
    }
    if ($('#titleSearch').val() != '') {
        advQuery += '+intitle:' + $('#titleSearch').val();
    }
    if ($('#pubSearch').val() != '') {
        advQuery += '+inpublisher:' + $('#pubSearch').val();
    }
    if ($('#subjectSearch').val() != '') {
        advQuery += '+subject:' + $('#subjectSearch').val();
    }
    if ($('#isbnSearch').val() != '') {
        advQuery += '+isbn:' + $('#isbnSearch').val();
    }
    if (advQuery != '') {
        query += advQuery;
    }
    query = query.replace(' ', '+');
    return query;
}

async function searchBook() {
    $('.btn').prop('disabled', true);
    books = await getBooks(0);
    var possiblePages = Math.ceil(books.totalItems / 40);
    possiblePages != 0 ? $('#curPage').text('1') : $('#curPage').text('0');
    if (possiblePages < 5) {
        $('#totalPages').text(possiblePages);
        totalPages = possiblePages;
    } else {
        $('#totalPages').text(5);
        totalPages = 5;
    }
    $('.btn').prop('disabled', false);
    if (totalPages <= 1) {
        $('#nextPage').prop('disabled', true);
    }
    $('#prevPage').prop('disabled', true);
}

async function getBooks(startIndex) { //Get books
    var results;
    $('#resultsList button').remove();
    query = getQuery();
    if (query == '') {
        return;
    }
    try {
        results = $.ajax({
            url: 'https://www.googleapis.com/books/v1/volumes?q=' + query + '&startIndex=' + startIndex + '&maxResults=40',
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                results = data;
                if (results.totalItems > 0) {
                    results.items.forEach(element => {
                        $('#resultsList').append('<button class="btn btn-default bookLink" onclick="loadBook(\'' + element.id + '\')">' + element.volumeInfo.title + '</button>');
                    });
                }
            }
        });
        return results;
    } catch (error) {
        console.error(error);
    }
};

function loadBook(bookId) {
    var book = books.items.find(x => x.id == bookId);
    var thumbNail = 'nobook.png'
    if (book.volumeInfo.imageLinks != undefined) {
        thumbNail = book.volumeInfo.imageLinks.thumbnail;
    }
    $('#bookImage').attr('src', thumbNail)
    $('#bookTitle').text(book.volumeInfo.title);
    $('#bookDescription').text((book.volumeInfo.description != undefined ? book.volumeInfo.description : 'No summary available'));
    $('#moreInfo').attr('href', book.volumeInfo.infoLink);
    $('#moreInfo').text('More Info')
    var author = 'by ';
    if (book.volumeInfo.authors == undefined) {
        author = 'Author Unknown';
    } else {

        book.volumeInfo.authors.forEach(auth => {
            author += auth + '; '
        });
    }
    $('#author').text(author);
    $('#publisher').text('Published by: ' + (book.volumeInfo.publisher != undefined ? book.volumeInfo.publisher : 'Unknown'));
};

async function nextPage() {
    $('#prevPage').prop('disabled', false);
    $('.btn').prop('disabled', true);
    pageIndex += 1;
    pageNum = parseInt($('#curPage').text());
    $('#curPage').text(pageNum + 1);
    await getBooks(pageIndex);
    $('.btn').prop('disabled', false);
    if (pageIndex == (totalPages - 1)) {
        $('#nextPage').prop('disabled', true);
        $('#endOfResults').text('Due to restrictions from Google\'s API, results are limited to 5 pages. To get a better result, try using a more specific query or the advanced search function');
    }
};

async function prevPage() {
    $('#nextPage').prop('disabled', false);
    $('.btn').prop('disabled', true);
    $('#endOfResults').text('');
    pageIndex -= 1;
    if (pageIndex >= 0) {
        pageNum = parseInt($('#curPage').text());
        $('#curPage').text(pageNum - 1);
        await getBooks(pageIndex);
        $('.btn').prop('disabled', false);
    }
    if (pageIndex <= 0) {
        pageIndex = 0;
        $('#prevPage').prop('disabled', true);
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
}
