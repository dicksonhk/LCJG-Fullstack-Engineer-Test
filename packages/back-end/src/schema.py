import graphene
from graphene import relay
from graphene import ObjectType, Schema
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from .models import CustomerModel


class Customer(SQLAlchemyObjectType):
    class Meta:
        model = CustomerModel
        interfaces = (relay.Node,)


class Query(ObjectType):
    node = relay.Node.Field()

    # Allows sorting over multiple columns, by default over the primary key
    customers = SQLAlchemyConnectionField(
        Customer.connection,
    )


types = [
    Customer,
]

schema = Schema(query=Query, types=types)
