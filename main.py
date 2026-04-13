from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
import json
import io
import os

app = FastAPI()

# ✅ Fix CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODEL ----------------
num_classes = 80

model = models.mobilenet_v2(weights=None)
model.classifier[1] = nn.Linear(model.last_channel, num_classes)



MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_model_finetuned.pth")
state = torch.load(MODEL_PATH, map_location="cpu")

model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
model.eval()

# ⚠️ ADD YOUR CLASS NAMES HERE
class_names = ['adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_shimla_mirch', 'aloo_tikki', 'anarsa', 'ariselu', 'bandar_laddu', 'basundi', 'bhatura', 'bhindi_masala', 'biryani', 'boondi', 'butter_chicken', 'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri', 'chicken_razala', 'chicken_tikka', 'chicken_tikka_masala', 'chikki', 'daal_baati_churma', 'daal_puri', 'dal_makhani', 'dal_tadka', 'dharwad_pedha', 'doodhpak', 'double_ka_meetha', 'dum_aloo', 'gajar_ka_halwa', 'gavvalu', 'ghevar', 'gulab_jamun', 'imarti', 'jalebi', 'kachori', 'kadai_paneer', 'kadhi_pakoda', 'kajjikaya', 'kakinada_khaja', 'kalakand', 'karela_bharta', 'kofta', 'kuzhi_paniyaram', 'lassi', 'ledikeni', 'litti_chokha', 'lyangcha', 'maach_jhol', 'makki_di_roti_sarson_da_saag', 'malapua', 'misi_roti', 'misti_doi', 'modak', 'mysore_pak', 'naan', 'navrattan_korma', 'palak_paneer', 'paneer_butter_masala', 'phirni', 'pithe', 'poha', 'poornalu', 'pootharekulu', 'qubani_ka_meetha', 'rabri', 'ras_malai', 'rasgulla', 'sandesh', 'shankarpali', 'sheer_korma', 'sheera', 'shrikhand', 'sohan_halwa', 'sohan_papdi', 'sutar_feni', 'unni_appam']


# ---------------- NUTRITION ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
NUTRITION_PATH = os.path.join(BASE_DIR, "nutrition_map.json")

with open(NUTRITION_PATH, "r") as f:
    nutrition_map = json.load(f)

def get_nutrition(food):
    return nutrition_map.get(food, None)

# ---------------- TRANSFORM ----------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ---------------- API ----------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    image_bytes = await file.read()

    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except:
        return {"error": "Invalid image file"}

    # Predict
    img_tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = F.softmax(outputs, dim=1)
        confidence, pred = torch.max(probs, 1)

    pred_idx = pred.item()
    food = class_names[pred_idx] if pred_idx < len(class_names) else "unknown"
    conf = confidence.item()

    nutrition = get_nutrition(food)

    return {
    "food": food,
    "confidence": round(conf, 4),
    "nutrition": nutrition if nutrition else "Not available"
}

@app.get("/")
def home():
    return {"status": "Food API running 🚀"}