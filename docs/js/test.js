function getTests() {
  $.getScript('js/index.js', function (data) {
    getBooks(0);
    getBooks('x');
  });
}