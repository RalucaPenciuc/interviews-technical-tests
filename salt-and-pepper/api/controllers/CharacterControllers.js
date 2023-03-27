'use strict';

const mongoose = require('mongoose');
const Character = mongoose.model('Characters');

exports.list_all_characters = function(req, res) {
  Character.find({}, function(err, character) {
    if (err) {
      res.send(err);
    }
    res.json(character);
  });
};

exports.create_a_character = function(req, res) {
  var new_character = new Character(req.body);
  new_character.save(function(err, character) {
    if (err) {
      res.send(err);
    }
    res.json(character);
  });
};

exports.read_a_character = function(req, res) {
  Character.findById(req.params.characterId, function(err, character) {
    if (err) {
      res.send(err);
    }
    res.json(character);
  });
};

exports.update_a_character = function(req, res) {
  Character.findOneAndUpdate({_id: req.params.characterId}, req.body, {new: true}, function(err, character) {
    if (err) {
      res.send(err);
    }
    res.json(character);
  });
};

exports.delete_a_character = function(req, res) {
  Character.remove({_id: req.params.characterId}, function(err, character) {
    if (err) {
      res.send(err);
    }
    res.json({message: 'Character successfully deleted'});
  });
};