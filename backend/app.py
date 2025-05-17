# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from yellow import router as yellow_router
from audio import router as audio_router
from call import router as call_router  # ✅ new line

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
app.include_router(call_router, prefix="/call", tags=["call"])  # ✅ new route
