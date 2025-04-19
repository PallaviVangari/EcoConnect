# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file into the container
COPY target/event-service-0.0.1-SNAPSHOT.jar /app/event-service.jar

# Expose the port that the application will run on
EXPOSE 8060

# Define the command to run your application
CMD ["java", "-jar", "/app/event-service.jar"]