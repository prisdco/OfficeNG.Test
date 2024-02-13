import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const APIKEY = "da979bab";

const PARAMS = new HttpParams({
  fromObject: {
    action: "opensearch",
    format: "json",
    origin: "*"
  }
});

@Component({
  selector: 'app-moviedetail',
  templateUrl: './moviedetail.component.html',
  styleUrls: ['./moviedetail.component.css']
})
export class MoviedetailComponent implements OnInit {

  apiResponse: any;
  movieDetails: any = "";
  id: any;
  GetQueryParam: any = []

  constructor(
    private httpClient: HttpClient, private router: Router, private route: ActivatedRoute,
  ) {
    this.GetQueryParam = localStorage.getItem('movieSearch')?.split(",")
    console.log("GetQueryParam " + this.GetQueryParam)
  }
  ngOnInit(): void {

      this.id = this.route.snapshot.paramMap.get('id');
      if(this.id != null)
      {
          this.httpClient.get('https://localhost:7119/api/v1/Movie/MovieSearch?id=' + this.id)
          .subscribe(data=> {
          console.log('details', data);
          this.movieDetails=data;
      })
  }
  }



}
