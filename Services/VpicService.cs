using System.Text.Json;
using VehicleLookup.Models;

namespace VehicleLookup.Services;

public class VpicService
{
    private readonly HttpClient _http;
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public VpicService(HttpClient http)
    {
        _http = http;
    }

    public async Task<IReadOnlyList<MakeItem>> GetMakesAsync(CancellationToken ct = default)
    {
        var url = "vehicles/getallmakes?format=json";
        var data = await _http.GetFromJsonAsync<VpicResponse<MakeItem>>(url, JsonOpts, ct);
        if (data?.Results == null)
            return Array.Empty<MakeItem>();

        return data.Results
            .OrderBy(m => m.Make_Name, StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    public async Task<IReadOnlyList<VehicleTypeItem>> GetVehicleTypesForMakeAsync(int makeId, CancellationToken ct = default)
    {
        var url = $"vehicles/GetVehicleTypesForMakeId/{makeId}?format=json";
        var data = await _http.GetFromJsonAsync<VpicResponse<VehicleTypeItem>>(url, JsonOpts, ct);
        return data?.Results ?? new List<VehicleTypeItem>();
    }

    public async Task<IReadOnlyList<ModelItem>> GetModelsAsync(int makeId, int modelYear, string vehicleTypeName, CancellationToken ct = default)
    {
        var typeToken = MapVehicleType(vehicleTypeName);
        var url = $"vehicles/GetModelsForMakeIdYear/makeId/{makeId}/modelyear/{modelYear}/vehicletype/{typeToken}?format=json";
        var data = await _http.GetFromJsonAsync<VpicResponse<ModelItem>>(url, JsonOpts, ct);
        return data?.Results ?? new List<ModelItem>();
    }

    // VPIC accepts partial type names (e.g. "car", "truck")
    private static string MapVehicleType(string name)
    {
        if (name.Contains("Truck", StringComparison.OrdinalIgnoreCase))
            return "truck";
        if (name.Contains("Passenger Car", StringComparison.OrdinalIgnoreCase))
            return "car";
        if (name.Contains("MPV", StringComparison.OrdinalIgnoreCase))
            return "MPV";

        return Uri.EscapeDataString(name);
    }
}
