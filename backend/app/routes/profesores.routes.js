const router = require('express').Router();
const profesores = require('../controllers/profesores.controller');

router.get('/', profesores.getAll);
router.get('/:id', profesores.getOne);
router.post('/', profesores.create);
router.put('/:id', profesores.update);
router.delete('/:id', profesores.delete);

module.exports = router;