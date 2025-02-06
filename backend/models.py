from sqlmodel import SQLModel, Field
from typing import Optional

# User model - stores user data and ELO score
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str

# Image model - stores image metadata and the actual image as binary data
class Image(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    image_data: bytes  # This will store the image as binary data (BLOB)

# UserImageInteraction model - stores user-specific ELO for each image
class UserImageInteraction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")  # Link to User
    image_id: int = Field(foreign_key="image.id")  # Link to Image
    elo_score: int = Field(default=1000)  # Default starting ELO score for each image

# Interaction model - stores user choices (left, right, or skip)
class Interaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    left_image_id: int = Field(foreign_key="image.id")
    right_image_id: int = Field(foreign_key="image.id")
    chosen_image_id: Optional[int] = None  # The image the user selected
    timestamp: str  # Timestamp of interaction (e.g., "2025-02-03T10:00:00")




