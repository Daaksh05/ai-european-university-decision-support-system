import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

# Default to SQLite for development - using absolute path to ensure consistency
base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "university_system.db")
DEFAULT_DATABASE_URL = f"sqlite:///{db_path}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)


# SQLite-specific configuration for thread safety
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
