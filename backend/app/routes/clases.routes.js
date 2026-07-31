const router = require('express').Router();
const clases = require('../controllers/clases.controller');

router.get('/', clases.getAll);
router.get('/:id', clases.getOne);
router.post('/', clases.create);
router.put('/:id', clases.update);
router.patch('/:id/estado', clases.updateEstado);
router.delete('/:id', clases.delete);

module.exports = router;