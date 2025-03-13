
# Home Videos Overview
In 2024 my mom had all of our old family videos digitized. These were delivered to her over an FTP share and she was completely lost on how to even get them.
I created this site as a way for my family to more easily view and chat about these memories.

Originally I created this site using Angular and recently swapped over to Nextjs for a learning opportunity.
The video files themselves are stored in S3 and served with the help of Cloudfront. These are accessed by URLs stored in Postgres and streamed to the user. 
Login and sessions are secured using bcrypt and JWTs which are blacklisted upon logout, expiration, or account deletion in Redis.
The site is hosted in a Digital Ocean droplet as a subdomain of smbirch.com. I use NGINX to assist with proxying and some caching. 


This document outlines the deployment process for HomeVideos, a multi-container application hosted on a Digital Ocean droplet.

## System Architecture

The application consists of four main components:

1. **PostgreSQL Database**: Stores user data, comments, and video metadata
2. **Redis**: Used for blacklisting JWTs for authenticated user sessions
3. **Spring Backend**
4. **Next.js Frontend**
5. **Amazon S3**: Stores raw videos and thumbnails
6. **Cloudfront**: CDN

All components are containerized using Docker and orchestrated with Docker Compose on a Digital Ocean droplet.

## Prerequisites

Before deployment, ensure you have:

- A Digital Ocean droplet with adequate resources (recommended: 2 GB RAM minimum)
- Docker and Docker Compose installed on the droplet
- Domain name configured to point to your droplet's IP address
- Basic knowledge of Linux server administration
- SSH access to the droplet

## Deployment Steps

### 1. Initial Server Setup

Connect to your Digital Ocean droplet via SSH:

```bash
ssh root@your_droplet_ip
```

Update the system and install Docker and Docker Compose if not already installed:

```bash
apt update && apt upgrade -y
apt install docker.io docker-compose git -y
```

### 2. Application Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/homevideos.git
cd homevideos
```

### 3. Environment Configuration

The Docker Compose file contains environment variables for database credentials and API URLs. Review and modify as needed:

- Database credentials: `POSTGRES_USER`, `POSTGRES_PASSWORD`
- Backend database connection: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- API URLs: `NEXT_PUBLIC_API_URL`

**Note:** For production, consider using environment files instead of hardcoding credentials in the Docker Compose file.

### 4. Deploying the Application

Launch the application stack:

```bash
docker-compose up -d
```

This command will:

- Build the backend and frontend containers
- Pull the latest PostgreSQL and Redis images
- Create a Docker network and volume for data persistence
- Start all services in detached mode

### 5. Verifying Deployment

Check if all containers are running:

```bash
docker-compose ps
```

You should see all four containers (db, backend, frontend, redis) running without errors.

### 6. Setting Up Reverse Proxy (Nginx)

For proper HTTPS access, install and configure Nginx as a reverse proxy:

```bash
apt install nginx -y
```

Create a new Nginx configuration file:

```bash
nano /etc/nginx/sites-available/homevideos.conf
```

Add the following configuration (adjust as needed):

```nginx
server {
    listen 80;
    server_name homevideos.smbirch.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site and restart Nginx:

```bash
ln -s /etc/nginx/sites-available/homevideos.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 7. SSL Configuration with Let's Encrypt

Install Certbot for SSL certificates:

```bash
apt install certbot python3-certbot-nginx -y
```

Obtain and configure SSL certificates:

```bash
certbot --nginx -d homevideos.smbirch.com
```

Follow the prompts to complete the SSL configuration.

## Maintenance

### Updating the Application

To update the application:

1. Pull the latest changes:

    ```bash
    git pull
    ```

2. Rebuild and restart containers:

    ```bash
    docker-compose down
    docker-compose up -d --build
    ```


### Backup and Restore

Digital Ocean backs up the entire droplet once per day, but if you need more assurance:

#### Database Backup

```bash
docker exec homevideos_db pg_dump -U postgres homevideos_db > backup_$(date +%Y%m%d).sql
```

#### Database Restore

```bash
cat backup_file.sql | docker exec -i homevideos_db psql -U postgres homevideos_db
```

### Monitoring

Check container logs:

```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs backend
```

Monitor container resource usage:

```bash
docker stats
```


## License
[MIT](https://choosealicense.com/licenses/mit/)