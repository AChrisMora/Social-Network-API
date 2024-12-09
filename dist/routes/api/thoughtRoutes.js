import { Router } from 'express';
const router = Router();
import { getAllThoughts, getThoughtById, createThought, updateThought, deleteThought, deleteAllThought, addThoughtReaction, removeThoughtReaction } from '../../controllers/thoughtsController.js';
// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought).delete(deleteAllThought);
;
// /api/thoughts/:thoughtId
router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);
router.route('/:thoughtId/reactions').post(addThoughtReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(removeThoughtReaction);
export { router as thoughtRouter };
