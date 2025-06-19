import asyncio
import json
import time
import cv2
import numpy as np
import torch
import torchvision

from aiohttp import web
from aiortc import RTCPeerConnection, RTCSessionDescription, MediaStreamTrack
from av import VideoFrame

from ultralytics import YOLO
from ultralytics.utils import LOGGER
from ultralytics.utils.plotting import Annotator, colors

# Load YOLO model
model_file = "yolo11s.pt"
model = YOLO(model_file)
model.to("cuda" if torch.cuda.is_available() else "cpu")
classes = model.names

# YOLO settings
conf = 0.3
iou = 0.3
max_det = 20
tracker = "bytetrack.yaml"
track_args = {"persist": True, "verbose": False}

pcs = set()

class YOLOVideoTrack(MediaStreamTrack):
    """
    A MediaStreamTrack that processes video frames with YOLO object tracking.
    """
    kind = "video"

    def __init__(self, track):
        super().__init__()
        self.track = track
        self.selected_object_id = None
        self.fps_counter, self.fps_timer, self.fps_display = 0, time.time(), 0

    async def recv(self):
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")

        results = model.track(img, conf=conf, iou=iou, max_det=max_det, tracker=tracker, **track_args)
        detections = results[0].boxes.data if results[0].boxes is not None else []

        annotator = Annotator(img)
        for track in detections:
            track = track.tolist()
            if len(track) < 6:
                continue
            x1, y1, x2, y2 = map(int, track[:4])
            class_id = int(track[6]) if len(track) >= 7 else int(track[5])
            track_id = int(track[4]) if len(track) == 7 else -1
            color = colors(track_id, True)
            label = f"{classes[class_id]} ID {track_id}"

            if track_id == self.selected_object_id:
                annotator.box_label([x1, y1, x2, y2], label=f"ACTIVE: TRACK {track_id}", color=color)
            else:
                annotator.box_label([x1, y1, x2, y2], label=label, color=color)

        # Optionally show FPS
        self.fps_counter += 1
        if time.time() - self.fps_timer >= 1.0:
            self.fps_display = self.fps_counter
            self.fps_counter = 0
            self.fps_timer = time.time()

        cv2.putText(img, f"FPS: {self.fps_display}", (10, 25), 0, 0.7, (255, 255, 255), 1, cv2.LINE_AA)

        new_frame = VideoFrame.from_ndarray(img, format="bgr24")
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base
        return new_frame

# WebRTC offer handling
async def offer(request):
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("iceconnectionstatechange")
    async def on_iceconnectionstatechange():
        if pc.iceConnectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    @pc.on("track")
    def on_track(track):
        if track.kind == "video":
            pc.addTrack(YOLOVideoTrack(track))

    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    response = web.Response(
        content_type="application/json",
        text=json.dumps({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}),
    )
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# CORS preflight handler
async def handle_options(request):
    requested_headers = request.headers.get('Access-Control-Request-Headers', '')
    return web.Response(
        status=200,
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': requested_headers,
        }
    )

# Shutdown cleanup
async def on_shutdown(app):
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)
    pcs.clear()

if __name__ == "__main__":
    app = web.Application()
    app.on_shutdown.append(on_shutdown)
    app.router.add_options("/offer", handle_options)
    app.router.add_post("/offer", offer)
    web.run_app(app, host="0.0.0.0", port=8081)
