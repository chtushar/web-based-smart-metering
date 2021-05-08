const yup = require('yup');

const board = yup.object().shape({
  name: yup.string(),
});

module.exports = board;
