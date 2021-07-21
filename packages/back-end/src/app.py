import graphene
from fastapi import FastAPI
from starlette.graphql import GraphQLApp

from .schema import schema
from .database import db_session

app = FastAPI()


@app.get("/")
def index():
    return {"Hello": "World"}


app.add_route("/graphql", GraphQLApp(schema))

@app.on_event("shutdown")
def shutdown_event():
    db_session.remove()
