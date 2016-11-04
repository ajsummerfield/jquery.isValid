(function() {
    var a = new jIsValid(document.getElementById('simple-form'), {
        enableErrorMessages: false,
        onFieldInvalidated: function(el, error) {
            console.log(el);
            console.log(error);
        },
        onFormInvalidated: function() {
            alert('invalid form');
        }
    });

    document.getElementById('reset').addEventListener('click', function() {
        a.reset();
    });
})();