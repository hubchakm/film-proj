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
   - Delete a specific film by sending a `DELETE` request to `/api/v1/films/:id` with a valid token
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

## Mobile App (Expo + Development Build)

A React Native client lives in `mobile/`. It uses **expo-router** for navigation (Login, Register, Films).

### Prerequisites
- Node.js 18+
- Android Studio (for the emulator) with:
  - Android SDK Platform 35 and Build-Tools 35.0.0
  - Android SDK Command-line Tools (latest)
- JDK 17 (Android Studio’s bundled JBR works)
- Expo CLI (we use `npx @expo/cli` below)

### Configure API base
The app points at the backend via:
- Android emulator: `http://10.0.2.2:8080/api/v1` (works out of the box)
- Physical device on same Wi-Fi: use your computer’s IP, e.g. `http://YOUR_IP:8080/api/v1`

If you need to change it, edit `mobile/app/_layout.tsx` and update `API_BASE`.

### First-time setup (Android)
```bash
cd mobile
npm install


# Install a development client (so your native modules match)
npx @expo/cli install expo-dev-client

# Generate native android project and build the dev client
npx @expo/cli prebuild --platform android
npx @expo/cli run:android
```

### Running the app
1. In the `mobile` folder run:
   ```bash
   cd mobile
   npx @expo/cli start -c
   ```
2. When prompted, open the app on your mobile device using developer mode with (a) option.
3. By default the app targets `10.0.2.2`, allowing Android Studio emulators like the Pixel 9a to reach the API. If you are testing on a different device, edit `mobile/` and adjust `API_BASE` to point to your computer's IP address.


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
