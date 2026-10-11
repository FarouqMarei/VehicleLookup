FROM node:22-alpine AS angular
WORKDIR /src/ClientApp
COPY ClientApp/package.json ClientApp/package-lock.json ./
RUN npm ci
COPY ClientApp/ ./
RUN npm run build -- --configuration production

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY VehicleLookup.csproj .
RUN dotnet restore
COPY . .
COPY --from=angular /src/wwwroot ./wwwroot
RUN dotnet publish VehicleLookup.csproj -c Release -o /app/publish /p:UseAppHost=false /p:SkipSpaBuild=true

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "VehicleLookup.dll"]
