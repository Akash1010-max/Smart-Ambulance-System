# ====================================================
# Production JRE Runtime Stage
# ====================================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Run as a dedicated non-root user
RUN groupadd -r spring && useradd -r -g spring spring

# Copy pre-packaged Spring Boot executable JAR
ARG JAR_FILE=target/demo-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Set permissions
RUN chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
