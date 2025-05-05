from fastapi import APIRouter, Request
from pydantic import BaseModel
from ai_engine import chat_with_teacher

router = APIRouter()

class ChatRequest(BaseModel):
    teacher: str
    message: str
    kazanimlar: str = ""

@router.post("/chat")
def chat_endpoint(data: ChatRequest):
    response = chat_with_teacher(
        teacher_name=data.teacher,
        user_message=data.message,
        kazanimlar=data.kazanimlar
    )
    return {"response": response}
