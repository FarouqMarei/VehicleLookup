using Microsoft.AspNetCore.Mvc;
using VehicleLookup.Services;

namespace VehicleLookup.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly VpicService _vpic;

    public VehiclesController(VpicService vpic)
    {
        _vpic = vpic;
    }

    [HttpGet("makes")]
    public async Task<IActionResult> GetMakes(CancellationToken ct)
    {
        var makes = await _vpic.GetMakesAsync(ct);
        return Ok(makes);
    }

    [HttpGet("types/{makeId:int}")]
    public async Task<IActionResult> GetTypes(int makeId, CancellationToken ct)
    {
        if (makeId <= 0)
            return BadRequest("Invalid make id");

        var types = await _vpic.GetVehicleTypesForMakeAsync(makeId, ct);
        return Ok(types);
    }

    [HttpGet("models")]
    public async Task<IActionResult> GetModels([FromQuery] int makeId, [FromQuery] int year, [FromQuery] string vehicleType, CancellationToken ct)
    {
        if (makeId <= 0 || year < 1996 || string.IsNullOrWhiteSpace(vehicleType))
            return BadRequest("Make, year (1996+), and vehicle type are required");

        var models = await _vpic.GetModelsAsync(makeId, year, vehicleType, ct);
        return Ok(models);
    }
}
