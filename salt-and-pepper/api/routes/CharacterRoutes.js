'use strict';

module.exports = function(app) {
    var characters = require('../controllers/CharacterControllers');

    // Characters Routes
    app.route('/characters')
        .get(characters.list_all_characters)
        .post(characters.create_a_character);

    app.route('/characters/:characterId')
        .get(characters.read_a_character)
        .put(characters.update_a_character)
        .delete(characters.delete_a_character);
};
