# Home Videos Viewer

A home video viewing site incorporating Spring Boot, Maven, PostgreSQL, Angular, Typescript, S3, and self-hosted on
Digital Ocean at www.homevideos.smbirch.com

## API Reference

## Users

#### Get all users

```http request
GET /users
```

#### Get user by username

```http request
GET /users/{username}
```

#### Create new user

```http request
POST /users
```

```json
{
  "credentials": {
    "username": "example_username",
    "password": "example_password"
  },
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "admin": false
  }
}
```

#### Validate a user

```http request
POST /users/validate
```

```json 
{
  "credentials": {
    "username": "example_username",
    "password": "example_password"
  }
}
```

## Videos

#### Get all videos

```http request
GET /content/all
```

#### Get video by ID

```http request
GET /content/{id}
```

#### Get all thumbnails

```http request
GET /content/all/thumbnails
```

#### Get a page of videos

```http request
GET /content/page
```

```
Accepts a page number, default is page 0
``` 

#### Update video title

```http request
PATCH /content/update/title
```

```json 
{
  "id": "video_id_required",
  "title": "new_title",
  "description": "not_required"
}
```