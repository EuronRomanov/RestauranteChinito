import { Component, OnInit , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from "../shared/leader";
import { LeaderService } from "../services/leader.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dish!: Dish;
  promotion!: Promotion;
  leader!: Leader;
 //BaseURL!:string;
 errMess!: string;
 errLeader!: string;
 errPromo!: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,
    @Inject('BaseURL') public BaseURL:string) { 
     // this.BaseURL=baseURL;
    }

  ngOnInit(): void {
     this.dishservice.getFeaturedDish().subscribe(dish=>this.dish=dish,
      errmess => this.errMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion().subscribe(promotion=>this.promotion =promotion,
      errleader => this.errLeader = <any>errleader);
     this.leaderservice.getFeaturedLeader().subscribe(leader=>this.leader=leader,
      errpromo=> this.errPromo = <any>errpromo);
  }

}
