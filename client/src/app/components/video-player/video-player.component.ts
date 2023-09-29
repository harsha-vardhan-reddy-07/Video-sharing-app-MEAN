import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {

  userId = localStorage.getItem('userId');
  username = localStorage.getItem('username');
  
  videoId: string = '';
 
  video: any = null;

  isLiked: boolean = false;

  isVideoAvailable: boolean = false;
  videos: any[] = [];

  comments: any[] = [];

  newComment: string = '';



  constructor(private http: HttpClient, private route: Router, private paramsRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const param :any = this.paramsRoute.snapshot.paramMap;
    this.videoId = param.params['id'];

    this.fetchVideo();
    this.fetchRelatedVideos();
    this.addView();
    this.fetchComments();
  }



  
   // fetch video

   fetchVideo = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-video/${this.videoId}`).subscribe(
      async (response)=>{
        this.video= await response;
        this.isVideoAvailable = true;
        if(response.likes.includes(this.userId)){
          this.isLiked = true
        }else{
          this.isLiked = false;
        }
      }
    )
  }


  
   // fetch videos

   fetchRelatedVideos = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-videos`).subscribe(
      async (response)=>{
        this.videos= await response.filter((video:any)=> video.userId === this.video.userId ).reverse();
      }
    )
  }



  // add view

  addView = async() =>{

    this.http.get<any>(`http://localhost:6001/add-view/${this.videoId}`).subscribe(
      async (response)=>{

      }
    )
  }



  // add Like

  addLike = async() =>{

    this.http.post<any>(`http://localhost:6001/add-like`, {videoId: this.videoId, userId: this.userId}).subscribe(
      async (response)=>{
        this.isLiked = true
      }
    )
  }


  // remove Like

  removeLike = async() =>{

    this.http.post<any>(`http://localhost:6001/remove-like`, {videoId: this.videoId, userId: this.userId}).subscribe(
      async (response)=>{
        this.isLiked = false
      }
    )
  }


  shareURL = async () => {
    try {
      await navigator.share({
        title: 'Share this video',
        text: 'Check out this awesome video!',
        url: window.location.href, // Replace with your actual URL
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


  // save post

  savePost = async() =>{

    this.http.post<any>(`http://localhost:6001/save-post`, {videoId: this.videoId, userId: this.userId}).subscribe(
      async (response)=>{
        alert('Post saved')
      }
    )
  }


   // fetch comments

   fetchComments = async() =>{

    this.http.post<any>(`http://localhost:6001/fetch-comments`, {videoId: this.videoId}).subscribe(
      async (response)=>{
        this.comments= await response.reverse();
      }
    )
  }

  // new comment

  addComment = async() =>{

    this.http.post<any>(`http://localhost:6001/add-comment`, {videoId: this.videoId, comment: {username: this.username, comment: this.newComment}}).subscribe(
      async (response)=>{
        this.fetchComments();
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
