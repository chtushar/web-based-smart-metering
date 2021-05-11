const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db/setup');
const router = new express.Router();

const points = db.get('points');

router.post('/board/:id', async (req, res) => {
  const { id: board } = req.params;

  let newPoint = {
    createdAt: new Date(),
    value: 0.3125,
    board,
  };

  const { createdAt } = await points.insert(newPoint);
  return res.json({ createdAt });
});

router.get('/board/:id/points', async (req, res) => {
  const { id: board } = req.params;

  const allPointsOfBoard = await points.find({ board });

  return res.json({ data: allPointsOfBoard, accessedAt: new Date() });
});

module.exports = router;
