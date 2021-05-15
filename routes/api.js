const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db/setup');
const router = new express.Router();

const points = db.get('points');

const dates = [];

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
}

router.post('/board/:id', async (req, res) => {
  const { id: board } = req.params;

  // let newPoint = {
  //   createdAt: new Date(),
  //   value: 0.3125,
  //   board,
  // };

  // for (let i = 0; i < 13; i++) {
  //   dates.push(randomDate(new Date(), new Date(), 0, 24));
  // }

  // dates.sort((a, b) => {
  //   return new Date(b) - new Date(a);
  // });

  const { createdAt } = await points.insert({
    createdAt: new Date(2021, 4, 12, 17, 20),
    value: 0.3125,
    board,
  });

  // dates.forEach(async (d) => {
  // });

  // const { createdAt } = await points.insert(newPoint);
  return res.json({ createdAt });
});

router.get('/board/:id/points', async (req, res) => {
  const { id: board } = req.params;

  const allPointsOfBoard = await points.find({ board });

  return res.json({ data: allPointsOfBoard, accessedAt: new Date() });
});

module.exports = router;
