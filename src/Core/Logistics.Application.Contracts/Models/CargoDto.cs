﻿namespace Logistics.Application.Contracts.Models;

public class CargoDto
{
    public string? Id { get; set; }

    [Required]
    public string? Source { get; set; }

    [Required]
    public string? Destination { get; set; }

    [Required]
    public decimal PricePerMile { get; set; }

    [Required]
    public double TotalTripMiles { get; set; }

    public bool IsCompleted { get; set; }
    public DateTime? PickUpDate { get; set; }
    public string? Status { get; set; }

    [Required]
    public string? AssignedDispatcherId { get; set; }
    public string? AssignedDispatcherName { get; set; }

    public string? AssignedTruckId { get; set; }
    public string? AssignedTruckDriverName { get; set; }
}
