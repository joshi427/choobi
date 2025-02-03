from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    elo: int = 1000


# Database setup
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


app = FastAPI()


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
