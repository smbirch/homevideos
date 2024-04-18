# Home Video-Tube

A home video viewing site incorporating Spring Boot, Maven, PostgreSQL, Angular, Typescript, S3, and self-hosted with Docker on
Digital Ocean at www.homevideos.smbirch.com.

![](https://github.com/smbirch/homevideos/blob/main/media/Screenshot%202024-04-17%20at%205.27.57%E2%80%AFPM.png)

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

#### Update video description

```http request
PATCH /content/update/description
```

```json 
{
  "id": "video_id_required",
  "title": "not_required",
  "description": "new_description"
}
```
