# Use an OpenJDK base image
FROM openjdk:21-jdk-slim

# Copy the Spring Boot JAR file into the container
COPY target/homemovies-0.0.1-SNAPSHOT.jar /app/homemovies-0.0.1-SNAPSHOT.jar

# Expose port 8080
EXPOSE 8080

# Command to run the Spring Boot application
CMD ["java", "-jar", "/app/homemovies-0.0.1-SNAPSHOT.jar"]