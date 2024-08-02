const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/verifyAlumni', adminController.verifyAlumni);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/posts', adminController.getPosts);
router.delete('/posts/:id', adminController.deletePost);

module.exports = router;
