import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  profilePic = localStorage.getItem('profilePic');
  username = localStorage.getItem('username');
  userId = localStorage.getItem('userId');

  search: string = '';


  isNewPostBoxOpen: boolean = false;

  
  

}
