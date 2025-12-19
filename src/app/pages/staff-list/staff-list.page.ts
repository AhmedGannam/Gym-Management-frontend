import { Component, OnInit } from '@angular/core';
import { OwnerService } from 'src/app/core/services/owner.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.page.html',
  styleUrls: ['./staff-list.page.scss'],
  standalone: false
})
export class StaffListPage implements OnInit {
  staffList: any[] = [];

  constructor(private ownerService: OwnerService, private router: Router, private loader: LoaderService) { }

  ngOnInit() {
    if (this.staffList.length === 0) {
      this.loader.show('Loading staff...');
    }
    
    this.ownerService.getStaffList().subscribe({
      next: (res) => {
        this.staffList = res.staff || [];
        this.loader.hide();
      },
      error: () => { this.loader.hide(); }
    });
  }

  navigateToAddStaff() {
    this.router.navigate(['owner-tabs/add-staff']);
  }

  uploadStaffPhoto(staff: any, event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    this.ownerService.uploadStaffPhoto(staff.staff_id, formData).subscribe({
      next: (res: any) => {
        staff.photo = res.photo;
      },
      error: () => {
        // Optionally show error toast
      }
    });
  }
}