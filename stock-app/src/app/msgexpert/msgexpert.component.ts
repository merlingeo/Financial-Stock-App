import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StarRatingColor } from '../star-rating/star-rating.component';
import { StateService } from '../state.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-msgexpert',
  templateUrl: './msgexpert.component.html',
  styleUrls: ['./msgexpert.component.scss']
})
export class MsgexpertComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  rating:number = 0;
  starCount:number = 5;
  starColor:StarRatingColor = StarRatingColor.accent;
  starColorP:StarRatingColor = StarRatingColor.primary;
  starColorW:StarRatingColor = StarRatingColor.warn;

  
  queryForm: any;

  conversations: any;
  user_name: any;
  no_msgs =true;

  constructor(private fb: FormBuilder,
    private userService :UserService,
    private stateService: StateService) {

   }

  ngOnInit(): void {

    this.queryForm = this.fb.group({
      "text": ["", [Validators.required]]
    });
    this.getCurrentState();
    this.displayAllConveration();
  }

  onSubmit(){
    console.log(this.queryForm.value);
    // let date =
    let msg = {isUser :true,
    isRepied :false,
    user_name: this.user_name,
    message:this.queryForm.value.text,
    msgdate : new Date().toISOString().slice(0,10) ,
    msgid :'',
    rating :''
  }
  console.log(msg);
  this.userService.addNewConversation(msg).pipe(takeUntil(this.destroy$)).subscribe(
    {next: (data: any) => { 
      console.log('addmsg::::', data);
      this.queryForm.reset();
      this.conversations.push(msg)
     
    },
    error: (error: any) => { },
    complete: () => {}
  })


  }

  onRatingChanged(new_rating: any,msgid:any,index:any){
    console.log(new_rating);
    this.rating = new_rating;
    

    let msgbody ={ rating :new_rating, reply_id :msgid}

    this.userService.giveRating(msgbody).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('allconverastions::::', data);
        this.conversations[index].rating = new_rating;
      },
      error: (error: any) => { },
      complete: () => {}
    })

  }

  displayAllConveration(){

    this.userService.getAllConversations().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('allconverastions::::', data);
        
        this.conversations =data
        if(this.conversations.length!==0){
          this.no_msgs =false
        }

       
      },
      error: (error: any) => { },
      complete: () => {}
    })

  }


  getCurrentState(){
  
    this.stateService.current_state.pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
      console.log('state::::', data);
        this.user_name =data.user_name
    },
    error: (error: any) => { },
    complete: () => {}
  })
  
    }

}




