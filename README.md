# Film Project with Docker Compose and Nginx

This project contains a simple web front end and a films API implemented in Node.js.  
Docker Compose is used to run the entire stack and Nginx acts as a reverse proxy so that
all services are available through a single port.

## Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed

## Getting Started
1. Build the images:
   ```bash
   docker-compose build
   ```
2. Start the stack:
   ```bash
   docker-compose up
   ```
3. Open your browser to [http://localhost:8080](http://localhost:8080) to use the web interface.
   - API calls are available via [http://localhost:8080/api/v1/films](http://localhost:8080/api/v1/films)
   - The web service is also exposed on port `3000` and the films API on port `3001` for direct access.
4. When you are finished, stop the containers with `Ctrl+C` and run:
   ```bash
   docker-compose down
   ```

## Project Structure
- `Dockerfile` – Docker setup for the web front end
- `films/` – Films API service (includes its own `Dockerfile`)
- `docker-compose.yml` – defines and links the services
- `default.conf` – Nginx configuration used by the proxy service
- `public/` – static assets served by the web container

## Notes
If you modify any of the application files or configuration, rebuild the images to ensure
Docker picks up the changes:
```bash
docker-compose down
docker-compose build
```
