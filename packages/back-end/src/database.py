import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.automap import automap_base


db_user = os.environ["DB_USER"]
db_pass = os.environ["DB_PASS"]
db_host = os.environ["DB_HOST"]
db_name = os.environ["DB_NAME"]

engine = create_engine(
    f"mysql+pymysql://{db_user}:{db_pass}@{db_host}/{db_name}?charset=utf8mb4",
    pool_recycle=3600,
    pool_pre_ping=True,
)

db_session = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
)

Base = automap_base()
Base.prepare(engine, reflect=True)
Base.query = db_session.query_property()
