import asyncio
import json
import logging
from typing import List
from fastapi import WebSocket

logger = logging.getLogger("ai-kos-lite")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        if not self.active_connections:
            return
            
        json_str = json.dumps(message)
        logger.info(f"Broadcasting message to {len(self.active_connections)} clients: {message.get('title')}")
        
        # Create a list of disconnected sockets to remove them later
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json_str)
            except Exception as e:
                logger.warning(f"Error broadcasting to a websocket, marking for removal: {e}")
                disconnected.append(connection)
                
        for conn in disconnected:
            self.disconnect(conn)

notifier = ConnectionManager()
