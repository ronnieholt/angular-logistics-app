import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Employee, Role } from '@shared/models';
import { ApiService } from '@shared/services';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditEmployeeComponent implements OnInit {
  private employee?: Employee;

  public isBusy: boolean;
  public form: FormGroup;
  public roles: Role[];
  public id!: string;
  
  constructor(
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private oidcService: OidcSecurityService,
    private route: ActivatedRoute) 
  {
    this.roles = [];
    this.isBusy = false;
    this.form = new FormGroup({
      userName: new FormControl({value: '', disabled: true}, Validators.required),
      firstName: new FormControl({value: '', disabled: true}),
      lastName: new FormControl({value: '', disabled: true}),
      role: new FormControl('', Validators.required),
    });

    //let currentUserRole = EmployeeRole.Owner as string;
    //oidcSecurityService.getUserData().subscribe((userData: User) => currentUserRole = userData.role!);

    // for (const role in EmployeeRole) {
    //   if (currentUserRole !== 'admin' && role === EmployeeRole.Owner) {
    //     continue;
    //   }
    //   else {
    //     this.roles.push(role);
    //   }
    // }
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.fetchRoles();
    this.fetchEmployee();
  }

  public submit() {
    const employee: Employee = {
      id: this.employee?.id,
      role: this.form.value.role
    }

    this.isBusy = true;
    this.apiService.updateEmployee(employee).subscribe(result => {
      if (result.success) {
        this.messageService.add({key: 'notification', severity: 'success', summary: 'Notification', detail: 'User has been updated successfully'});
      }

      this.isBusy = false;
    });
  }

  public confirmToDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this employee from the company?',
      //accept: () => this.deleteLoad()
    });
  }

  private fetchEmployee() {
    this.isBusy = true;

    this.apiService.getEmployee(this.id!).subscribe(result => {
      if (result.success && result.value) {
        this.employee = result.value;
        
        this.form.patchValue({
          userName: this.employee.userName,
          firstName: this.employee.firstName,
          lastName: this.employee.lastName,
        });
        
        if (this.employee.roles && this.employee.roles.length > 0) {          
          this.form.patchValue({
            role: this.employee.roles[0].name
          });
        }
      }

      this.isBusy = false;
    });
  }

  private fetchRoles() {
    this.isBusy = true;

    this.apiService.getRoles().subscribe(result => {
      if (result.success && result.items) {
        this.roles.push(...result.items);
      }

      this.isBusy = false;
    });
  }
}
