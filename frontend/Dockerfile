# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the built Angular app into the Nginx container
COPY /dist/frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
