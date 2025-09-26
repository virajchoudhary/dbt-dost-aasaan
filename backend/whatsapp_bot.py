import os
import json
import requests
from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from typing import Dict, Any
from dotenv import load_dotenv
from knowledge import KNOWLEDGE_BASE # Import from the new file

# --- Initial Setup ---
load_dotenv()
app = FastAPI()

# --- Load Credentials and Configuration ---
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")
BACKEND_API_URL = "http://127.0.0.1:8000/chat"
LOGO_IMAGE_URL = "https://i.postimg.cc/J0wCNPRN/ad.jpg"

# --- Global Variables ---
conversation_state: Dict[str, Dict[str, Any]] = {}

# --- Bot's Text Content (Bilingual) ---
MESSAGES = {
    'en': {
        'menu_body': "Welcome to the DBT Dost Helpdesk. This service provides clear information about government schemes. Please select an option to begin.",
        'menu_button_2': "Ask a Question",
        'menu_button_3': "DBT FAQs",
        'invalid_input': "Invalid input. Please send 'Hi' to see the main menu.",
        'ai_prompt': "Please type your question about Aadhaar or DBT.",
        'faq_intro': "For detailed information on Direct Benefit Transfer (DBT), please visit the official UIDAI FAQ page:",
        'faq_link': "https://uidai.gov.in/en/contact-support/have-any-question/308-english-uk/faqs/direct-benefit-transfer-dbt.html"
    },
    'hi': {
        'menu_body': "डीबीटी दोस्त हेल्पडेस्क में आपका स्वागत है। यह सेवा सरकारी योजनाओं के बारे में स्पष्ट और सरल जानकारी प्रदान करने के लिए बनाई गई है। कृपया आरंभ करने के लिए एक विकल्प चुनें।",
        'menu_button_2': "सवाल पूछें",
        'menu_button_3': "डीबीटी FAQs",
        'invalid_input': "अमान्य इनपुट। कृपया मुख्य मेनू देखने के लिए 'Hi' भेजें।",
        'ai_prompt': "कृपया आधार या डीबीटी के बारे में अपना प्रश्न टाइप करें।",
        'faq_intro': "प्रत्यक्ष लाभ हस्तांतरण (डीबीटी) पर विस्तृत जानकारी के लिए, कृपया आधिकारिक यूआईडीएआई FAQ पृष्ठ पर जाएं:",
        'faq_link': "https://uidai.gov.in/en/contact-support/have-any-question/308-english-uk/faqs/direct-benefit-transfer-dbt.html"
    }
}

# --- Helper Functions ---
def send_whatsapp_message(recipient_id: str, data: Dict[str, Any]):
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}", "Content-Type": "application/json"}
    payload = {"messaging_product": "whatsapp", "to": recipient_id, **data}
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Message sent to {recipient_id}: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending message to {recipient_id}: {e}")

def send_text_message(recipient_id: str, message_text: str):
    data = {"text": {"body": message_text}}
    send_whatsapp_message(recipient_id, data)

def send_language_selection(recipient_id: str):
    data = {
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {"text": "Welcome to DBT Dost!\n\nकृपया अपनी भाषा चुनें / Please select your language:"},
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": "lang_hi", "title": "हिंदी (Hindi)"}},
                    {"type": "reply", "reply": {"id": "lang_en", "title": "English"}}
                ]
            }
        }
    }
    send_whatsapp_message(recipient_id, data)

def send_main_menu(recipient_id: str, lang: str):
    msg = MESSAGES.get(lang, MESSAGES['en'])
    data = {
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {"type": "image", "image": {"link": LOGO_IMAGE_URL}},
            "body": {"text": msg['menu_body']},
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": "menu_ask_ai", "title": msg['menu_button_2']}},
                    {"type": "reply", "reply": {"id": "menu_learn", "title": msg['menu_button_3']}}
                ]
            }
        }
    }
    send_whatsapp_message(recipient_id, data)

def find_faq_answer(message: str, lang: str) -> str | None:
    faq_set = KNOWLEDGE_BASE.get(lang, KNOWLEDGE_BASE['en'])
    message_lower = message.lower()
    for key, value in faq_set.items():
        for keyword in value['keywords']:
            if keyword in message_lower:
                return value['answer']
    return None

def call_ai_backend(message: str, lang: str) -> str:
    try:
        response = requests.post(BACKEND_API_URL, json={"message": message, "language": lang})
        response.raise_for_status()
        return response.json().get("answer", "Sorry, I couldn't get a response.")
    except requests.exceptions.RequestException as e:
        print(f"Error calling AI backend: {e}")
        return "Sorry, the AI service is currently unavailable."

# --- Webhook Endpoints ---
@app.get("/webhook")
async def webhook_verify(request: Request):
    if request.query_params.get('hub.mode') == 'subscribe' and request.query_params.get('hub.verify_token') == VERIFY_TOKEN:
        return PlainTextResponse(request.query_params.get('hub.challenge'), status_code=200)
    return PlainTextResponse("Failed validation.", status_code=403)

@app.post("/webhook")
async def webhook_handler(request: Request):
    data = await request.json()
    print(json.dumps(data, indent=2))
    try:
        message_data = data["entry"][0]["changes"][0]["value"]["messages"][0]
        sender_id = message_data["from"]
        user_session = conversation_state.get(sender_id, {})
        lang = user_session.get('lang', 'en')

        if message_data.get("type") == "interactive" and message_data["interactive"]["type"] == "button_reply":
            button_id = message_data["interactive"]["button_reply"]["id"]

            if button_id.startswith("lang_"):
                chosen_lang = button_id.split("_")[1]
                conversation_state[sender_id] = {'lang': chosen_lang, 'state': 'menu'}
                send_main_menu(sender_id, chosen_lang)
            elif button_id == "menu_ask_ai":
                conversation_state[sender_id]['state'] = 'awaiting_ai_query'
                send_text_message(sender_id, MESSAGES[lang]['ai_prompt'])
            elif button_id == "menu_learn":
                faq_message = f"{MESSAGES[lang]['faq_intro']}\n\n{MESSAGES[lang]['faq_link']}"
                send_text_message(sender_id, faq_message)
                if sender_id in conversation_state:
                    conversation_state[sender_id]['state'] = 'menu'

        elif message_data.get("type") == "text":
            message_body = message_data["text"]["body"].strip()
            user_state = user_session.get('state')

            if user_state == 'awaiting_ai_query':
                # **FIX**: First, check the local knowledge base for an instant answer.
                faq_answer = find_faq_answer(message_body, lang)
                if faq_answer:
                    send_text_message(sender_id, faq_answer)
                else:
                    # If not found, then call the AI backend.
                    ai_response = call_ai_backend(message_body, lang)
                    send_text_message(sender_id, ai_response)
                
                # **FIX**: Reset state back to 'menu' so the user can ask another question.
                if sender_id in conversation_state:
                    conversation_state[sender_id]['state'] = 'menu'

            elif message_body.lower() in ['hi', 'hello', 'menu', 'नमस्ते', 'मेनू']:
                if 'lang' in user_session:
                    send_main_menu(sender_id, user_session['lang'])
                else:
                    send_language_selection(sender_id)
            else:
                 if 'lang' not in user_session:
                    send_language_selection(sender_id)
                 else:
                    send_text_message(sender_id,MESSAGES[lang]['invalid_input'])

    except (KeyError, IndexError, TypeError) as e:
        print(f"Error processing webhook data: {e}")
        pass
    
    return PlainTextResponse("OK", status_code=200)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)