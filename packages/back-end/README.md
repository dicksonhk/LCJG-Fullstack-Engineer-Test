# Packages
```shell
pip install fastapi uvicorn[standard] graphene SQLAlchemy graphene-sqlalchemy PyMySQL

```

# Useful commands

- start app
```shell
uvicorn src:app --host 0.0.0.0 --port 8080 --reload
```

- list containers
```shell
docker container ls
```

- exec sql
```shell
docker exec -i back-end_db_1 mysql -uroot -p"for-root-test-only" < ../../database/mysqlsampledatabase.sql
```

- remove volume
```shell
docker-compose down -v
```

## Debugging

```shell
docker-compose -f "docker-compose.debug.yml" up -d --build
```