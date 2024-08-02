const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.get('/channels', chatController.getChannels);
router.post('/message', chatController.postMessage);
router.get('/messages/:channelId', chatController.getMessages);

module.exports = router;
