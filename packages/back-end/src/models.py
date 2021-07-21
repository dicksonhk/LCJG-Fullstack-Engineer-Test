from sqlalchemy.ext.automap import automap_base

from .database import Base

CustomerModel = Base.classes.customers
