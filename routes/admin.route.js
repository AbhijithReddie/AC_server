const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/addAlumni', adminController.addAlumni);
router.delete('/deleteAlumni', adminController.deleteAlumni);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
//router.get('/posts', adminController.getPosts);
router.delete('/posts/:id', adminController.deletePost);

module.exports = router;
