import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  userId = localStorage.getItem('userId');
  

  userData: any = null;
  videosCount: number = 0;

  activeFollowing: string = 'all';

  users: any[] = [];
  videos: any[] = [];

  displayVideos: any[] = [];

  constructor(private http: HttpClient, private route: Router) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchVideos();
    this.fetchUsers();
  }


  fetchUserData = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-user/${this.userId}`).subscribe(
      (response)=>{
        this.userData = response;

      }
    )

  }


   // fetch videos

   fetchVideos = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-videos`).subscribe(
      async (response)=>{
        this.videos= await response.filter((video:any)=> this.userData.following.includes(video.userId)).reverse();
        this.displayVideos= await response.filter((video:any)=> this.userData.following.includes(video.userId)).reverse();
      }
    )
  }

  // fetch users

  fetchUsers = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-users`).subscribe(
      async (response)=>{
        this.users= await response.filter((user:any)=> this.userData.following.includes(user._id));
        console.log(response);
      }
    )
  }


 handleFollowerChange(userId: any){
  this.activeFollowing = userId;
  if(userId === 'all'){
    this.displayVideos = this.videos;
  } else{

    this.displayVideos = this.videos.filter((video:any)=> video.userId === userId);
  }

 }



  findUploadedTime = (uploadTime: any) =>{
    const time = new Date();
    const uploadedTime = new Date(uploadTime);
    if(time.getFullYear() === uploadedTime.getFullYear()){
      if(time.getMonth() === uploadedTime.getMonth()){
        if(time.getDate() === uploadedTime.getDate()){
          if(time.getHours() === uploadedTime.getHours()){
            if(time.getMinutes() === uploadedTime.getMinutes()){
                return (time.getSeconds() - uploadedTime.getSeconds()) + ' seconds ago';   
            }else{
              return (time.getMinutes() - uploadedTime.getMinutes()) + ' minutes ago';
            }
          }else{
            return (time.getHours() - uploadedTime.getHours()) + ' hours ago';
          }
        }else{
          return (time.getDate() - uploadedTime.getDate()) + ' days ago';
        }
      }else{
        return (time.getMonth() - uploadedTime.getMonth()) + ' months ago';
      }
    }else{
      return (time.getFullYear() - uploadedTime.getFullYear()) + ' years ago';
    }
  }

}
