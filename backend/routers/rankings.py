from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_session
from backend.models import UserImageInteraction, Image
from backend.auth.auth_handler import get_current_active_user
from backend.schemas import UserResponse

router = APIRouter()

@router.get("/", tags=["rankings"])
def get_user_rankings(
    current_user: UserResponse = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    """Fetch user-specific rankings based on their past interactions."""
    user_id = current_user.id  # Ensure user is authenticated

    # Fetch user's image interactions, sorted by elo_score descending
    interactions = (
        db.query(UserImageInteraction.image_id, UserImageInteraction.elo_score)
        .filter(UserImageInteraction.user_id == user_id)
        .order_by(UserImageInteraction.elo_score.desc())  # Sorting here
        .all()
    )

    # Fetch image titles from Image table
    rankings = []
    for image_id, elo in interactions:
        image = db.query(Image).filter(Image.id == image_id).first()
        if image:
            rankings.append({"title": image.title, "elo": elo})

    return rankings  # Now sorted by ELO descending
