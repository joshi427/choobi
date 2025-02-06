from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str | None = None

class UserInDB(UserResponse):
    hashed_password: str

class ImageChoice(BaseModel):
    title: str
    image_data: bytes

class InteractionRequest(BaseModel):
    left_image_id: int
    right_image_id: int
    chosen_image_id: int

class ImageRankingResponse(BaseModel):
    image_id: int
    title: str
    elo_score: float