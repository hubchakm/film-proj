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

## Access from other devices
To use the site or API from phones or other computers on your local network:

1. Find your computer's local IP address.
   - Windows: run `ipconfig` and look for the IPv4 address.
   - macOS/Linux: run `ifconfig` or `ip addr`.
2. Start the project as described above.
3. From the other device, browse to `http://YOUR_IP:8080` replacing `YOUR_IP` with the address from step 1.
4. If the films service is run separately, set the environment variable `FILMS_SERVICE_URL` before starting the web app:
   ```bash
   export FILMS_SERVICE_URL=http://YOUR_IP:3001
   ```

The API base URL for mobile apps should also use the IP address, e.g. `http://YOUR_IP:8080/api/v1`.

## Mobile App
A minimal React Native client is provided in the `mobile/` directory. It allows logging in,
listing films, adding new films and updating ratings.

### Running the app
1. Install [Node.js](https://nodejs.org/) and [Expo](https://docs.expo.dev/get-started/installation/).
2. In the `mobile` folder run:
   ```bash
   npm install
   npm start
   ```
3. When prompted, open the app on your mobile device using the Expo Go app or an emulator.
4. By default the app targets `10.0.2.2`, allowing Android Studio emulators like the Pixel 9a to reach the API. If you are testing on a different device, edit `mobile/App.js` and adjust `API_BASE` to point to your computer's IP address.


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
