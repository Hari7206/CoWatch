import { Routes, Route } from 'react-router-dom';

import Home from '../features/landing/pages/Home';
import Start from '../features/landing/pages/Start';
import Login from '../features/auth/pages/Login';
import Signup from '../features/auth/pages/Signup';
import Guest from '../features/auth/pages/Guest';
import CreateRoom from '../features/streaming/pages/CreateRoom';
import JoinRoom from '../features/streaming/pages/JoinRoom';
import Room from '../features/streaming/pages/Room';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/room/:roomId" element={<Room />} />
        </Routes>
    );
};

export default AppRoutes;