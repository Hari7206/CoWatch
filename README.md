# CoWatch — YouTube Watch Party

Watch YouTube videos together, in perfect sync. Create a room, share a code, and watch with friends from anywhere.

## Live Demo

- **Frontend:** https://co-watch-five.vercel.app
- **Backend API:** https://cowatch-79mw.onrender.com

> Note: The backend runs on Render's free tier and sleeps after 15 minutes of inactivity. The first request may take ~30 seconds while it wakes up.

## Features

- **Real-time sync** — play, pause, seek, and change video for everyone in the room
- **Room-based model** — unique 6-character codes, no signup required
- **Role-based access control** — Host, Moderator, Participant
- **Host powers** — assign roles, remove participants, transfer host
- **Anonymous by default** — guests pick a name and start watching (2-hour session)
- **Request approval flow** — participants request playback changes; host approves from chat
- **Text chat** — every room has live chat
- **YouTube integration** — search inside the room or paste a URL
- **Light/dark theme**

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Tailwind CSS |
| Backend | Node.js + Express |
| Real-time | Socket.IO (WebSockets) |
| Database | MongoDB Atlas (users only) |
| Auth | JWT + bcrypt |
| Video | YouTube IFrame Player API |
| Hosting | Vercel (frontend) + Render (backend) |

## Architecture Overview

### How WebSockets integrate with the flow

The application is split into two communication layers:

**HTTP (REST) — for one-shot operations:**
- `POST /api/auth/register`, `/login`, `/guest` — obtain a JWT
- `GET /api/auth/user` — verify the current token
- `POST /api/rooms` — create a new room

**WebSocket (Socket.IO) — for real-time synchronization:**
- Clients connect with the JWT in the handshake (`auth: { token }`)
- The server verifies the token once per connection and attaches `socket.userId`
- Every playback action (`play`, `pause`, `seek`, `change_video`) is emitted from the client, validated **on the server**, applied to the room's state, and broadcast as `sync_state` to everyone in the room
- A `suppressEvents` flag prevents infinite loops when the client applies a remote state to the YouTube player
- Late joiners receive the full room snapshot on `join_room`, with `currentTime` computed live from `updatedAt` so they land at the correct playback position

### Server architecture (OOP)

- **`Participant`** — one user in one room (id, username, role, socketId). Owns the `can(action)` permission check.
- **`Room`** — participants map, playback state, and every action (`applyAction`, `assignRole`, `transferHost`, `removeParticipantBy`). Enforces all role rules.
- **`RoomManager`** — creates and looks up rooms; single shared instance.
- **`ChatLog`** — messages and request objects inside a room.

The socket handlers are thin routers — every permission check and state mutation lives in the domain classes.

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/Hari7206/CoWatch.git
cd CoWatch