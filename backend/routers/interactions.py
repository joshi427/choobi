from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import get_session
from backend.models import Image, UserImageInteraction, User
from backend.auth.auth_handler import get_current_active_user
from backend.schemas import InteractionRequest

router = APIRouter()

# Constants for ELO scoring
K_FACTOR = 32


def expected_score(elo_a: int, elo_b: int) -> float:
    """Calculate expected score for elo_a vs elo_b."""
    return 1 / (1 + 10 ** ((elo_b - elo_a) / 400))


def update_elo(winner_elo: int, loser_elo: int) -> (int, int):
    """Update ELO scores for winner and loser using a simple ELO formula."""
    expected_winner = expected_score(winner_elo, loser_elo)
    expected_loser = expected_score(loser_elo, winner_elo)
    new_winner_elo = winner_elo + K_FACTOR * (1 - expected_winner)
    new_loser_elo = loser_elo + K_FACTOR * (0 - expected_loser)
    return round(new_winner_elo), round(new_loser_elo)


@router.post("/interaction/")
async def record_interaction(
        interaction: InteractionRequest,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user)
):
    left_image_id = interaction.left_image_id
    right_image_id = interaction.right_image_id
    chosen_image_id = interaction.chosen_image_id

    # Retrieve the two images from the database
    left_image = db.query(Image).filter(Image.id == left_image_id).first()
    right_image = db.query(Image).filter(Image.id == right_image_id).first()

    if not left_image or not right_image:
        raise HTTPException(status_code=404, detail="One or both images not found")

    # Retrieve the user's current ELO scores for both images
    left_interaction = db.query(UserImageInteraction).filter(
        UserImageInteraction.user_id == current_user.id,
        UserImageInteraction.image_id == left_image_id
    ).first()
    right_interaction = db.query(UserImageInteraction).filter(
        UserImageInteraction.user_id == current_user.id,
        UserImageInteraction.image_id == right_image_id
    ).first()

    # If records do not exist, initialize them
    if not left_interaction:
        left_interaction = UserImageInteraction(
            user_id=current_user.id,
            image_id=left_image_id,
            elo_score=1000
        )
        db.add(left_interaction)
        db.commit()
        db.refresh(left_interaction)

    if not right_interaction:
        right_interaction = UserImageInteraction(
            user_id=current_user.id,
            image_id=right_image_id,
            elo_score=1000
        )
        db.add(right_interaction)
        db.commit()
        db.refresh(right_interaction)

    # Get current ELO scores
    left_elo = left_interaction.elo_score
    right_elo = right_interaction.elo_score

    # Determine winner and loser based on the user's choice
    if chosen_image_id == left_image_id:
        winner_interaction = left_interaction
        loser_interaction = right_interaction
    elif chosen_image_id == right_image_id:
        winner_interaction = right_interaction
        loser_interaction = left_interaction
    else:
        raise HTTPException(status_code=400, detail="Chosen image ID does not match any provided image")

    # Update ELO scores
    new_winner_elo, new_loser_elo = update_elo(winner_interaction.elo_score, loser_interaction.elo_score)
    winner_interaction.elo_score = new_winner_elo
    loser_interaction.elo_score = new_loser_elo

    # Record the interaction with a timestamp (for now, we use a fixed timestamp)
    interaction_timestamp = datetime.utcnow().isoformat() + "Z"
    db.commit()

    return {
        "message": "Interaction recorded and ELO scores updated successfully",
        "left_image_new_elo": left_interaction.elo_score,
        "right_image_new_elo": right_interaction.elo_score,
        "timestamp": interaction_timestamp
    }
