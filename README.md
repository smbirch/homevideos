In 2024 my mom had all of our old VHS home movies digitized. They were delivered to her over FTP share and she had no idea how to download them, let alone watch them. 
I built this website so that my family could more easily watch and talk about the videos created in my youth.

https://homevideos.smbirch.com/


## System Architecture

The application consists of four main components:

1. **PostgreSQL Database**: Stores user data, comments, and video metadata
2. **Redis**: Used for blacklisting JWTs for authenticated user sessions
3. **Spring Backend**
4. **Next.js Frontend**
5. **Amazon S3**: Stores raw videos and thumbnails

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



# API Endpoints Documentation

## User Endpoints

### Base Path: `/api/auth`

| Method | Endpoint                 | Description                                        | Request Body                     | Response                          |
| ------ | ------------------------ | -------------------------------------------------- | -------------------------------- | --------------------------------- |
| GET    | `/api/auth`              | Get all users                                      | None                             | List of `UserResponseDto`         |
| GET    | `/api/auth/{username}`   | Get user by username                               | None                             | `UserResponseDto`                 |
| POST   | `/api/auth/register`     | Register a new user                                | `UserRequestDto`                 | `ResponseEntity<UserResponseDto>` |
| POST   | `/api/auth/login`        | Login existing user                                | `UserRequestDto`                 | `ResponseEntity<UserResponseDto>` |
| POST   | `/api/auth/validate`     | Validate user token                                | `UserRequestDto`                 | `ResponseEntity<AuthDto>`         |
| POST   | `/api/auth/logout`       | Logout user                                        | `UserRequestDto`                 | `ResponseEntity<AuthDto>`         |
| POST   | `/api/auth/releasetoken` | Release token (for refresh or manual blacklisting) | None (username as path variable) | `ResponseEntity<AuthDto>`         |

## Video Endpoints

### Base Path: `/api/video`

| Method | Endpoint                        | Description              | Request Body                     | Response                           |
| ------ | ------------------------------- | ------------------------ | -------------------------------- | ---------------------------------- |
| GET    | `/api/video/all`                | Get all videos           | None                             | List of `VideoResponseDto`         |
| GET    | `/api/video/{id}`               | Get video by ID          | None                             | `VideoResponseDto`                 |
| GET    | `/api/video/thumbnail/all`      | Get all video thumbnails | None                             | List of `String` (URLs)            |
| GET    | `/api/video/page`               | Get paginated videos     | Query param: `page` (default: 0) | List of `VideoResponseDto`         |
| PATCH  | `/api/video/update/title`       | Update video title       | `VideoRequestDto`                | `ResponseEntity<VideoResponseDto>` |
| PATCH  | `/api/video/update/description` | Update video description | `VideoRequestDto`                | `ResponseEntity<VideoResponseDto>` |

## Comment Endpoints

### Base Path: `/api/comments`

|Method|Endpoint|Description|Request Body|Response|
|---|---|---|---|---|
|GET|`/api/comments/{videoId}`|Get comments for a video|None|List of `Comment`|
|POST|`/api/comments/new`|Post a new comment|`CommentRequestDto`|`ResponseEntity<CommentResponseDto>`|
|PATCH|`/api/comments/update`|Update an existing comment|`CommentRequestDto`|`ResponseEntity<CommentResponseDto>`|
|DELETE|`/api/comments/delete`|Delete a comment (soft delete)|`CommentRequestDto` (only commentId required)|`ResponseEntity<CommentResponseDto>`|

## Data Transfer Objects (DTOs)

### UserRequestDto

```
{
  "token": "string",
  "credentials": {
    "username": "string",
    "password": "string",
    "token": "string"
  },
  "profile": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "admin": boolean
  }
}
```

### UserResponseDto

```
{
  "id": number,
  "username": "string",
  "token": "string",
  "profile": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "admin": boolean
  }
}
```

### VideoRequestDto

```
{
  "id": number,
  "title": "string",
  "description": "string"
}
```

### VideoResponseDto

```
{
  "id": number,
  "title": "string",
  "url": "string",
  "filename": "string",
  "thumbnailurl": "string",
  "description": "string"
}
```

### ProfileDto

```
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "admin": boolean
}
```

### ErrorDto

```
{
  "success": boolean,
  "message": "string"
}
```

### CredentialsDto

```
{
  "username": "string",
  "password": "string",
  "token": "string"
}
```

### CommentResponseDto

```
{
  "id": number,
  "text": "string",
  "author": "string",
  "createdAt": "datetime",
  "deleted": boolean
}
```

### CommentRequestDto

```
{
  "videoId": number,
  "commentId": number,
  "text": "string",
  "author": "string"
}
```

### AuthDto

```
{
  "valid": boolean,
  "message": "string"
}
```

## Domain Entities

### User Entity

```
{
  "id": number,              // Auto-generated ID
  "joined": timestamp,       // Auto-generated timestamp
  "deleted": boolean,        // Default: false
  "credentials": {
    "username": string,      // Unique, not null
    "password": string       // Not null (encrypted)
  },
  "profile": {
    "firstName": string,
    "lastName": string,
    "email": string,         // Not null
    "admin": boolean
  }
}
```

### Video Entity

```
{
  "id": number,              // Auto-generated ID
  "url": string,
  "title": string,
  "filename": string,
  "description": string,
  "thumbnailurl": string,
  "comments": [              // One-to-many relationship with Comment
    Comment,
    …
  ]
}
```

### Comment Entity

```
{
  "id": number,              // Auto-generated ID
  "text": string,            // TEXT column type
  "author": string,
  "createdAt": datetime,
  "deleted": boolean,        // Default: false
  "user": User,              // Many-to-one relationship with User
  "video": Video             // Many-to-one relationship with Video
}
```

### Notes for Implementation

1. Authentication uses JWT tokens
2. Redis is used for blacklisting tokens
3. Password encryption uses bcrypt
4. Secure HTTP-only cookies for token storage
5. Video endpoints require authentication (via JWT verification)
6. Video files are stored in S3 with CloudFront CDN
7. Comments use soft deletion (setting deleted flag rather than removing the record)
8. Several comment operations require authentication and potentially authorization (e.g., only comment author can update/delete)
9. Transactional operations are used for comment retrieval and creation
10. Database relationships:
   - User has one Profile and one Credentials (embedded)
   - Video has many Comments (one-to-many)
   - Comment belongs to one User and one Video (many-to-one)