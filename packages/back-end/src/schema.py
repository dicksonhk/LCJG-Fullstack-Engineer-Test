import graphene
from graphene import relay
from graphene import ObjectType, Schema
from graphene_sqlalchemy import SQLAlchemyObjectType
# from graphene_sqlalchemy import SQLAlchemyConnectionField

from .models import CustomerModel


class Customer(SQLAlchemyObjectType):
    class Meta:
        model = CustomerModel
        interfaces = (relay.Node,)


class Query(ObjectType):
    node = relay.Node.Field()

    # # Allows sorting over multiple columns, by default over the primary key
    # customers = SQLAlchemyConnectionField(
    #     Customer.connection,
    # )

    customers = graphene.Field(
        graphene.List(Customer),
        customerNumber=graphene.Int(),
        customerName=graphene.String(),
        contactLastName=graphene.String(),
        contactFirstName=graphene.String(),
        orderByCreditLimitAsc=graphene.Boolean(),
        orderByCreditLimitDesc=graphene.Boolean(),
        limit=graphene.Int(),
        skip=graphene.Int(),
    )

    def resolve_customers(parent, info, **kwargs):
        from sqlalchemy.orm import Query
        from sqlalchemy import or_, and_

        query: Query[Customer] = Customer.get_query(info)
        _limit_min = 0
        _limit_max = 50
        _limit_default = 10
        _skip_min = 0
        _or = []
        _and = []
        _filters = {
            "customerNumber": CustomerModel.customerNumber
            == kwargs.get("customerNumber"),
            "customerName": CustomerModel.customerName.ilike(
                "%{}%".format(kwargs.get("customerName"))
            ),
            "contactLastName": CustomerModel.contactLastName.ilike(
                "%{}%".format(kwargs.get("contactLastName"))
            ),
            "contactFirstName": CustomerModel.contactFirstName.ilike(
                "%{}%".format(kwargs.get("contactFirstName"))
            ),
        }

        # build the query

        # likes
        for key in _filters:
            if (kwargs.get(key) is not None) and (_filters.get(key) is not None):
                _and.append(_filters.get(key))

        query = query.filter(*_and)

        # order by
        if bool(kwargs.get("orderByCreditLimitAsc")) and not bool(
            kwargs.get("orderByCreditLimitDesc")
        ):
                query = query.order_by(CustomerModel.creditLimit.asc())
        elif bool(kwargs.get("orderByCreditLimitDesc")) and not bool(
            kwargs.get("orderByCreditLimitAsc")
        ):
            query = query.order_by(CustomerModel.creditLimit.desc())

        # limit
        if isinstance(kwargs.get("limit"), int):
            query = query.limit(max(_limit_min, min(_limit_max, kwargs.get("limit"))))
        else:
            query = query.limit(_limit_default)

        # skip
        if isinstance(kwargs.get("skip"), int):
            query = query.offset(max(_skip_min, kwargs.get("skip")))

        return query


types = [
    Customer,
]

schema = Schema(query=Query, types=types)
