import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import * as uuid from 'uuid';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit{
 

  ngOnInit(): void {
    
    const userId = localStorage.getItem('userId');
    if(userId){
      this.route.navigate(['/']);
    } 
  }

  authType: string = 'login';

  username: string = '';
  email: string = '';
  password: string = '';
  file:any = null;

  isUploading: boolean = false;
  uploadProgress = 0; 

  handleFileChange(event: any){
    this.file = event.target.files[0];
  }


  constructor(private storage: Storage, private http: HttpClient, private route: Router){}

  async handleRegister(){
    this.isUploading = true;
    const path  = uuid.v4();
    const fileRef = ref(this.storage, path);
    const task = await uploadBytes(fileRef, this.file);
    const url = await getDownloadURL(fileRef);
    
    this.http.post<any>('http://localhost:6001/register', {username:this.username, email: this.email, password: this.password, profilePic: url}).subscribe(
      (response: any)=>{
        this.isUploading = true;

          localStorage.setItem('userId', response._id);
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email);
          localStorage.setItem('profilePic', response.profilePic);
          this.username = '';
          this.email = '';
          this.password='';
          this.file = null;

        this.route.navigate(['/']);

      }, (error)=>{
        alert("Registration failed!!");
      }
    )

  }



  handleLogin(){

    this.http.post<any>('http://localhost:6001/login', {email: this.email, password: this.password}).subscribe(
      (response: any)=>{

          localStorage.setItem('userId', response._id);
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email);
          localStorage.setItem('profilePic', response.profilePic);
          this.email = '';
          this.password='';

        this.route.navigate(['/']);

      }, (error)=>{
        alert("Login failed!!");
      }
    )

  }



}



