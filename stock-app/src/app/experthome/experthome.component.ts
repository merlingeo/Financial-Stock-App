import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-experthome',
  templateUrl: './experthome.component.html',
  styleUrls: ['./experthome.component.scss']
})
export class ExperthomeComponent implements OnInit {

  isNoMessage:boolean=true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  unansweredList: any;
  replyForm: any;
  isreplysubmitted: boolean=false;

  constructor(private userService :UserService,private fb: FormBuilder,) { }

  ngOnInit(): void {

    this.replyForm = this.fb.group({
      "reply": ["", [Validators.required]]
    });
    
    this.displayAllUnansweredQuestions();
  }
  ngOnDestroy() {
    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    // this.destroy$.complete();
  }

  displayAllUnansweredQuestions(){

    this.userService.getAllUnansweredQstn().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('allunanswered users::::', data);
        this.unansweredList =data;
        this.unansweredList.length==0 ?this.isNoMessage = true : this.isNoMessage = false
      },
      error: (error: any) => { },
      complete: () => {}
    })

  }

  dateformatChange(currentdate:any){
    return new Date(currentdate).toISOString().split('T')[0]

  }
  onSubmit(msgid:any,index:any){
    console.log(this.replyForm.value);

    let msg = {isUser :false,
      isRepied :true,
      reply:this.replyForm.value.reply,
      msgid : msgid,
      replydate : new Date().toISOString().slice(0,10)
      
    }
    console.log(msg);
    this.userService.addNewReply(msg).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('addmsg::::', data);
        this.isreplysubmitted =true;
        this.replyForm.reset();
        this.unansweredList.splice(index,1)
      },
      error: (error: any) => { },
      complete: () => {}
    })
  }

}
0