import os
import json
import requests
from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from typing import Dict, Any
from dotenv import load_dotenv

# --- Initial Setup ---
load_dotenv()
app = FastAPI()

# --- Load Credentials and Configuration ---
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")
LOGO_IMAGE_URL = "https://i.postimg.cc/J0wCNPRN/ad.jpg"

# --- Global Variables ---
conversation_state: Dict[str, Dict[str, Any]] = {}

# --- Bot's Text Content (Bilingual) ---
MESSAGES = {
    'en': {
        'menu_body': "Welcome to the DBT Dost Helpdesk. This service provides clear information about government schemes. Please select an option to begin.",
        'menu_button_1': "Check Status",
        'menu_button_2': "FAQ",
        'menu_button_3': "Help and Support",
        'check_status_msg': "To check your status, please visit the official Aadhaar website:\nhttps://tathya.uidai.gov.in/access/login?role=resident",
        'support_msg': "For help and support, please visit the official UIDAI FAQ page:\nhttps://uidai.gov.in/en/contact-support/have-any-question/308-english-uk/faqs/direct-benefit-transfer-dbt.html",
        'invalid_input': "Invalid input. Please send 'Hi' to see the main menu.",
        'continue_prompt': "Would you like to ask another question?",
        'continue_button': "Continue Asking",
        'exit_button': "Exit to Main Menu"
    },
    'hi': {
        'menu_body': "डीबीटी दोस्त हेल्पडेस्क में आपका स्वागत है। यह सेवा सरकारी योजनाओं के बारे में स्पष्ट और सरल जानकारी प्रदान करने के लिए बनाई गई है। कृपया आरंभ करने के लिए एक विकल्प चुनें।",
        'menu_button_1': "स्थिति जांचें",
        'menu_button_2': "FAQ",
        'menu_button_3': "सहायता और समर्थन",
        'check_status_msg': "अपनी स्थिति की जांच करने के लिए, कृपया आधिकारिक आधार वेबसाइट पर जाएं:\nhttps://tathya.uidai.gov.in/access/login?role=resident",
        'support_msg': "सहायता और समर्थन के लिए, कृपया आधिकारिक यूआईडीएआई FAQ पृष्ठ पर जाएं:\nhttps://uidai.gov.in/en/contact-support/have-any-question/308-english-uk/faqs/direct-benefit-transfer-dbt.html",
        'invalid_input': "अमान्य इनपुट। कृपया मुख्य मेनू देखने के लिए 'Hi' भेजें।",
        'continue_prompt': "क्या आप एक और प्रश्न पूछना चाहेंगे?",
        'continue_button': "प्रश्न पूछें",
        'exit_button': "मुख्य मेनू पर जाएं"
    }
}

# --- FAQ Data with Built-in Answers ---
FAQ_DATA = {
    "dbt": {
        "title": "DBT Guidelines",
        "questions": [
            {
                "question": "What is Direct Benefit Transfer?",
                "answer": "Direct Benefit Transfer (DBT) is a major reform initiative launched by Government of India on 1 January 2013 to transfer benefits directly into the bank/postal accounts of beneficiaries. It aims to eliminate middlemen, reduce leakages, and ensure better delivery of government subsidies and welfare payments using modern Information and Communication Technology (ICT)."
            },
            {
                "question": "How does DBT work?",
                "answer": "DBT works by digitizing beneficiary databases and making payments directly to bank accounts through electronic transfer. For cash benefits, funds flow from Central Government to State Treasury via PFMS (Public Financial Management System) and then to individual beneficiary accounts. For in-kind benefits, distribution happens through PoS devices with authentication."
            },
            {
                "question": "What are the transaction charges for DBT?",
                "answer": "As per Government Order dated 26.02.2016:\n\n• Transaction charges: Rs. 0.50/- per transaction shared between sponsor banks, destination entities and NPCI\n• Cash out incentives: For MGNREGA, Maternity Benefits and Pension Schemes - Rs. 5/- fixed + Rs. 0.50/- per Rs. 100 (maximum Rs. 5/-) to promote last mile delivery"
            },
            {
                "question": "How many schemes are under DBT?",
                "answer": "As of April 2016, 66 schemes of 15 Ministries/Departments are reported to be on DBT. DBT is being implemented across the country, delivering benefits to more than 30 crore beneficiaries with over 100 crore DBT transactions completed."
            },
            {
                "question": "Is Aadhaar mandatory for DBT?",
                "answer": "At present, Aadhaar is not mandatory for availing DBT in any welfare schemes. DBT can be undertaken by digitizing beneficiary database and making payments directly to bank accounts. However, Aadhaar seeding in beneficiary database and bank accounts is highly desirable to achieve DBT objectives effectively and prevent leakages."
            },
            {
                "question": "What is Aadhaar seeding?",
                "answer": "Aadhaar seeding is done by updating Aadhaar number in the beneficiary database and linking the Aadhaar number with the bank account of the beneficiary in the Core Banking System (CBS). This helps in de-duplication, curbing leakages, and provides faster channels for welfare payments without middlemen."
            }
        ]
    },
    "nsp": {
        "title": "NSP Scholarship",
        "questions": [
            {
                "question": "What is the National Scholarship Portal?",
                "answer": "National Scholarship Portal (NSP) is a one-stop IT solution launched on 1st July 2015 under 'Digital India'. It facilitates various services from student application, receipt, verification, processing, and disbursal of scholarships to students directly into their accounts through Direct Benefit Transfer (DBT). NSP is a Mission Mode Project providing a SMART system - Simplified, Mission-oriented, Accountable, Responsive and Transparent."
            },
            {
                "question": "How do I apply for a scholarship on NSP?",
                "answer": "To apply on NSP:\n\n1. Fresh Students: Register at https://scholarships.gov.in/ using 'New Registration'\n2. Provide accurate information as per documents\n3. Keep Aadhaar number, bank details, educational documents ready\n4. Submit application and get unique Application ID via SMS\n5. Login and change password on first login\n6. Submit documents to your Institute after online submission\n\nRenewal Students: Use previous year's Application ID and update marks obtained."
            },
            {
                "question": "What is the workflow for NSP?",
                "answer": "NSP follows a 7-step workflow:\n\n1. Student Registration and Application Submission\n2. Level 1 Verification at Institute Level\n3. Level 2/3 Verification at District/State/Ministry Level\n4. Beneficiary Records Creation and Account Validation by PFMS\n5. Applications Deduplication and Merit List Generation\n6. Payment File Generation and Financial Approval\n7. Scholarship Disbursement through DBT"
            },
            {
                "question": "Who are the users of NSP?",
                "answer": "Primary users of NSP include:\n\n• Students/Applicants (Fresh and Renewal)\n• Institute Nodal Officers\n• District/State/Ministry Nodal Officers\n• Scheme owner Ministries/Departments\n• Ministry of Electronics & Information Technology (MeitY)\n• Direct Benefit Transfer (DBT) Mission\n• National Informatics Center (NIC)\n• Help Desk support"
            },
            {
                "question": "What are the steps for scholarship disbursement?",
                "answer": "Scholarship disbursement steps:\n\n1. Applications verified at Institute and State/District levels\n2. Beneficiary records created and account validation by PFMS\n3. Deduplication process and merit list generation\n4. Payment file generation and financial approval\n5. Final disbursement through DBT directly to student's bank account\n\nNote: Priority is given to Aadhaar seeded bank accounts for disbursement."
            },
            {
                "question": "What documents are required for NSP application?",
                "answer": "Required documents for NSP:\n\n• Educational documents (certificates, mark sheets)\n• Aadhaar number (mandatory if available)\n• Bank passbook with photograph (PDF/JPEG, max 200KB)\n• Enrolment ID (if Aadhaar not available)\n• Bonafide student certificate from Institute\n• Category certificates (if applicable)\n• Income certificate\n• Any scheme-specific documents as per eligibility criteria"
            }
        ]
    },
    "aadhaar": {
        "title": "Aadhaar Steps",
        "questions": [
            {
                "question": "How do I link my Aadhaar to my bank account?",
                "answer": "To link Aadhaar to your bank account:\n\n1. Visit your bank branch where you have the account\n2. Request bank officials to link your Aadhaar with your account\n3. Fill up the mandate and consent form of the bank\n4. Bank will verify your details and documents\n5. Bank officials will link Aadhaar number to your account in CBS\n6. Bank will also update NPCI mapper\n7. Once completed, your account becomes DBT enabled"
            },
            {
                "question": "How can I check my bank seeding status?",
                "answer": "You can check your bank seeding status from:\n\n• Official website: https://myaadhaar.uidai.gov.in/\n• NPCI website: https://base.npci.org.in/catalog/seedingRequestDetails\n\nNote: Information is fetched from National Payment Corporation of India (NPCI) server. UIDAI is not responsible for its correctness and does not store this information."
            },
            {
                "question": "What is the process for Aadhaar seeding?",
                "answer": "Aadhaar seeding process:\n\n1. Customer visits bank branch and submits duly filled consent form\n2. Bank officials verify details, documents and customer authenticity\n3. Bank accepts consent form and provides acknowledgement\n4. Branch links Aadhaar number to customer's account and NPCI mapper\n5. Once completed, Aadhaar number reflects in NPCI mapper\n6. Account becomes ready for DBT transactions\n\nCustomer can link only one account with Aadhaar at any point of time."
            },
            {
                "question": "What do I do if my Aadhaar status is inactive?",
                "answer": "If your Aadhaar status is inactive:\n\n1. Visit your respective bank branch in person\n2. Submit duly filled customer consent form\n3. Bank will reactivate your Aadhaar seeding status\n4. For pending subsidies, approach Oil Marketing Companies (OMCs)\n5. Contact OMCs through toll free number: 1800 2333 555\n6. OMCs will reinitiate failed transactions to your seeded bank account"
            },
            {
                "question": "Who do I contact for grievance redressal?",
                "answer": "For Aadhaar seeding grievances:\n\n1. First approach your bank's customer service cell\n2. Follow bank's escalation matrix if issue not resolved\n3. If Aadhaar not reflecting in NPCI mapper after submitting documents, contact bank only\n4. For NPCI related issues: Write to npci.dbtl@npci.org.in with Aadhaar consent acknowledgment copy from bank\n5. NPCI will coordinate with concerned bank teams for resolution"
            },
            {
                "question": "How do I receive benefits in my bank account?",
                "answer": "To receive DBT benefits in your bank account:\n\n1. Visit the bank branch where you have opened the account\n2. Request bank to link your Aadhaar with your account\n3. Fill up the mandate and consent form of the bank\n4. This account will be seeded with NPCI-mapper by the bank\n5. Account becomes DBT enabled for receiving government benefits\n6. All eligible scheme benefits will be directly transferred to this account\n\nEnsure your account remains active and functional to receive payments."
            }
        ]
    }
}

# --- Helper Functions ---
def get_hardcoded_answer(category: str, question_index: int) -> str:
    """Get hardcoded answer for a specific question"""
    try:
        return FAQ_DATA[category]["questions"][question_index]["answer"]
    except (KeyError, IndexError):
        return "Sorry, I couldn't find the answer to that question. Please contact support for assistance."

def send_whatsapp_message(recipient_id: str, data: Dict[str, Any]):
    """Send message to WhatsApp user"""
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}", 
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp", 
        "to": recipient_id, 
        **data
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Message sent successfully to {recipient_id}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending message to {recipient_id}: {e}")

def send_text_message(recipient_id: str, message_text: str):
    """Send simple text message"""
    data = {"text": {"body": message_text}}
    send_whatsapp_message(recipient_id, data)

def send_language_selection(recipient_id: str):
    """Send language selection menu"""
    data = {
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {"type": "image", "image": {"link": LOGO_IMAGE_URL}},
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
    """Send main menu options"""
    msg = MESSAGES.get(lang, MESSAGES['en'])
    data = {
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {"type": "image", "image": {"link": LOGO_IMAGE_URL}},
            "body": {"text": msg['menu_body']},
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": "menu_check_status", "title": msg['menu_button_1']}},
                    {"type": "reply", "reply": {"id": "menu_faq", "title": msg['menu_button_2']}},
                    {"type": "reply", "reply": {"id": "menu_help_support", "title": msg['menu_button_3']}}
                ]
            }
        }
    }
    send_whatsapp_message(recipient_id, data)

def send_continue_menu(recipient_id: str, lang: str):
    """Send continue or exit menu after answering question"""
    msg = MESSAGES.get(lang, MESSAGES['en'])
    data = {
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {"text": msg['continue_prompt']},
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": "continue_faq", "title": msg['continue_button']}},
                    {"type": "reply", "reply": {"id": "exit_faq", "title": msg['exit_button']}}
                ]
            }
        }
    }
    send_whatsapp_message(recipient_id, data)

def send_faq_category_menu(recipient_id: str):
    """Send FAQ category selection menu"""
    rows = []
    for key, value in FAQ_DATA.items():
        rows.append({
            "id": f"faq_cat_{key}", 
            "title": value["title"],
            "description": f"{len(value['questions'])} questions"
        })
    
    data = {
        "type": "interactive",
        "interactive": {
            "type": "list",
            "body": {"text": "Please select a topic:"},
            "action": {
                "button": "Select Topic",
                "sections": [{"title": "Available Topics", "rows": rows}]
            }
        }
    }
    send_whatsapp_message(recipient_id, data)

def send_faq_question_menu(recipient_id: str, category: str):
    """Send FAQ question selection menu for a specific category"""
    category_data = FAQ_DATA.get(category)
    if not category_data:
        send_text_message(recipient_id, "Sorry, I couldn't find that category.")
        return
    
    rows = []
    for i, item in enumerate(category_data["questions"]):
        question = item["question"]
        # Create shorter title for the list
        short_title = question[:24] if len(question) > 24 else question
        rows.append({
            "id": f"faq_q_{category}_{i}", 
            "title": short_title,
            "description": ""  # Remove description to avoid duplication
        })
    
    # Add option to go back to categories
    rows.append({
        "id": "back_to_categories",
        "title": "← Back to Categories",
        "description": "Return to topic selection"
    })
    
    data = {
        "type": "interactive",
        "interactive": {
            "type": "list",
            "body": {"text": f"Please select a question from {category_data['title']}:"},
            "action": {
                "button": "Select Question",
                "sections": [{"title": category_data["title"], "rows": rows}]
            }
        }
    }
    send_whatsapp_message(recipient_id, data)

# --- Webhook Endpoints ---
@app.get("/webhook")
async def webhook_verify(request: Request):
    """Verify webhook for WhatsApp"""
    mode = request.query_params.get('hub.mode')
    token = request.query_params.get('hub.verify_token')
    challenge = request.query_params.get('hub.challenge')
    
    if mode == 'subscribe' and token == VERIFY_TOKEN:
        print("Webhook verified successfully!")
        return PlainTextResponse(challenge, status_code=200)
    
    print("Webhook verification failed!")
    return PlainTextResponse("Failed validation.", status_code=403)

@app.post("/webhook")
async def webhook_handler(request: Request):
    """Handle incoming WhatsApp messages"""
    data = await request.json()
    
    try:
        # Check if we have a message
        if "messages" not in data["entry"][0]["changes"][0]["value"]:
            return PlainTextResponse("OK", status_code=200)
        
        message_data = data["entry"][0]["changes"][0]["value"]["messages"][0]
        sender_id = message_data["from"]
        
        # Get or initialize user session
        user_session = conversation_state.get(sender_id, {})
        lang = user_session.get('lang', 'en')
        
        print(f"Processing message from {sender_id}: {message_data.get('type')}")

        # Handle interactive messages (buttons and lists)
        if message_data.get("type") == "interactive":
            interaction_type = message_data["interactive"]["type"]

            if interaction_type == "button_reply":
                button_id = message_data["interactive"]["button_reply"]["id"]
                print(f"Button clicked: {button_id}")

                if button_id.startswith("lang_"):
                    # Language selection
                    chosen_lang = button_id.split("_")[1]
                    conversation_state[sender_id] = {'lang': chosen_lang, 'state': 'menu'}
                    send_main_menu(sender_id, chosen_lang)
                
                elif button_id == "menu_check_status":
                    send_text_message(sender_id, MESSAGES[lang]['check_status_msg'])
                
                elif button_id == "menu_faq":
                    conversation_state[sender_id]['state'] = 'awaiting_faq_category'
                    send_faq_category_menu(sender_id)

                elif button_id == "menu_help_support":
                    send_text_message(sender_id, MESSAGES[lang]['support_msg'])
                
                elif button_id == "continue_faq":
                    conversation_state[sender_id]['state'] = 'awaiting_faq_category'
                    send_faq_category_menu(sender_id)
                
                elif button_id == "exit_faq":
                    conversation_state[sender_id]['state'] = 'menu'
                    send_main_menu(sender_id, lang)

            elif interaction_type == "list_reply":
                list_reply_id = message_data["interactive"]["list_reply"]["id"]
                print(f"List item selected: {list_reply_id}")

                if list_reply_id.startswith("faq_cat_"):
                    # FAQ category selected
                    category_key = list_reply_id.replace("faq_cat_", "")
                    conversation_state[sender_id]['state'] = 'awaiting_faq_question'
                    conversation_state[sender_id]['current_category'] = category_key
                    send_faq_question_menu(sender_id, category_key)
                
                elif list_reply_id == "back_to_categories":
                    # Back to categories
                    conversation_state[sender_id]['state'] = 'awaiting_faq_category'
                    send_faq_category_menu(sender_id)
                
                elif list_reply_id.startswith("faq_q_"):
                    # FAQ question selected
                    try:
                        parts = list_reply_id.split("_")
                        category = parts[2]
                        q_index = int(parts[3])
                        
                        # Get hardcoded answer
                        answer = get_hardcoded_answer(category, q_index)
                        print(f"Sending hardcoded answer for {category} question {q_index}")
                        
                        # Send the answer
                        send_text_message(sender_id, answer)
                        
                        # Ask if they want to continue
                        conversation_state[sender_id]['state'] = 'awaiting_continue_or_exit'
                        send_continue_menu(sender_id, lang)
                        
                    except (IndexError, ValueError, KeyError) as e:
                        print(f"Error processing FAQ question: {e}")
                        send_text_message(sender_id, "Sorry, I couldn't find the answer to that question.")

        # Handle text messages
        elif message_data.get("type") == "text":
            message_body = message_data["text"]["body"].strip().lower()
            print(f"Text message received: {message_body}")
            
            # Check for greeting or menu commands
            if message_body in ['hi', 'hello', 'menu', 'start', 'नमस्ते', 'मेनू']:
                if 'lang' in user_session:
                    send_main_menu(sender_id, user_session['lang'])
                else:
                    send_language_selection(sender_id)
            else:
                # For any other text, show invalid input message
                send_text_message(sender_id, MESSAGES[lang]['invalid_input'])

    except (KeyError, IndexError, TypeError) as e:
        print(f"Error processing webhook data: {e}")
        pass
    except Exception as e:
        print(f"Unexpected error in webhook handler: {e}")
        pass
    
    return PlainTextResponse("OK", status_code=200)

# --- Health Check Endpoint ---
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "simple-whatsapp-bot"}

if __name__ == "__main__":
    import uvicorn
    print("Starting Simple WhatsApp Bot...")
    uvicorn.run(app, host="0.0.0.0", port=8001)