import random
from io import BytesIO

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from sqlalchemy import desc
from sqlalchemy.orm import Session

from backend.database import get_session
from backend.models import Image
from backend.schemas import ImageChoice
from backend.auth.auth_handler import get_current_active_user
from backend.models import User  # if needed in upload

router = APIRouter()


#########################################
# 1. GET /images/image/{image_id}
#########################################
@router.get("/image/{image_id}")
async def get_image(image_id: int, db: Session = Depends(get_session)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    # Convert the binary image data into an in-memory stream
    image_stream = BytesIO(image.image_data)
    return StreamingResponse(image_stream, media_type="image/jpeg")


#########################################
# 2. GET /images/random-images/
#########################################
@router.get("/random-images/")
async def get_random_images(db: Session = Depends(get_session)):
    # Find the largest image id in the database
    max_id_obj = db.query(Image.id).order_by(desc(Image.id)).first()
    if not max_id_obj:
        raise HTTPException(status_code=404, detail="No images found in the database")
    max_id = max_id_obj[0]

    # Ensure we have at least 2 images by checking max_id
    if max_id < 2:
        raise HTTPException(status_code=404, detail="Not enough images in the database")

    # Generate two distinct random IDs between 1 and max_id (inclusive)
    left_id = random.randint(1, max_id)
    right_id = random.randint(1, max_id)
    while right_id == left_id:
        right_id = random.randint(1, max_id)

    # Query for the images with these IDs
    left_image = db.query(Image).filter(Image.id == left_id).first()
    right_image = db.query(Image).filter(Image.id == right_id).first()

    if not left_image or not right_image:
        raise HTTPException(status_code=404, detail="Could not find images with generated IDs")

    # Return metadata including URLs for each image (using the single image endpoint)
    return {
        "left_image": {
            "id": left_image.id,
            "title": left_image.title,
            "url": f"http://127.0.0.1:8000/images/image/{left_image.id}"
        },
        "right_image": {
            "id": right_image.id,
            "title": right_image.title,
            "url": f"http://127.0.0.1:8000/images/image/{right_image.id}"
        }
    }


#########################################
# 3. POST /images/upload-image/
#########################################
@router.post("/upload-image/")
async def upload_image(
        title: str = Form(...),
        file: UploadFile = File(...),
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user)
):
    # Read the file as binary data
    file_data = await file.read()
    # Create a new Image record; you might add additional processing (e.g., base64 decoding) if needed
    new_image = Image(
        title=title,
        image_data=file_data,
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return {"message": "Image uploaded successfully", "image_id": new_image.id}
