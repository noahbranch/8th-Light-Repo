var firstForty;
var pageIndex = 0;
var totalPages = 0;

$(document).ready(function () {

});

function getQuery() {
    var query = $('#searchQuery').val();
    var advQuery = "";

    if ($('#authorSearch').val() != "") {
        advQuery += "+inauthor:" + $('#authorSearch').val();
    }
    if ($('#titleSearch').val() != "") {
        advQuery += "+intitle:" + $('#titleSearch').val();
    }
    if ($('#pubSearch').val() != "") {
        advQuery += "+inpublisher:" + $('#pubSearch').val();
    }
    if ($('#subjectSearch').val() != "") {
        advQuery += "+subject:" + $('#subjectSearch').val();
    }
    if ($('#isbnSearch').val() != "") {
        advQuery += "+isbn:" + $('#isbnSearch').val();
    }
    if ($('#lccnSearch').val() != "") {
        advQuery += "+lccn:" + $('#lccnSearch').val();
    }
    if (advQuery != "") {
        query += advQuery;
    }
    query = query.replace(" ", "+");
    return query;
}

function initialLoad() { //Gets initial count of books and pages
    $('#resultsList button').remove();
    query = getQuery();
    if (query == "") {
        return;
    }
    $('.btn').prop('disabled', true);
    $.ajax({
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + query + "&maxResults=40",
        type: "GET",
        dataType: 'JSON',
        success: function (data) {
            firstForty = data.items;
            firstForty.forEach(element => {
                $('#resultsList').append('<button class="btn btn-default bookLink" onclick="loadBook(\'' + element.id + '\')">' + element.volumeInfo.title + '</button>');
            });
            $('#curPage').text("1");
            var possiblePages = Math.ceil(data.totalItems / 40);
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
    });
};

function getBooks(startIndex) {
    $('.btn').prop('disabled', true);
    startIndex = (startIndex) * 40
    query = getQuery();
    $.ajax({
        url:'https://www.googleapis.com/books/v1/volumes?q=' + query + '&startIndex=' + startIndex + "&maxResults=40", 
        type: "GET",
        dataType: 'JSON',
        success: function (data) {
        $('#resultsList button').remove();
        firstForty = data.items;
        firstForty.forEach(element => {
            $('#resultsList').append('<button class="btn btn-default bookLink" onclick="loadBook(\'' + element.id + '\')">' + element.volumeInfo.title + '</button>');
        });
        }
    });
    $('.btn').prop('disabled', false);
    if (totalPages <= 1) {
        $('#nextPage').prop('disabled', true);
    }
}

function loadBook(bookId) {
    var book = firstForty.find(x => x.id == bookId);
    var book = firstForty.find(x => x.id == bookId);
    var thumbNail = "nobook.png"
    if (book.volumeInfo.imageLinks != undefined) {
        thumbNail = book.volumeInfo.imageLinks.thumbnail;
    }
    $('#bookImage').attr('src', thumbNail)
    $('#bookTitle').text(book.volumeInfo.title);
    $('#bookDescription').text((book.volumeInfo.description != undefined ? book.volumeInfo.description : "No summary available"));
    $('#moreInfo').attr('href', book.volumeInfo.infoLink);
    $('#moreInfo').text('More Info')
    var author = "by ";
    if (book.volumeInfo.authors == undefined) {
        author = "Author Unknown";
    } else {

        book.volumeInfo.authors.forEach(auth => {
            author += auth + "; "
        });
    }
    $('#author').text(author);
    $('#publisher').text('Published by: ' + (book.volumeInfo.publisher != undefined ? book.volumeInfo.publisher : "Unknown"));
};

function nextPage() {
    $('#prevPage').prop('disabled', false);
    pageIndex += 1;
    pageNum = parseInt($('#curPage').text());
    $('#curPage').text(pageNum + 1);
    getBooks(pageIndex);
    if (pageIndex == (totalPages - 1)) {
        $('#nextPage').prop('disabled', true);
    }
};

function prevPage() {
    $('#nextPage').prop('disabled', false);
    pageIndex -= 1;
    if (pageIndex >= 0) {
        pageNum = parseInt($('#curPage').text());
        $('#curPage').text(pageNum - 1);
        getBooks(pageIndex);
    }
    if (pageIndex <= 0) {
        pageIndex = 0;
        $('#prevPage').prop('disabled', true);
    }
};

function toggleAdvanced() {
    var advSearch = $('#advancedSearch');
    if (advSearch.css('display') == 'none') {
        $('#advancedOpen').text("Hide Advanced Search");
        advSearch.css('display', 'block');
    } else {
        advSearch.css('display', 'none');
        $('#advancedOpen').text("Show Advanced Search");
    }
}
