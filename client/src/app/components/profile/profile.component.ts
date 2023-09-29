import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import * as uuid from 'uuid';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  profileId: string = '';
  
  userId = localStorage.getItem('userId');
  
 
  userData: any = null;
  videosCount: number = 0;

  navOption: string = 'Home';

  videos: any[] = [];

  popularVideos: any[] = [];

  userTitle: string = '';
  userDesc: string = '';

  file:any = null;

  isUploading: boolean = false;
  uploadProgress = 0; 



  constructor(private storage: Storage, private http: HttpClient, private route: Router, private paramsRoute: ActivatedRoute) {}
  
  
  ngOnInit(): void {
    const param :any = this.paramsRoute.snapshot.paramMap;
    this.profileId = param.params['id'];

    this.fetchUserData();
    this.fetchVideos();
  }





  


  fetchUserData = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-user/${this.profileId}`).subscribe(
      (response)=>{
        this.userData = response;
        console.log(response);
        this.userTitle = response.username;
        this.userDesc = response.description;

      }
    )

  }


   // fetch videos

   fetchVideos = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-videos`).subscribe(
      async (response)=>{
        this.videos= await response.filter((video:any)=> video.userId === this.profileId).reverse();
        this.videosCount= await response.filter((video:any)=> video.userId === this.profileId).length;
        this.popularVideos= await response.filter((video:any)=> video.userId === this.profileId).sort((a:any,b:any)=> b.views - a.views );
        console.log(this.videos);
        console.log(this.popularVideos);
      }
    )
  }



 

  
  // follow user

  followUser = async() =>{

    this.http.post<any>(`http://localhost:6001/follow-user`, {userId: this.userId, channelId: this.profileId}).subscribe(
      (response)=>{
        alert('Successfully followed!!');
        this.fetchUserData();
      }
    )

  }

  // unfollow user

  unFollowUser = async() =>{

    this.http.post<any>(`http://localhost:6001/unfollow-user`, {userId: this.userId, channelId: this.profileId}).subscribe(
      (response)=>{
        alert('Successfully unfollowed!!');
        this.fetchUserData();
      }
    )
  }


  // delete video
  deleteVideo = async(videoId: any) =>{
    this.http.post<any>('http://localhost:6001/delete-video', {videoId}).subscribe(
      (response)=>{
        alert('Video deleted successfully!!');
        this.fetchVideos();
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




  // Updating user data

  handleFileChange(event: any){
    this.file = event.target.files[0];
  }


  async handleUpdate(){

    if(this.file){

          this.isUploading = true;
          const path  = uuid.v4();
          const fileRef = ref(this.storage, path);
          const task = await uploadBytes(fileRef, this.file);
          const url = await getDownloadURL(fileRef);
          
          this.http.post<any>('http://localhost:6001/update-user', {userId: this.userId, title: this.userTitle, description: this.userDesc, ProfilePicUpdate: 'yes', profilePic: url}).subscribe(
            (response: any)=>{
              this.isUploading = false;
      
              this.file = null;
      
              alert("Updated!!");
      
            }, (error: any)=>{
              alert("Update failed!!");
            }
          )
    }else{

        this.http.post<any>('http://localhost:6001/update-user', {userId: this.userId, title: this.userTitle, description: this.userDesc, ProfilePicUpdate: 'no', profilePic: ''}).subscribe(
          (response: any)=>{
    
            alert("Updated!!");
    
          }, (error: any)=>{
            alert("Update failed!!");
          }
        )

    }


  }



  logout(){
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    this.route.navigate(['/']);
  }

}
