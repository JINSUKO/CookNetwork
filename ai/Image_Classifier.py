import json
import os

from fastapi import APIRouter, Body
router = APIRouter()

directory = "./FAQ_Answer"

# python FASTapi 서버 실행시 먼저 실행 해둔다.
# 요청마다 실행하면 답변이 오래 걸림.
# JSON 문서 로드 및 처리

def load_json_answers(directory):
    for filename in os.listdir(directory):
        if filename.endswith('Answer.json'):
            file_path = os.path.join(directory, filename)
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                print(data.__len__())
    return data

documents = load_json_answers(directory)

vector_store = create_vector_store(documents)
print("벡터 저장소 생성 완료")

qa_chain, retriever = setup_rag(vector_store)
print("RAG 설정 완료")

@router.post("/")
async def faq_answer(query: dict = Body(...)):
    query = query['query']

    result = qa_chain_with_sources(qa_chain, retriever, query)
    # print(result)

    docs = retriever.invoke(query)

    print(f"\n질문: {query}")
    print(f"답변: {result['result']}")

    print("\n참고한 문서:")
    for doc in result['source_documents']:
        print(f"- {doc.page_content[:100]}...")  # 첫 100자만 출력

    return {"answer": result['result']}
