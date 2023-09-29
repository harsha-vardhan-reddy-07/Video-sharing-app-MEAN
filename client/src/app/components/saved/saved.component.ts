import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit{



  userId = localStorage.getItem('userId');
  

  userData: any = null;
  videosCount: number = 0;

  navOption: string = 'Home';

  videos: any[] = [];

  savedVideos: any[] = [];
  likedVideos: any[] = [];

  constructor(private http: HttpClient, private route: Router) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchVideos();
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
        this.videos= await response.reverse();
        this.savedVideos= await response.filter((video:any)=> this.userData.savedPosts.includes(video._id)).reverse();
        this.likedVideos= await response.filter((video:any)=> this.userData.likedPosts.includes(video._id)).reverse();
      }
    )
  }


  // unsave post
  unsavePost = async(videoId: any) =>{
    this.http.post<any>('http://localhost:6001/unsave-post', {videoId, userId: this.userId}).subscribe(
      (response)=>{
        alert('Video removed from saved list successfully!!');
        this.fetchVideos();
        this.fetchUserData();
      }
    )
  }

  // remove like
  removeLike = async(videoId: any) =>{
    this.http.post<any>('http://localhost:6001/remove-like', {videoId, userId: this.userId}).subscribe(
      (response)=>{
        alert('Video unliked successfully!!');
        this.fetchVideos();
        this.fetchUserData();
      }
    )
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
