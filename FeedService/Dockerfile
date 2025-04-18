# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file into the container
COPY target/feed-service-0.0.1-SNAPSHOT.jar /app/feed-service.jar

# Expose the port that the application will run on
EXPOSE 8095

# Define the command to run your application
CMD ["java", "-jar", "/app/feed-service.jar"]