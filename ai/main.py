# pip install langchain-openai
# pip install python-dotenv
# pip install langchain
# pip install langchain-community sentence-transformers torch
# pip install python-multipart

from fastapi import FastAPI # pip install fastapi
from starlette.middleware.cors import CORSMiddleware
import uvicorn
import FAQ_RAG
import Image_Classifier

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

origins = ["https://cooknetwork.shop", "http://localhost:5000", "http://192.168.0.103:5000",
           "http://192.168.0.139:5000", "http://192.168.0.14:5000", "http://192.168.220.1:5000",
           "http://127.0.0.1:8000"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

app.include_router(FAQ_RAG.router, prefix="/ai/FAQAnswer")

app.include_router(Image_Classifier.router, prefix="/ai/recipeImage")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000
    )