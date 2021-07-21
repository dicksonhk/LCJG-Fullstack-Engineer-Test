from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.graphql import GraphQLApp

from .schema import schema
from .database import db_session

app = FastAPI()

origins = ".*"

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex = origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"Hello": "World"}


app.add_route("/graphql", GraphQLApp(schema))

@app.on_event("shutdown")
def shutdown_event():
    db_session.remove()
