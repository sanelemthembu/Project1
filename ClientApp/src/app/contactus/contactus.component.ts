import { Component, Input } from '@angular/core';
import { SocialMedia } from '../models/socialmedia';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
})
export class ContactUsComponent {
  @Input() facebook: SocialMedia;
  @Input() twitter: SocialMedia;
  @Input() linkedIn: SocialMedia;
  @Input() medium: SocialMedia;
  @Input() vertical: boolean = true;

  facebookLink: string = "https://www.facebook.com/";
  twitterLink: string = "https://twitter.com/";
  linkedInLink: string = "https://www.linkedin.com/";
  linkedInLinkCompany: string = "https://www.linkedin.com/company/"
  mediumLink: string = "https://medium.com/@";

}
