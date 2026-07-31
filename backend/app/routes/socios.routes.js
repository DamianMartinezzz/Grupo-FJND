const router = require('express').Router();
const socios = require('../controllers/socios.controller');

router.get('/', socios.getAll);
router.get('/:id', socios.getOne);
router.post('/', socios.create);
router.put('/:id', socios.update);
router.delete('/:id', socios.delete);

module.exports = router;