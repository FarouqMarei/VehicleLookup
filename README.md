# Vehicle Lookup (NHTSA VPIC)

Small ASP.NET Core app for an assignment: choose a car make, model year, and vehicle type, then list matching models using the public NHTSA vPIC API.

## What it uses

- **All makes:** `GET https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json`
- **Types for a make:** `GET .../GetVehicleTypesForMakeId/{makeId}?format=json`
- **Models:** `GET .../GetModelsForMakeIdYear/makeId/{id}/modelyear/{year}/vehicletype/{type}?format=json`

## Run locally (without Docker)

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Steps

1. Open a terminal in this folder (`C:\VehicleLookup` on my machine).
2. Restore and run:
   ```bash
   dotnet restore
   dotnet run
   ```
3. Open the URL shown in the console (usually `http://localhost:5xxx`).
4. Select make, year, and vehicle type, then click **Search models**.

## Run with Docker

### Prerequisites

- Docker Desktop (or Docker Engine + Compose)

### Steps

1. From the project root:
   ```bash
   docker compose up --build
   ```
2. Browse to [http://localhost:8080](http://localhost:8080).
3. Stop with `Ctrl+C`, or run `docker compose down` in another terminal.

## AWS (free tier) hosting notes

This is how I deployed for the assignment using a single **t2.micro / t3.micro** EC2 instance (free tier eligible in us-east-1 if your account qualifies).

1. **Launch EC2**
   - Amazon Linux 2023 or Ubuntu 22.04, instance type `t2.micro`.
   - Create/download a key pair (.pem).
   - Security group: allow SSH (22) from your IP, HTTP (8080) from `0.0.0.0/0` (or restrict to your IP for homework).

2. **Install Docker on the instance** (Amazon Linux example):
   ```bash
   sudo yum update -y
   sudo yum install -y docker git
   sudo systemctl enable --now docker
   sudo usermod -aG docker ec2-user
   ```
   Log out and back in so `docker` works without sudo.

3. **Clone and run**
   ```bash
   git clone https://github.com/FarouqMarei/VehicleLookup.git
   cd VehicleLookup
   docker compose up -d --build
   ```

4. **Test:** `http://<public-ec2-ip>:8080`

Optional: put Nginx on port 80 as a reverse proxy to 8080, or use an Application Load Balancer (not required for the assignment demo).

## Project layout

- `Services/VpicService.cs` – HTTP calls to NHTSA
- `Controllers/VehiclesController.cs` – JSON endpoints for the page
- `Pages/Index.cshtml` – UI
- `wwwroot/js/site.js` – front-end logic

## License

Course assignment – no special license.
