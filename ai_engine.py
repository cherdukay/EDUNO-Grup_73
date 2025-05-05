# ai_engine.py

import os
from dotenv import load_dotenv
import google.generativeai as genai
import pathlib
import textwrap

# .env dosyasından API anahtarını yükle
load_dotenv()
GENAI_API_KEY = os.getenv('GOOGLE_API_KEY')

if not GENAI_API_KEY:
    raise ValueError("GOOGLE_API_KEY bulunamadı. Lütfen .env dosyasını kontrol edin.")

# Model yapılandırması
genai.configure(api_key=GENAI_API_KEY)

# Öğretmen karakterlerine göre prompt yapısı
TEACHER_PROFILES = {
    "feyza": {
        "style": "Sen oldukça sevgi dolu, şefkatli ve anlayışlı bir öğretmensin. Öğrencilerine 'canım', 'güzelim', 'tatlım' gibi sevgi dolu hitaplar kullanırsın. Her zaman pozitif ve destekleyicisin.",
        "tone": "sevgi dolu"
    },
    "ahmet": {
        "style": "Sen profesyonel ve akademik yaklaşımı olan bir öğretmensin. Konuları detaylı ve sistematik şekilde açıklarsın. Ciddi ve saygılı bir ton kullanırsın.",
        "tone": "profesyonel"
    },
    "suleyman": {
        "style": "Sen sert ve disiplinli bir öğretmensin. Sık sık 'Bak şimdi!', 'Dikkat et!' gibi uyarıcı ifadeler kullanırsın. Öğrencilerin tam dikkatini beklersin.",
        "tone": "sert"
    },
    "tolga": {
        "style": "Sen enerjik ve heyecanlı bir öğretmensin. Biyoloji konularını günlük hayatla ilişkilendirerek anlatırsın. Pozitif enerji dolu ve arkadaş canlısısın.",
        "tone": "enerjik"
    }
}

def generate_system_prompt(teacher_name: str, kazanımlar: str = "") -> str:
    profile = TEACHER_PROFILES.get(teacher_name.lower())

    if not profile:
        return "Sen bir öğretmensin. Öğrencilere yardım etmeye çalış."

    prompt = f"""
Sen {teacher_name} adında bir öğretmensin.
Tarzın: {profile['style']}
Ses tonun: {profile['tone']}

MEB kazanımları ve ders içeriğine hakim bir öğretmen gibi davran.
Eğer öğrenci matematik dersiyle ilgili soru sorarsa, doğru bilgiyi ver.

{f"Ders kazanımları:\n{kazanımlar}" if kazanımlar else ""}
"""
    return prompt.strip()

def chat_with_teacher(teacher_name: str, user_message: str, kazanimlar: str = "") -> str:
    try:
        # Yapılandırma
        generation_config = {
            "temperature": 0.9,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 2048,
        }

        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
        ]

        # Model başlatma
        model = genai.GenerativeModel(model_name="models/gemini-2.0-flash",
                                    generation_config=generation_config,
                                    safety_settings=safety_settings)

        # Sistem promptu ve kullanıcı mesajını hazırla
        prompt = generate_system_prompt(teacher_name, kazanimlar)
        
        # Chat başlat ve mesajları gönder
        response = model.generate_content([
            {"role": "user", "parts": [prompt]},
            {"role": "model", "parts": ["Anladım, bu karakteri benimseyeceğim."]},
            {"role": "user", "parts": [user_message]}
        ])

        if response.text:
            return response.text.strip()
        else:
            return "Üzgünüm, şu anda yanıt üretemiyorum. Lütfen tekrar deneyin."

    except Exception as e:
        error_msg = str(e)
        print(f"Hata detayı: {error_msg}")
        return "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin."

# API bağlantı testi
print("\nGemini API bağlantı testi başlatılıyor...")
try:
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    response = model.generate_content("Merhaba")
    print("✓ Gemini API bağlantısı başarılı!")
    print(f"Test yanıtı: {response.text}")
except Exception as e:
    print(f"✗ Gemini API bağlantı hatası: {e}")