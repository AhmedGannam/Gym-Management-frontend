import { Component, OnInit } from '@angular/core';
import { OwnerService } from 'src/app/core/services/owner.service';
import { Member } from 'src/app/core/models/member.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Camera , CameraResultType , CameraSource} from '@capacitor/camera';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  standalone: false,
})
export class MembersPage implements OnInit {
  members: any[] = [];
  loading = false;
  error: string | null = null;
  private apiBaseUrl = environment.apiBaseUrl;
  defaultAvatar = '../../../assets/avatar.png';

  searchTerm: string = '';
  selectedFilter: 'all' | 'expired' = 'all';

  currentPage = 1;
  itemsPerPage = 10; // Default limit, matches backend default
  totalMembers = 0;
  totalPages = 0;

    private searchTerms = new Subject<string>();
    private searchSubscription!: Subscription;


  constructor(
    private OwnerService: OwnerService,
    private router: Router,
    private sharedService: SharedService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['filter'] === 'expired') {
        this.selectedFilter = 'expired';
      } else {
        this.selectedFilter = 'all';
      }
      this.currentPage = 1; // Reset to first page on filter/search change
      this.fetchMembers(true); // Pass true to indicate a fresh fetch (not load more)
    });

    this.sharedService.refresh$.subscribe(async (type) => {
      if (type === 'members') {
        this.currentPage = 1;
        this.fetchMembers(true);
        this.notificationService.showToast('Members list updated.', 'info');
      }
    });

   this.searchSubscription = this.searchTerms.pipe(
      debounceTime(500), // Wait 500ms after the last keystroke
      distinctUntilChanged() // Only emit if value is different from previous value
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  
  }

    performSearch(searchTerm: string) {
    this.searchTerm = searchTerm; // Update the component's searchTerm property
    this.currentPage = 1; // Always reset to the first page for a new search
    this.fetchMembers(true); // Call your existing fetchMembers to get results based on new searchTerm
  }

    ngOnDestroy() {
    // Unsubscribe to prevent memory leaks when the component is destroyed
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }


  fetchMembers(reset: boolean = false) {
    // Only show spinner if we have no data to show
    if (this.members.length === 0) {
      this.loading = true;
    }
    
    let filterExpired = this.selectedFilter === 'expired';
  
    this.OwnerService.getMembers(this.searchTerm, filterExpired, this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        if (reset) {
          this.members = response?.members || [];
        } else {
          this.members = [...this.members, ...(response?.members || [])];
        }
        this.totalMembers = response.total_members;
        this.totalPages = response.total_pages;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.notificationService.getFriendlyError(err);
        this.loading = false;
        this.notificationService.showToast(this.error, 'error');
      }
    });
  }

  loadMore() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchMembers(false); // Fetch next page, append results
    }
  }



  onSearchChange(event: any) {
    const searchTerm = event.target.value; // For native input, use event.target.value
    this.searchTerms.next(searchTerm); // Push the new search term to the Subject
  }

  onFilterChange() {
    this.currentPage = 1; // Reset to first page on new filter
    this.fetchMembers(true);
  }


  async takePhoto(member: any) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      if (image && image.dataUrl) {
        const blob = await (await fetch(image.dataUrl)).blob();
        const formData = new FormData();
        formData.append('photo', blob, 'photo.jpg');
        this.loading = true;
        try {
          const response: any = await this.http.put(
            `${this.apiBaseUrl}/owner/members/${member.member_id}/photo`,
            formData
          ).toPromise();
          member.photo = response.photo;
          this.notificationService.showToast('Photo updated successfully!', 'success');
        } catch (err) {
          this.notificationService.showToast('Photo upload failed. Please try again.', 'error');
        } finally {
          this.loading = false;
        }
      }
    } catch (err) {
      this.notificationService.showToast('Camera cancelled or failed.', 'info');
    }
  }

  async uploadPhoto(member: any, event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    this.loading = true;
    try {
      const response: any = await this.http.put(
        `${this.apiBaseUrl}/owner/members/${member.member_id}/photo`,
        formData
      ).toPromise();
      member.photo = response.photo;
      this.notificationService.showToast('Photo updated successfully!', 'success');
    } catch (err) {
      this.notificationService.showToast('Photo upload failed. Please try again.', 'error');
    } finally {
      this.loading = false;
    }
  }

  goToMemberDetails(member: Member) {
    this.router.navigate([`/owner-tabs/members/${member.member_id}`]);
  }

  goToAddMember() {
    this.router.navigate(['owner-tabs/add-member']);
  }

  viewFullPhoto(member: any) {
  // You can implement a modal or action sheet to view full photo
  // For now, this prevents the click from propagating and opening member details
  console.log('View full photo for:', member.first_name);
  // You could open a modal here to show the full-size photo
}
}
