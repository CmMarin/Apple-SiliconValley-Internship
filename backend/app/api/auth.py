from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dummy user for demonstration purposes
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    }
}

def fake_hash_password(password: str):
    return "fakehashed" + password

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not user['hashed_password'] == fake_hash_password(form_data.password):
        return {"error": "Invalid credentials"}
    return {"access_token": user['username'], "token_type": "bearer"}

@router.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    user = fake_users_db.get(token)
    if user is None:
        return {"error": "Invalid token"}
    return user