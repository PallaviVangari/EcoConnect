# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file into the container
COPY target/GatewayService-0.0.1-SNAPSHOT.jar /app/gateway-service.jar

# Expose the port that the Gateway runs on (usually 8080)
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "/app/gateway-service.jar"]
