describe("Tests", function() {
    it("Returns true or false if input is empty", function() {
        
        var formOne = $('#form-three').isValid().data('isValid');
        expect(formOne.isEmpty('#form-three #test-input')).toBe(true);
    });
});