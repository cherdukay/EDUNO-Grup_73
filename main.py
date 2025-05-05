from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router
import uvicorn

app = FastAPI(title="Eduno API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme ortamında tüm originsler izin veriliyor
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ana endpoint
@app.get("/")
def read_root():
    return {"status": "active", "message": "Eduno API çalışıyor"}

# Router'ı ekle
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    # Uvicorn sunucusunu başlat
    print("Eduno API başlatılıyor...")
    print("Gemini API entegrasyonu ile chatbot sistemi hazır.")
    print("API endpoint: http://localhost:8000/api/chat")
    uvicorn.run(app, host="127.0.0.1", port=8000)