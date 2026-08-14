from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.notifier import notifier

router = APIRouter()

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    await notifier.connect(websocket)
    try:
        while True:
            # We don't necessarily expect messages from the client yet, 
            # but we need to keep the connection open and listen.
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        notifier.disconnect(websocket)
