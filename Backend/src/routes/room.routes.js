import express from 'express';
import { createRoom } from '../controllers/room.controller.js';
import { protect } from '../utils/middleware.js';

const roomRouter = express.Router();

roomRouter.post('/', protect, createRoom);

export default roomRouter;