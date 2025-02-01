
# Home Videos Viewer
A home video viewing site incorporating Spring Boot, Maven, Postgres, Redis, Next.js, Typescript, S3, and self-hosted with Docker on Digital Ocean at www.homevideos.smbirch.com




## API Reference

### Users

#### Get all users

```http
GET /users/
```


#### Get user by username

```http
GET /users/{username}
```

#### Create new user

```http
POST /users/
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

```http
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

 

### Videos

#### Get all videos

```http
GET /video/all
```

#### Get all videos

```http
GET /video/all
```

#### Get video by ID

```http
GET /video/{id}
```

#### Get all video thumbnails

```http
GET /video/thumbnail/all
```

#### Get page of videos by page number (12 videos per page)

```http
GET /video/page?page={pageNumber}
```

#### Update a video title

```http
PATCH /video/update/title
```

```json
{
  "id": "0",
  "title": "New Title"
}
```

#### Update a video description

```http
PATCH /video/update/description
```

```json
{
  "id": "0",
  "description": "New Description"
}
```
 
### Comments

#### Get all comments for a video

```http
GET /comments/{videoId}
```

#### Make a new comment on a video

```http
POST /comments/new
```

```json
{
  "videoId": 0,
  "text": "this is a comment",
  "author": "spencer"
}
```

#### Update a comment

```http
PATCH /comments/update
```

```json
{
  "commentId": 0,
  "text": "Updated comment here"
}
```

#### Delete a comment

```http
DELETE /comments/delete 
```

```json
{
  "commentId": 0
}
```
## License

[MIT](https://choosealicense.com/licenses/mit/)
