# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from yellow import router as yellow_router  # We'll modify yellow.py to use router
from shopify import router as shopify_router   # We'll modify shopify.py to use router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(yellow_router, prefix="/yellow", tags=["yellow"])
app.include_router(shopify_router, prefix="/shopify", tags=["shopify"])