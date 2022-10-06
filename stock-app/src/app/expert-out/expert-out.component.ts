import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-expert-out',
  templateUrl: './expert-out.component.html',
  styleUrls: ['./expert-out.component.scss']
})
export class ExpertOutComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  isNoReplies:boolean=true;
  repliesList: any;

  constructor(private userService :UserService) { }

  ngOnInit(): void {

    this.displayAllReplies()
  }

  ngOnDestroy() {
    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    // this.destroy$.complete();
  }

  displayAllReplies(){

    this.userService.expertSpecificConversation().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('expert replies::::', data);
        this.repliesList =data;
        this.repliesList.length==0 ?this.isNoReplies = true : this.isNoReplies = false
      },
      error: (error: any) => { },
      complete: () => {}
    })

    
  }
  dateformatChange(currentdate:any){
    return new Date(currentdate).toISOString().split('T')[0]

  }
}
