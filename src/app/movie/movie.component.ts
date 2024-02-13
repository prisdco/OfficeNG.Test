import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


const APIKEY = "da979bab";

const PARAMS = new HttpParams({
  fromObject: {
    action: "opensearch",
    format: "json",
    origin: "*"
  }
});
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  page: number = 1;
  pageSize: number = 10;
  pageSizeArray: Array<number> = []
  currentSearch: string = ""
  @ViewChild('movieSearchInput', { static: true })
  movieSearchInput!: ElementRef;
  apiResponse: any;
  isSearching: boolean;
  movieDetails: any;
  name:string='';
  QueryParam: any = []
  GetQueryParam: any = []
  id: any;
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
        .body.style.backgroundColor = 'white';
}

  constructor(
    private elementRef: ElementRef,
    private httpClient: HttpClient, private route: ActivatedRoute,
  ) {
    this.isSearching = false;
    this.apiResponse = [];
    this.movieDetails = [];
  }


  ngOnInit() {
    
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id != null)
    {
      this.httpClient.get('https://localhost:7119/api/v1/Movie/MovieSearch?title=' + this.id + '&PageNum=' + 1)
      .subscribe(data=> {
      this.apiResponse=data;
      if(this.apiResponse['IsSuccess'] && this.apiResponse['Value'].Search != null)
      {
        this.pageSize = Number(this.apiResponse['Value'].totalResults) / 10

        for(let i=1; i<this.pageSize; i++)
        {
          if(this.pageSizeArray.length < 5)
            this.pageSizeArray.push(i);
        }
      }
    
    
      })

      this.GetQueryParam = localStorage.getItem('movieSearch')?.split(",")
    }

    fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(

      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2)

      // Time in milliseconds between key events
      , debounceTime(1000)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {

      this.isSearching = true;
      
      this.searchGetCall(text).subscribe((res: any) => {
        console.log('res', res);
        this.isSearching = false;
        this.apiResponse = res;

        if(this.apiResponse['IsSuccess'] && this.apiResponse['Value'].Search != null)
        {
          
          this.pageSize = Number(this.apiResponse['Value'].totalResults) / 10
          for(var i=1; i<this.pageSize; i++)
          {
            if(this.pageSizeArray.length < 5)
              this.pageSizeArray.push(i);
          }
        }
      }, (err: any) => {
        this.isSearching = false;
        console.log('error', err);
      });

    });
  }

  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    
    if(this.QueryParam.length == 5)
    {
      this.QueryParam.shift()
    }


    this.QueryParam.push(term)
    this.currentSearch = term
    this.page = 1
    localStorage.setItem("movieSearch", this.QueryParam);
    this.GetQueryParam = localStorage.getItem('movieSearch')?.split(",")
    console.log("NewGetQueryPar " + this.GetQueryParam)
    return this.httpClient.get('https://localhost:7119/api/v1/Movie/MovieSearch?title=' + term + '&PageNum=' + this.page);
  }
  
  ParamSearch(term: string, PageNum: number)
  {
    this.currentSearch = term;
    this.page = PageNum;
    this.httpClient.get('https://localhost:7119/api/v1/Movie/MovieSearch?title=' + term + '&PageNum=' + PageNum)
    .subscribe(data=> {
    this.apiResponse=data;
        
    })

  }

  IncreaseParamSearch(term: string)
  {
    this.currentSearch = term;
    this.page = this.page + 1
    this.httpClient.get('https://localhost:7119/api/v1/Movie/MovieSearch?title=' + term + '&PageNum=' + this.page)
    .subscribe(data=> {
    this.apiResponse=data;
        
    })

  }

}
