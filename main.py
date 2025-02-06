from sqlmodel import Field, Session, SQLModel, select
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import auth, images, interactions, rankings
from backend.routers import user

from backend.database import *


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    elo: int = 1000


app = FastAPI()

origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rankings.router, prefix="/rankings", tags=["rankings"])
app.include_router(images.router, prefix="/images", tags=["images"])
app.include_router(interactions.router, prefix="/interactions", tags=["interactions"])
app.include_router(user.router)
app.include_router(auth.router, prefix="/auth")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "Hello World"}


# Create an Item
@app.post("/items/")
def create_item(item: Item):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
        return item


@app.get("/items/")
def read_items():
    with Session(engine) as session:
        items = session.exec(select(Item)).all()
        return items


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
