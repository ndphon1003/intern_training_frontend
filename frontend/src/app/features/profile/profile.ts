import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProfileResponse, UserInformation } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'], // fix typo 'styleUrl' -> 'styleUrls'
})
export class Profile {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  userProfile: UserInformation['userProfile'] | null = null;
  authInfo: UserInformation['authInfoResponse'] | null = null;

  constructor() {
    this.loadProfile();
  }

  async loadProfile() {
    try {
      
      const profileResponse: ProfileResponse = await firstValueFrom(
        this.userService.getProfile()
      );

      if (profileResponse?.data) {
        this.authInfo = profileResponse.data.authInfoResponse;
        this.userProfile = profileResponse.data.userProfile;

        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}