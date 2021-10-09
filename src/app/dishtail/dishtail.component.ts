import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";
import { visibility } from '../animations/app.animation';


@Component({
  selector: 'app-dishtail',
  templateUrl: './dishtail.component.html',
  styleUrls: ['./dishtail.component.scss'],
  animations: [
    visibility()
  ]
})
export class DishtailComponent implements OnInit {
  
    dish?: any |null;
    dishIds: string[]=new Array();
    prev!: string;
    next!: string;
    
    comments!: Comment[];
    comment!: Comment;

    commentForm!:FormGroup;
    
    @ViewChild('fform') commentFormDirective:any;
  
    errMess!: string;
  
    dishcopy!:any | null;

    visibility = 'shown';

    formErrors:any={
      'author':'',
      'comment':''
    };

      validationMessages:any={
        'author':{
          'required': 'Name is required',
          'minlength': 'Name must be at least 2 characters long.',
        },
        'comment':{
          'required': 'Comment is required'

        },
      };

      

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb:FormBuilder,
    @Inject('BaseURL') public BaseURL:any) {
      this.createForm();
      this.route.params.pipe(switchMap((params:Params)=>this.dishservice.getDish(params['id'])))
      .subscribe(dish=>{this.dish=dish; this.dishcopy=dish; this.setPrevNext(dish.id);},
      errmess=>this.errMess=<any>errmess);
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
        errmess => this.errMess = <any>errmess);
     }


    formatLabel(value: number) {
      
      return 5;
    }
  ngOnInit(): void {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);
      this.route.params
      .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
    
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
   //console.log(this.dishIds+'' +dishId+'' +this.dishIds.indexOf(dishId) +"\n");
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }


  createForm():void{

    this.commentForm=this.fb.group({
      rating: 5,
      comment: ['',[Validators.required,Validators.minLength(2)]],
      author: ['',[Validators.required,Validators.minLength(2)]],
      date: new Date().toISOString()
    });
  

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged();
  }

  onSubmit(){
    this.comment=this.commentForm.value;
    //console.log(this.comment);
    this.dish.comments.push(this.comment);
    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: '',
      date: new Date().toISOString()
    });
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
   
  }


  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
