import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserInformation } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // State management
  userProfile: UserInformation['userProfile'] | null = null;
  authInfo: UserInformation['authInfoResponse'] | null = null;
  
  isEditing = false;           // View mode vs Edit mode
  isLoading = false;           // Loading when fetching initial profile
  isSaving = false;            // Loading when saving changes
  errorMessage: string = '';   // Error message display
  successMessage: string = '';  // Success message display

  // Backup for canceling edit
  private profileBackup: UserInformation['userProfile'] | null = null;

  /**
   * Lifecycle hook - automatically load profile when component initializes
   */
  async ngOnInit() {
    await this.loadProfile();
  }

  /**
   * Load user profile from API
   * Called on component init and when entering edit mode for the first time
   */
  async loadProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    try {
      const res = await firstValueFrom(this.userService.getProfile());

      if (res?.data) {
        this.userProfile = res.data.userProfile;
        this.authInfo = res.data.authInfoResponse;
      } else {
        this.errorMessage = 'Failed to load profile data';
      }
    } catch (error: any) {
      console.error('Load profile error:', error);
      
      // Handle 401 Unauthorized - token invalid or expired
      if (error.status === 401) {
        this.errorMessage = 'Your session has expired. Please login again.';
        this.authService.logout();
        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      } else {
        this.errorMessage = error?.error?.message || error?.message || 'Failed to load profile. Please try again.';
      }
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Enter edit mode
   * If profile not loaded yet, fetch it first
   */
  async enableEdit() {
    // Only fetch if profile doesn't exist yet
    if (!this.userProfile) {
      await this.loadProfile();
    }

    // Create backup before entering edit mode
    if (this.userProfile) {
      this.profileBackup = { ...this.userProfile };
    }

    this.isEditing = true;
    this.cdr.markForCheck();
  }

  /**
   * Cancel edit mode and discard changes
   */
  cancelEdit() {
    // Restore backup if exists
    if (this.profileBackup) {
      this.userProfile = { ...this.profileBackup };
      this.profileBackup = null;
    }

    this.isEditing = false;
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  /**
   * Save profile changes to backend
   */
  async saveProfile() {
    // Safety check
    if (!this.userProfile) {
      this.errorMessage = 'Profile data not loaded. Please try again.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    try {
      const res = await firstValueFrom(
        this.userService.updateProfile({
          fullName: this.userProfile.fullName,
          phoneNumber: this.userProfile.phoneNumber,
          bio: this.userProfile.bio,
          address: this.userProfile.address,
          city: this.userProfile.city,
          country: this.userProfile.country,
        })
      );

      if (res?.data) {
        this.userProfile = res.data.userProfile;
        this.authInfo = res.data.authInfoResponse;
        this.successMessage = 'Profile updated successfully!';
        this.profileBackup = null;
      } else {
        this.errorMessage = 'Failed to update profile';
      }

      // Exit edit mode after successful save
      this.isEditing = false;
    } catch (error: any) {
      console.error('Save profile error:', error);
      
      // Handle 401 Unauthorized - token invalid or expired
      if (error.status === 401) {
        this.errorMessage = 'Your session has expired. Please login again.';
        this.authService.logout();
        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      } else {
        this.errorMessage = error?.error?.message || error?.message || 'Failed to save profile. Please try again.';
      }
    } finally {
      this.isSaving = false;
      this.cdr.markForCheck();
    }
  }

  get canManageProduct(): boolean {
    return this.authInfo?.role === 'ADMIN' || this.authInfo?.role === 'MANAGER';
  }

  goToProductManagement() {
    this.router.navigate(['/product-management']);
  }

  /**
   * Logout user and redirect to login page
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}