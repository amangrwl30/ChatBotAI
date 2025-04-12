# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from yellow import router as yellow_router  # We'll modify yellow.py to use router
from audio import router as audio_router    # We'll modify audio.py to use router
from shopify import router as shopify_router   # We'll modify shopify.py to use router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(yellow_router, prefix="/yellow", tags=["yellow"])
app.include_router(audio_router, prefix="/audio", tags=["audio"])
app.include_router(shopify_router, prefix="/shopify", tags=["shopify"])