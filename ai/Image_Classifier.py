import os
import json

from fastapi import APIRouter, Body, Form, File, UploadFile
from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser

print(load_dotenv())


def parse_ingredient(ingredient):
    if isinstance(ingredient, dict):
        return {k: v for k, v in ingredient.items() if v}
    else:
        return str(ingredient)


def parse_content(content):
    parsed_content = {}

    # 기본 정보 추가 (값이 있는 경우에만)
    for key in ["제목", "설명", "serving", "조리시간", "난이도", "재료", "조리도구", "조리순서"]:
        if content.get(key):
            if key == "재료":
                if isinstance(content[key], dict):
                    # 재료가 딕셔너리인 경우
                    parsed_content[key] = {}
                    for category, ingredients in content[key].items():
                        if isinstance(ingredients, dict):
                            # 카테고리 안에 단일 재료 정보가 있는 경우
                            parsed_content[key][category] = parse_ingredient(ingredients)
                        elif isinstance(ingredients, list):
                            # 카테고리 안에 여러 재료가 리스트로 있는 경우
                            parsed_content[key][category] = [parse_ingredient(ing) for ing in ingredients]
                        else:
                            # 카테고리 자체가 재료 정보인 경우
                            parsed_content[key][category] = ingredients
                elif isinstance(content[key], list):
                    # 재료가 리스트인 경우
                    parsed_content[key] = [parse_ingredient(ing) for ing in content[key]]
                else:
                    # 예외 처리: 재료가 딕셔너리나 리스트가 아닌 경우
                    parsed_content[key] = str(content[key])
            elif key == "조리순서":
                parsed_content[key] = [(index, step["설명"]) for index, step in enumerate(content[key], 1)]
            else:
                parsed_content[key] = content[key]
    return json.dumps(parsed_content, ensure_ascii=False)


def load_json_documents(directory: str):
    documents = []
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            file_path = os.path.join(directory, filename)
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                documents.append(parse_content(data))
    return documents


def create_vector_store(texts):
    # 단어 수준의 임베딩에 적합한 모델 사용
    embeddings = OpenAIEmbeddings(model='text-embedding-3-large')
    vector_store = FAISS.from_texts(texts, embeddings, distance_strategy = DistanceStrategy.COSINE )
    return vector_store


def format_docs(docs):
    return '\n\n'.join(doc.page_content for doc in docs)


def extract_page_contents(docs):
    return [doc.page_content for doc in docs]


def setup_rag(vector_store):
    retriever = vector_store.as_retriever(search_type='similarity', search_kwargs={"k": 5})

    # 질문에 대한 답을 밑의 내용에서 찾아서 한국어로 정리해서 레시피에 대한 설명으로 답하세요.
    template = """
    당신은 질문의 내용을 레시피에서 검색하여 관련된 정보를 생성하는 설명서입니다.
    질문에 대해 밑의 요구사항으로 순서대로 답변을 작성하세요.
    정확한 대답을 작성할 수 없으면, "주어진 정보로는 답변할 수 없습니다."라고 말하세요.
    
    1. 질문을 레시피 제목에서 찾아, 레시피의 제목에 포함되면 내용에서 찾아서 한국어로 정리해서 레시피에 대한 설명으로 답하고 없으면 답변에 넣지 마세요.
    (감자롤피자에는 파프리카 없습니다.)
    2. 질문을 재료의 이름에서 찾아, 재료의 이름들에 포함되면 내용에서 관련된 레시피의 제목을 나열해서 답하고 없으면 답변에 넣지 마세요.
    3. 요구사항은 답변에 넣지 마세요.         

    {context}

    
    질문: {question}
    대답:"""

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

    return qa_chain, retriever


def qa_chain_with_sources(qa_chain, retriever, query):
    result = qa_chain.invoke(query)
    docs = retriever.invoke(query)
    return {"result": result, "source_documents": docs}


router = APIRouter()

directory = "./Recipe_Contents"

# JSON 문서 로드 및 처리
documents = load_json_documents(directory)

vector_store = create_vector_store(documents)
print("레시피 벡터 저장소 생성 완료")

qa_chain, retriever = setup_rag(vector_store)
print("레시피 RAG 설정 완료")


@router.post("/chat/talk")
async def recipes_answer(query: dict = Body(...)):
    # query = await query['query']
    query = query['query']

    result = qa_chain_with_sources(qa_chain, retriever, query)
    # print(result)

    print(f"\n질문: {query}")
    print(f"답변: {result['result']}")

    print("\n참고한 문서:")
    for doc in result['source_documents']:
        print(f"- {doc.page_content[:100]}...")  # 첫 100자만 출력

    return {"answer": result['result']}


@router.post("/chat/image")
async def image_classifier(file: UploadFile = Form(...)):
    print(file)

    # query = query['query']
    query = '짜장면'

    result = qa_chain_with_sources(qa_chain, retriever, query)
    # print(result)

    print(f"\n질문: {query}")
    print(f"답변: {result['result']}")

    print("\n참고한 문서:")
    for doc in result['source_documents']:
        print(f"- {doc.page_content[:100]}...")  # 첫 100자만 출력

    return {"answer": result['result'], "query": query}


@router.post("/search")
# 파일 하나만 받을 때
# async def image_classifier(image: UploadFile = File(...)):
# 폼 데이터를 받을 때
async def image_classifier(image: UploadFile = Form(...)):
    print(image)

    return {"result": "짜장면"}
