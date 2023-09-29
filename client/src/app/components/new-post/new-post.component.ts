import { HttpClient } from '@angular/common/http';
import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import * as uuid from 'uuid';


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent  implements OnInit{

  isUploading:boolean = false;

  userId = localStorage.getItem('userId');
  username = localStorage.getItem('username');
  profilePic = localStorage.getItem('profilePic');

  title: string = '';
  description: string = '';
  thumbnailFile:any = null;
  videoFile: any = null; 

  
  constructor(private storage: Storage, private http: HttpClient, private route: Router){}
  
  ngOnInit(): void {
  }

  handleVideoFileChange(event: any){
    this.videoFile = event.target.files[0];
  }

  handleThumbnailFileChange(event: any){
    this.thumbnailFile = event.target.files[0];
  }

  async handleUpload(){


    this.isUploading = true;
    const videoPath  = uuid.v4();
    const videoFileRef = ref(this.storage, videoPath);
    const videoTask = await uploadBytes(videoFileRef, this.videoFile);
    const videoUrl = await getDownloadURL(videoFileRef);

    const thumbnailPath  = uuid.v4();
    const thumbnailFileRef = ref(this.storage, thumbnailPath);
    const thumbnailTask = await uploadBytes(thumbnailFileRef, this.thumbnailFile);
    const thumbnailUrl = await getDownloadURL(thumbnailFileRef);



    this.http.post<any>('http://localhost:6001/createPost', {userId: this.userId, userName: this.username, userPic: this.profilePic, video: videoUrl, thumbnail: thumbnailUrl, title: this.title, description: this.description, uploadTime: new Date()}).subscribe(
      (response: any)=>{
        this.isUploading = false;
        this.title = ''
        this.description = '';
        this.videoFile = null;
        this.thumbnailFile = null;

        this.closeBox('close');
        alert("File uploaded successfully!!");


      }, (error)=>{
        alert("upload failed!!");
      }
    )

  }
  
  @Output() newPostCloseEvent = new EventEmitter<string>();


  closeBox(event: string) {
    this.newPostCloseEvent.emit(event);
  }


}
