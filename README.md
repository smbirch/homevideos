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