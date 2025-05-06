import asyncio
import json
import cv2
import numpy as np
from aiohttp import web
from aiortc import RTCPeerConnection, RTCSessionDescription, MediaStreamTrack
from av import VideoFrame

pcs = set()  # Set of all peer connections

class TransformedVideoTrack(MediaStreamTrack):
    """
    A video track that applies a selected transformation to the received frames.
    """
    kind = "video"

    def __init__(self, track, transform_type="grayscale"):
        super().__init__()  # Initialize the base class
        self.track = track
        self.transform_type = transform_type

    async def recv(self):
        frame = await self.track.recv()  # Receive a frame from the input track
        img = frame.to_ndarray(format="bgr24")  # Convert frame to a NumPy array
        
        if self.transform_type == "grayscale":
            transformed = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            transformed = cv2.cvtColor(transformed, cv2.COLOR_GRAY2BGR)
        elif self.transform_type == "edge":
            transformed = cv2.Canny(img, 100, 200)
            transformed = cv2.cvtColor(transformed, cv2.COLOR_GRAY2BGR)
        elif self.transform_type == "blur":
            transformed = cv2.GaussianBlur(img, (15, 15), 0)
        else:
            transformed = img  # No transformation applied
        
        new_frame = VideoFrame.from_ndarray(transformed, format="bgr24")
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base
        return new_frame

async def offer(request):
    print("Received WebRTC offer request")  # Log when the endpoint is hit
    params = await request.json()
    print(f"Offer SDP: {params['sdp']}")  # Log the SDP for debugging
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
    transform_type = params.get("transform", "grayscale")  # Get transformation type

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("iceconnectionstatechange")
    async def on_iceconnectionstatechange():
        print(f"ICE connection state is {pc.iceConnectionState}")
        if pc.iceConnectionState == "connected":
            print("WebRTC connection established successfully.")
        elif pc.iceConnectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    @pc.on("track")
    def on_track(track):
        print(f"Track received: {track.kind}")
        if track.kind == "video":
            print(f"Adding TransformedVideoTrack with {transform_type} to peer connection")
            pc.addTrack(TransformedVideoTrack(track, transform_type))  # Add the transformed track
        elif track.kind == "audio":
            print("Audio track received (not handled).")

    await pc.setRemoteDescription(offer)
    print("Remote description set")
    answer = await pc.createAnswer()
    print("Created WebRTC answer")
    await pc.setLocalDescription(answer)
    print("Local description set")

    response = web.Response(
        content_type="application/json",
        text=json.dumps(
            {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
        ),
    )

    # Add CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return response

async def handle_options(request):
    # Handle preflight CORS requests
    requested_headers = request.headers.get('Access-Control-Request-Headers', '')
    return web.Response(
        status=200,
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': requested_headers,
        }
    )

async def on_shutdown(app):
    # Close all peer connections on shutdown
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)
    pcs.clear()

if __name__ == "__main__":
    app = web.Application()
    app.on_shutdown.append(on_shutdown)
    app.router.add_options("/offer", handle_options)
    app.router.add_post("/offer", offer)
    web.run_app(app, host="0.0.0.0", port=8081)