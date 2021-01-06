sudo docker run -d --rm --name chat-db \
    -e POSTGRES_PASSWORD=$(grep 'DB_PASSWORD' .env | sed -r '1,$ s/.*=//g') \
    -e POSTGRES_USER=$(grep 'DB_USER' .env | sed -r '1,$ s/.*=//g') \
    -e POSTGRES_DB=$(grep 'DB_NAME' .env | sed -r '1,$ s/.*=//g') \
    -p 5432:5432 \
    -v chat-db-volume:/var/lib/postgresql/data \
    postgres:13.1