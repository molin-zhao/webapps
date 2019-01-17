const express = require('express');
const router = express.Router();


// get a user profile info using a certain user id
router.get('/:id', (req, res) => {
    let userId = req.params.id;
})

module.exports = router;