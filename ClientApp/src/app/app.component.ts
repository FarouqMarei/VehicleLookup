import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Make, VehicleModel, VehicleType } from './models/vehicle.models';
import { VehicleApiService } from './services/vehicle-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly api = inject(VehicleApiService);

  allMakes: Make[] = [];
  filteredMakes: Make[] = [];
  makeFilter = '';
  selectedMakeId: number | null = null;

  years: number[] = [];
  selectedYear: number | null = null;

  vehicleTypes: VehicleType[] = [];
  selectedVehicleType = '';

  models: VehicleModel[] = [];
  statusMessage = '';
  loadingMakes = false;
  loadingTypes = false;
  searching = false;

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1996; y--) {
      this.years.push(y);
    }
    this.loadMakes();
  }

  get canSearch(): boolean {
    return !!this.selectedMakeId && !!this.selectedYear && !!this.selectedVehicleType;
  }

  onMakeFilterChange(): void {
    const q = this.makeFilter.trim().toLowerCase();
    if (!q) {
      this.filteredMakes = [...this.allMakes];
      return;
    }
    this.filteredMakes = this.allMakes.filter((m) =>
      m.make_Name.toLowerCase().includes(q)
    );
  }

  onMakeSelected(): void {
    this.selectedVehicleType = '';
    this.vehicleTypes = [];
    this.models = [];

    if (!this.selectedMakeId) {
      return;
    }

    this.loadingTypes = true;
    this.statusMessage = '';
    this.api.getTypesForMake(this.selectedMakeId).subscribe({
      next: (types) => {
        this.vehicleTypes = types;
        this.loadingTypes = false;
        if (types.length === 0) {
          this.statusMessage = 'No vehicle types returned for this make.';
        }
      },
      error: () => {
        this.loadingTypes = false;
        this.statusMessage = 'Failed to load vehicle types.';
      },
    });
  }

  searchModels(): void {
    if (!this.canSearch || !this.selectedMakeId || !this.selectedYear) {
      return;
    }

    this.searching = true;
    this.models = [];
    this.statusMessage = 'Searching...';

    this.api
      .getModels(this.selectedMakeId, this.selectedYear, this.selectedVehicleType)
      .subscribe({
        next: (models) => {
          this.models = models;
          this.searching = false;
          this.statusMessage = models.length
            ? `${models.length} model(s) found`
            : 'No models matched';
        },
        error: () => {
          this.searching = false;
          this.statusMessage = 'Search failed.';
        },
      });
  }

  private loadMakes(): void {
    this.loadingMakes = true;
    this.statusMessage = 'Loading makes...';
    this.api.getMakes().subscribe({
      next: (makes) => {
        this.allMakes = makes;
        this.filteredMakes = [...makes];
        this.loadingMakes = false;
        this.statusMessage = '';
      },
      error: () => {
        this.loadingMakes = false;
        this.statusMessage = 'Could not load makes.';
      },
    });
  }
}
