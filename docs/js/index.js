var firstTen;
var pageIndex = 0;
var totalPages = 0;

function getQuery() {
    var query = $('#searchQuery').val();
    console.log(query);
    var advQuery = "+";

    if ($('#advancedSearch').css('display') != 'none') {
        if ($('#authorSearch').val() != "") {
            advQuery += "inauthor:" + $('#authorSearch').val();
        }
        if ($('#titleSearch').val() != "") {
            advQuery += "intitle:" + $('#titleSearch').val();
        }
        if ($('#pubSearch').val() != "") {
            advQuery += "inpublisher:" + $('#pubSearch').val();
        }
        if ($('#subjectSearch').val() != "") {
            advQuery += "subject:" + $('#subjectSearch').val();
        }
        if ($('#isbnSearch').val() != "") {
            advQuery += "isbn:" + $('#isbnSearch').val();
        }
        if ($('#lccnSearch').val() != "") {
            advQuery += "lccn:" + $('#lccnSearch').val();
        }
        if (advQuery != "+") {
            query += advQuery;
        }
    }
    query = query.replace(" ", "+");
    return query;
}

function initialLoad() { //Gets initial count of books and pages
    $('#resultsList li').remove();
    query = getQuery();
    $.get('https://www.googleapis.com/books/v1/volumes?q=' + query, function (data, status) {
        console.log(data);
        firstTen = data.items;
        firstTen.forEach(element => {
            $('#resultsList').append('<li><button class="btn btn-link bookLink" onclick="loadBook(\'' + element.id + '\')">' + element.volumeInfo.title + '</button></li>');
        });
        $('#curPage').text("1");
        totalPages = Math.ceil(data.totalItems / 10);
        $('#totalPages').text(totalPages);
    });
};

function getBooks(startIndex) {
    pageIndex = startIndex;
    $('#resultsList li').remove();
    query = $('#searchQuery').val();
    console.log(query);
    query = query.replace(" ", "+");
    $.get('https://www.googleapis.com/books/v1/volumes?q=' + query + '&startIndex=' + startIndex, function (data, status) {
        console.log(data);
        firstTen = data.items;
        firstTen.forEach(element => {
            $('#resultsList').append('<li><button class="btn btn-link bookLink" onclick="loadBook(\'' + element.id + '\')">' + element.volumeInfo.title + '</button></li>');
        });
    });
}

function loadBook(bookId) {
    var book = firstTen.find(x => x.id == bookId);
    $('#bookImage').attr('src', book.volumeInfo.imageLinks.thumbnail)
    $('#bookTitle').text(book.volumeInfo.title);
    $('#bookDescription').text(book.volumeInfo.description)
    var author = "by ";
    book.volumeInfo.authors.forEach(auth => {
        author += auth + "; "
    });
    $('#author').text(author);
    $('#publisher').text('Published by: ' + book.volumeInfo.publisher)
};

function nextPage() {
    if ((pageIndex) <= totalPages) {
    pageIndex += 10;
        pageNum = parseInt($('#curPage').text());
        $('#curPage').text(pageNum + 1);
        getBooks(pageIndex);
    }
};

function prevPage() {
    if ((pageIndex) > 0) {
    pageIndex -= 10;
        pageNum = parseInt($('#curPage').text());
        $('#curPage').text(pageNum - 1);
        getBooks(pageIndex);
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

function jumpTo() {
    var page = parseInt($("#jumpTo").val());
    if (page <= totalPages) {
        getBooks(page);
        $('#curPage').text(page);
    } else {
        getBooks(totalPages);
        $('#curPage').text(totalPages);
    }
}
