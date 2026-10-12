# Vehicle Lookup (NHTSA VPIC)

ASP.NET Core Web API + **Angular** front end. Choose make, model year, and vehicle type, then list matching models from the [NHTSA vPIC](https://vpic.nhtsa.dot.gov/api/) API.

**EC2 is up and running at:** [http://13.51.233.82:8080/](http://13.51.233.82:8080/)

## APIs used

- **All makes:** `GET https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json`
- **Types for a make:** `GET .../GetVehicleTypesForMakeId/{makeId}?format=json`
- **Models:** `GET .../GetModelsForMakeIdYear/makeId/{id}/modelyear/{year}/vehicletype/{type}?format=json`

---

## Run locally

### 1. Download and install .NET

Install the **.NET 8 SDK** (not only the runtime):

- https://dotnet.microsoft.com/download/dotnet/8.0

Confirm:

```bash
dotnet --version
```

You should see `8.x`.

### 2. Download and install Node.js

Install **Node.js 20 or later** (includes npm):

- https://nodejs.org/

Confirm:

```bash
node -v
npm -v
```

### 3. Install Angular CLI

```bash
npm install -g @angular/cli
```

Confirm:

```bash
ng version
```

### 4. Clone the repo

```bash
git clone https://github.com/FarouqMarei/VehicleLookup.git
cd VehicleLookup
```

### 5. Run Angular and .NET (two terminals)

Keep **both** processes running. The UI on port 4200 proxies `/api` to the .NET app on port 5166.

**Terminal 1 — .NET API**

From the repo root (`VehicleLookup`):

```bash
dotnet run
```

API: **http://localhost:5166**

**Terminal 2 — Angular**

```bash
cd ClientApp
npm install
npm start
```

UI: **http://localhost:4200**

Open **http://localhost:4200** in the browser. If you see “Could not load makes”, the API is not running or the proxy target in `ClientApp/proxy.conf.json` does not match the API port.

If you start the API from Visual Studio with **IIS Express**, it listens on **http://localhost:22126**. Either use the **http** profile (`dotnet run`, port 5166) or change `proxy.conf.json` to `22126` and restart `npm start`.

### Optional: one process (production-style)

Build Angular into `wwwroot`, then let .NET serve the UI and API together:

```bash
cd ClientApp
npm install
npm run build
cd ..
dotnet run
```

Browse to **http://localhost:5166**.

---

## Run on AWS

The app is deployed on **Amazon EC2** and is up and running at:

**[http://13.51.233.82:8080/](http://13.51.233.82:8080/)**

To deploy it yourself on an EC2 instance (free-tier `t2.micro` / Amazon Linux is enough):

1. Open **inbound TCP port 8080** in the instance security group (source `0.0.0.0/0` for a public demo, or your IP only).
2. SSH in and install Docker + Docker Compose.
3. Clone and start:

```bash
git clone https://github.com/FarouqMarei/VehicleLookup.git
cd VehicleLookup
docker compose up -d --build
```

4. Open `http://<EC2-PUBLIC-IP>:8080` (this instance: [http://13.51.233.82:8080/](http://13.51.233.82:8080/)).

The Dockerfile builds Angular, publishes the .NET app, and serves both on port **8080**.

To run the same image on your machine:

```bash
docker compose up --build
```

Then open **http://localhost:8080**.

---

## Project layout

| Path | Role |
|------|------|
| `ClientApp/` | Angular UI |
| `Controllers/VehiclesController.cs` | REST API for the UI |
| `Services/VpicService.cs` | Calls NHTSA |
| `wwwroot/` | Angular build output (generated; not committed) |

## License

Course assignment.
