const yup = require('yup');

const point = yup.object().shape({
  createdAt: yup.date(),
  boardId: yup.string(),
});

module.exports = point;
