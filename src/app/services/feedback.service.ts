import { Injectable } from '@angular/core';
import { Feedback } from "../shared/feedback";
import { Observable,of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService} from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService) { }
  
 
    getFeedbacks():Observable<Feedback[]>{
      return this.http.get<Feedback[]>(baseURL + 'feedback')
    }

    putFeedback(feedback:Feedback):Observable<Feedback>{
      const httpOptions={
        headers: new HttpHeaders({
          'Content-Type':'application/json'
        })
      };

     
      return this.http.put<Feedback>(baseURL+'feedback/'+feedback.id,feedback, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
    }

    postFeedback(feedback:Feedback):Observable<Feedback>{
      const httpOptions={
        headers:new HttpHeaders({
          'Content-Type':'application/json'
        })
      };
      return this.http.post<Feedback>(baseURL+'feedback/', feedback,httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
