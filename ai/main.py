from fastapi import FastAPI, Body # pip install fastapi
from starlette.middleware.cors import CORSMiddleware
import FAQ_RAG

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

origins = ["https://cooknetwork.shop", "http://localhost:5000", "http://192.168.0.103:5000",
           "http://192.168.0.139:5000", "http://192.168.0.14:5000", "http://192.168.220.1:5000",
           "http://127.0.0.1:8000"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

app.include_router(FAQ_RAG.router)
