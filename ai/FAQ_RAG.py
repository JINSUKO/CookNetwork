import json
import os

from fastapi import APIRouter, Body, Request

from dotenv import load_dotenv  # pip install python-dotenv
from langchain.prompts import PromptTemplate
# from langchain_huggingface  import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableParallel  # pip install langchain
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings  # pip install langchain-openai

# from langchain_community.embeddings import HuggingFaceEmbeddings
# https://wikidocs.net/231573 # pip install lanchain-community sentence-transformers torch
# https://www.youtube.com/watch?v=sbQPGyVbePY

print(load_dotenv())

def load_json_answers(directory):
    for filename in os.listdir(directory):
        if filename.endswith('Answer.json'):
            file_path = os.path.join(directory, filename)
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                print(data.__len__())
    return data


def create_vector_store(texts):
    embeddings = OpenAIEmbeddings(model='text-embedding-3-large')
    # embeddings = OpenAIEmbeddings(model='text-embedding-3-small')
    vector_store = FAISS.from_texts(texts, embeddings, distance_strategy = DistanceStrategy.COSINE )
    """
    DistanceStrategy Enum 값 5개 있음.
    EUCLIDEAN_DISTANCE = "EUCLIDEAN_DISTANCE"
    MAX_INNER_PRODUCT = "MAX_INNER_PRODUCT"
    DOT_PRODUCT = "DOT_PRODUCT"
    JACCARD = "JACCARD"
    COSINE = "COSINE"
    """
    return vector_store

def extract_page_contents(docs):
    return [doc.page_content for doc in docs]

def setup_rag(vector_store):
    retriever = vector_store.as_retriever(search_type='similarity', search_kwargs={"k": 10})

    # Similarity score threshold (기준 스코어 이상인 문서를 대상으로 추출)
    # retriever = vector_store.as_retriever(search_type='similarity_score_threshold', search_kwargs={'score_threshold': -0.3})
    # https: // wikidocs.net / 231600

    template = """
    질문에 대한 답을 밑의 내용에서 찾아서 한국어로 정리해서 한 문장으로 대답하세요.
    밑의 내용에 정확한 대답이 없으면 "주어진 정보로는 답변할 수 없습니다."라고 말하세요.

    {context}

    질문에 대한 답을 알 수 없다면, "주어진 정보로는 답변할 수 없습니다."라고 말하세요.

    질문: {question}
    대답: """

    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)

    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

    qa_chain = (
            RunnableParallel(
                {"context": retriever | extract_page_contents, "question": RunnablePassthrough()}
            )
            | QA_CHAIN_PROMPT
            | llm
            | StrOutputParser()
    )

    # print(retriever)

    # print('QA_CHAIN_PROMPT',
    #       QA_CHAIN_PROMPT.format(**{"context": retriever.invoke('요리법 등록 어디서 해?'), "question": RunnablePassthrough()}))

    return qa_chain, retriever


def qa_chain_with_sources(qa_chain, retriever, query):
    result = qa_chain.invoke(query)
    docs = retriever.invoke(query)
    return {"result": result, "source_documents": docs}


router = APIRouter()

directory = "./FAQ_Answer"

# python FASTapi 서버 실행시 먼저 실행 해둔다.
# 요청마다 실행하면 답변이 오래 걸림.
# JSON 문서 로드 및 처리
documents = load_json_answers(directory)
# print(documents)

vector_store = create_vector_store(documents)
print("FAQ 벡터 저장소 생성 완료")

qa_chain, retriever = setup_rag(vector_store)
print("FAQ RAG 설정 완료")

# @router.post("/")
# async def faq_answer(query: dict = Body(...)):
    # query = query['query']

@router.post("/")
async def faq_answer(request: Request):
    body = await request.body()

    data = json.loads(body)
    query = data.get('query')

    print(query)

    result = qa_chain_with_sources(qa_chain, retriever, query)
    # print(result)

    docs = retriever.invoke(query)

    print(f"\n질문: {query}")
    print(f"답변: {result['result']}")

    print("\n참고한 문서:")
    for doc in result['source_documents']:
        print(f"- {doc.page_content[:100]}")  # 첫 100자만 출력

    return {"answer": result['result']}
