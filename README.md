# Vehicle Lookup (NHTSA VPIC)

ASP.NET Core Web API + **Angular** front end. Choose make, model year, and vehicle type, then list matching models from the NHTSA vPIC API.

## APIs used

- **All makes:** `GET https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json`
- **Types for a make:** `GET .../GetVehicleTypesForMakeId/{makeId}?format=json`
- **Models:** `GET .../GetModelsForMakeIdYear/makeId/{id}/modelyear/{year}/vehicletype/{type}?format=json`

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/) (for the Angular app in `ClientApp/`)

## Run locally (development)

Use two terminals from `C:\VehicleLookup`:

**1. API backend**

```bash
dotnet run
```

Runs at **http://localhost:5166** (see `Properties/launchSettings.json`).

**2. Angular UI**

```bash
cd ClientApp
npm install
npm start
```

Open **http://localhost:4200**. Requests to `/api/*` are proxied to the .NET app (`ClientApp/proxy.conf.json`).

## Run locally (single port, production-style)

Build the UI into `wwwroot`, then run the API (it serves the Angular static files):

```bash
cd ClientApp
npm install
npm run build
cd ..
dotnet run
```

Browse to **http://localhost:5166**.

## Docker

```bash
docker compose up --build
```

Then open **http://localhost:8080**. The image builds Angular and publishes the .NET app in one Dockerfile.

## AWS (free tier)

Same as before: EC2 `t2.micro`, install Docker, clone this repo, `docker compose up -d --build`, open port **8080** in the security group.

## Project layout

| Path | Role |
|------|------|
| `ClientApp/` | Angular UI |
| `Controllers/VehiclesController.cs` | REST API for the UI |
| `Services/VpicService.cs` | Calls NHTSA |
| `wwwroot/` | Angular build output (generated; not committed) |

## License

Course assignment.
