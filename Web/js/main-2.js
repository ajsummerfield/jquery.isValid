(function() {
    var a = new jIsValid(document.getElementById('simple-form'));

    document.getElementById('reset').addEventListener('click', function() {
        a.reset();
    });
})();