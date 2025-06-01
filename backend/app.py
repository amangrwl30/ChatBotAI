# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from yellow import router as yellow_router
from audio import router as audio_router
from call import router as call_router
from mydemo import app as mydemo_app  # Import the FastAPI app from mydemo
from capture import router as capture_router  # Import the router from capture
from pagedemo import router as pagedemo_router  # Import the router from pagedemo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(yellow_router, prefix="/yellow", tags=["yellow"])
#app.include_router(shopify_router, prefix="/shopify", tags=["shopify"])
app.include_router(audio_router, prefix="/audio", tags=["audio"])
app.include_router(call_router, prefix="/call", tags=["call"])
app.include_router(mydemo_app.router, prefix="/leads", tags=["leads"])  # Include mydemo routes under /leads prefix
app.include_router(capture_router, prefix="/capture", tags=["capture"])  # Add capture routes
app.include_router(pagedemo_router, prefix="/page", tags=["page"])  # Add pagedemo routes
