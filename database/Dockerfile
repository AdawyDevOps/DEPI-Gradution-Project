FROM postgres:15-alpine

# Set environment variables
ENV POSTGRES_DB=calorie_chronicle
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password

# Set timezone (optional)
ENV TZ=Africa/Cairo

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Health check (already in compose but good practice)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB

CMD ["postgres"]