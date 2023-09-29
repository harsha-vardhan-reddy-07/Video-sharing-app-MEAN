import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  searchText: string = '' 

  videos: any[] = [];

  constructor( private http: HttpClient, private route: Router, private paramsRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const param :any = this.paramsRoute.snapshot.paramMap;
    this.searchText = param.params['text'];

    console.log(this.searchText);
    // this.fetchUserData();
    this.fetchVideos();
  }

  // fetch videos

  fetchVideos = async() =>{

    this.http.get<any>(`http://localhost:6001/fetch-videos`).subscribe(
      async (response)=>{
        this.videos= await response.filter((video:any)=> video.title.includes(this.searchText) || video.description.includes(this.searchText) || video.userName.includes(this.searchText)).reverse();
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
