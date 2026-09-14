#!/bin/sh
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE lexi_english;
EOSQL
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "lexi_english" <<-EOSQL
    CREATE USER lexi_user WITH PASSWORD 'lexi_user';
    GRANT ALL PRIVILEGES ON DATABASE lexi_english TO lexi_user;
    GRANT ALL PRIVILEGES ON SCHEMA public TO lexi_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lexi_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lexi_user;
EOSQL
