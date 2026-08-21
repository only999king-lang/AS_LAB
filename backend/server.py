from dotenv import load_dotenv
load_dotenv()

import os
import logging
import uuid
import bcrypt
import jwt
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    price: float
    image: str
    description: str = ""
    badge: str = ""
    in_stock: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    image: str
    description: str = ""
    badge: str = ""
    in_stock: bool = True
    
class Enquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    message: str
    interest: str = "General"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EnquiryCreate(BaseModel):
    name: str
    phone: str
    message: str
    interest: str = "General"

class LoginRequest(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": datetime.now(timezone.utc) + timedelta(hours=12), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(request: Request, creds: HTTPAuthorizationCredentials = Depends(security)):
    token = request.cookies.get("access_token")
    if not token and creds:
        token = creds.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"email": payload["email"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/login")
async def login(body: LoginRequest, request: Request):
    email = body.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_at = datetime.fromisoformat(attempts["locked_at"]) if attempts.get("locked_at") else None
        if locked_at and (datetime.now(timezone.utc) - locked_at) < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(str(user["_id"]), email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": "admin"}}

@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin

@api_router.get("/products", response_model=List[Product])
async def list_products():
    return await db.products.find({}, {"_id": 0}).to_list(500)

@api_router.post("/products", response_model=Product)
async def create_product(body: ProductCreate, admin=Depends(get_current_admin)):
    product = Product(**body.model_dump())
    await db.products.insert_one(product.model_dump())
    return product
    
@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, body: ProductCreate, admin=Depends(get_current_admin)):
    result = await db.products.update_one({"id": product_id}, {"$set": body.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return await db.products.find_one({"id": product_id}, {"_id": 0})

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin=Depends(get_current_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"deleted": True}

@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(body: EnquiryCreate):
    enquiry = Enquiry(**body.model_dump())
    await db.enquiries.insert_one(enquiry.model_dump())
    return enquiry

@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries(admin=Depends(get_current_admin)):
    return await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api_router.delete("/enquiries/{enquiry_id}")
async def delete_enquiry(enquiry_id: str, admin=Depends(get_current_admin)):
    await db.enquiries.delete_one({"id": enquiry_id})
    return {"deleted": True}

@api_router.get("/")
async def root():
    return {"message": "AS LABS API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

SEED_PRODUCTS = [
    {"name": "Carbon Shield Case", "category": "Covers", "price": 499, "badge": "Best Seller",
     "image": "https://images.pexels.com/photos/19784109/pexels-photo-19784109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "description": "Military-grade drop protection with matte carbon texture. Available for all major models."},
    {"name": "ClearView Silicone Cover", "category": "Covers", "price": 299, "badge": "",
     "image": "https://images.pexels.com/photos/1670768/pexels-photo-1670768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "description": "Crystal-clear anti-yellowing silicone that shows off your phone's original finish."},
    {"name": "9H Tempered Glass", "category": "Glass", "price": 199, "badge": "Popular",
     "image": "https://images.pexels.com/photos/6755092/pexels-photo-6755092.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "description": "Edge-to-edge 9H hardness tempered glass with oleophobic coating. Fitted free in-store."},
    {"name": "Privacy Glass Guard", "category": "Glass", "price": 399, "badge": "",
     "image": "https://images.pexels.com/photos/6755056/pexels-photo-6755056.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "description": "Anti-spy privacy filter glass — screen visible only to you. Bubble-free install."},
    {"name": "OLED Display Assembly", "category": "Displays", "price": 3499, "badge": "OEM Grade",
     "image": "https://images.unsplash.com/photo-1746005514011-ea00280f3b6e?crop=entropy&cs=srgb&fm=jpg&q=85&w=940",
     "description": "Original-grade OLED display replacement with true blacks and 120Hz touch response."},
    {"name": "Matte Back Panel", "category": "Back Panels", "price": 899, "badge": "",
     "image": "https://images.unsplash.com/photo-1639776738932-956082f0b704?crop=entropy&cs=srgb&fm=jpg&q=85&w=940",
     "description": "Factory-fit replacement back panels. Restores that fresh-out-of-box feel."},
    {"name": "PulseBuds Pro ANC", "category": "Earbuds", "price": 1499, "badge": "New",
     "image": "https://images.pexels.com/photos/10958687/pexels-photo-10958687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "description": "True wireless earbuds with active noise cancellation and 36-hour battery life."},
    {"name": "StudioMax Headphones", "category": "Headphones", "price": 2499, "badge": "",
     "image": "https://images.pexels.com/photos/18542243/pexels-photo-18542243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "description": "Over-ear studio headphones with deep bass drivers and memory-foam cushions."},
    {"name": "ThunderBeat Speaker", "category": "Speakers", "price": 1999, "badge": "Loud",
     "image": "https://images.pexels.com/photos/18542243/pexels-photo-18542243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "description": "Rugged Bluetooth speaker, IPX7 waterproof, 20W output with punchy bass radiators."},
]

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email, "password_hash": hash_password(admin_password),
            "name": "Aslam Sk", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
    if await db.products.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.products.insert_many([
            {"id": str(uuid.uuid4()), "in_stock": True, "created_at": now, **p} for p in SEED_PRODUCTS
        ])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()