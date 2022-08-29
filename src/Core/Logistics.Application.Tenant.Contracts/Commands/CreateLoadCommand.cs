﻿using Logistics.Domain.Shared;

namespace Logistics.Application.Contracts.Commands;

public sealed class CreateLoadCommand : RequestBase<DataResult>
{
    public string? Name { get; set; }
    
    [Required]
    public string? SourceAddress { get; set; }
    
    [Required]
    public string? DestinationAddress { get; set; }
    
    [Required]
    [Range(LoadConsts.MinDeliveryCost, LoadConsts.MaxDeliveryCost)]
    public decimal DeliveryCost { get; set; }
    
    [Required]
    [Range(LoadConsts.MinDistance, LoadConsts.MaxDistance)]
    public double Distance { get; set; }
    
    [Required]
    public string? AssignedDispatcherId { get; set; }
    
    [Required]
    public string? AssignedDriverId { get; set; }
    
    public DateTime DispatchedDate { get; set; } = DateTime.UtcNow;
}
