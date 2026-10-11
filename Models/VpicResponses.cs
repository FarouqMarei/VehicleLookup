namespace VehicleLookup.Models;

public class VpicResponse<T>
{
    public int Count { get; set; }
    public string Message { get; set; } = "";
    public string SearchCriteria { get; set; } = "";
    public List<T> Results { get; set; } = new();
}

public class MakeItem
{
    public int Make_ID { get; set; }
    public string Make_Name { get; set; } = "";
}

public class VehicleTypeItem
{
    public int VehicleTypeId { get; set; }
    public string VehicleTypeName { get; set; } = "";
}

public class ModelItem
{
    public int Make_ID { get; set; }
    public string Make_Name { get; set; } = "";
    public int Model_ID { get; set; }
    public string Model_Name { get; set; } = "";
}
