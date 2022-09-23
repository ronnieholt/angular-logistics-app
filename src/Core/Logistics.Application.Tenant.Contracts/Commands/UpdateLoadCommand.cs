﻿namespace Logistics.Application.Contracts.Commands;

public sealed class UpdateLoadCommand : RequestBase<DataResult>
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? SourceAddress { get; set; }
    public string? DestinationAddress { get; set; }
    public double? DeliveryCost { get; set; }
    public double? Distance { get; set; }
    public string? AssignedDispatcherId { get; set; }
    public string? AssignedDriverId { get; set; }
    public LoadStatus? Status { get; set; }
}
