![AetherNote Logo](/assets/logo.png)
# AetherNote

AetherNote is a privacy-focused, encrypted note-sharing service built with React and Golang. Leveraging Redis for data handling and client-side encryption for security, AetherNote ensures that your notes remain confidential and secure until they are meant to be seen.

## Features

- **Self-destructing notes**: By default notes are deleted automatically after being viewed once.
- **Time-based expiration**: Notes can be set to expire after a custom number of time.
- **View-based expiration**: Notes can be set to expire after a custom number of views.
- **Custom password**: Ability to use a custom password for encryption (pbkdf2 will be used to derive the encryption key).
- **Redis + client-side encryption**: Utilizes Redis for in memory data storage and retrieval, combined with client-side encryption to ensure that the server never has access to the contents of the notes.

## Environment Variables

To configure AetherNote properly, set the following environment variables. Below is a table describing each variable and its function:

| Variable                 | Description                                           | Possible Values                      |
|--------------------------|-------------------------------------------------------|--------------------------------------|
| `BACKEND_LISTENING_PORT` | Port number where the backend server listens          | Any valid port number (e.g., `8080`) |
| `FRONTEND_LISTENING_PORT`| Port number where the frontend server listens         | Any valid port number (e.g., `4000`) |
| `REDIS_HOST`             | Hostname of the Redis server                          | Usually `localhost` or `redis` in Docker environments |
| `REDIS_PREFIX`           | Prefix used for keys in Redis to identify stored notes| Any string (e.g., `note`)            |
| `REDIS_PORT`             | Port number on which the Redis server is listening    | Any valid port number (default `6379`) |
| `MAX_EXPIRATION_TIME`    | Maximum time in seconds a note can exist              | Any integer or `0` for no time limit |
| `MAX_VIEWS`              | Maximum number of views a note can have before deletion| Any integer                           |
| `UPLOAD_LIMIT`           | Maximum size of the note content in bytes             | Any integer (e.g., `1048576` for 1MB) |
| `REACT_APP_HOST`         | URL where the frontend is hosted                      | Any valid URL (e.g., `http://localhost:4000`) |
| `REACT_APP_API_HOST`     | URL where the backend is hosted, used for API requests | Any valid URL (e.g., `http://localhost:8080`) |

## Docker Compose

AetherNote comes with a Docker Compose setup for easy deployment. The Docker Compose file configures the necessary services and environment variables for a quick start.

## Getting Started

To get AetherNote up and running:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kaliendo/aethernote.git
   cd aethernote
   ```
2. **Start the service:**
   ```bash
    docker-compose up -d
   ```
Your AetherNote service should now be running and accessible via http://localhost:4000
