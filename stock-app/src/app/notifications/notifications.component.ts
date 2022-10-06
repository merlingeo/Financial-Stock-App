import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StateService } from '../state.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  unansweredList: any;
  isNoMessage: boolean = false;
  stateData: any;
  notificationMsg: string = "You don't have any notifications."

  constructor(private userService: UserService, private stateService: StateService) { }
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.getCurrentState()
    this.displayAllUnansweredQuestions()
  }

  displayAllUnansweredQuestions() {

    this.userService.getAllUnansweredQstn().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (data: any) => {
          console.log('allunanswered users::::', data);
          this.unansweredList = data;


          if (this.unansweredList.length != 0) {
            if (this.stateData.isUser) {
              let msgCount = 0;
              this.unansweredList.forEach((element: any) => {
                if (element.user_email == this.stateData.emailid)
                  msgCount += 1
              });
              msgCount==0? this.notificationMsg : this.notificationMsg = "Your " + msgCount + " messages will be answered by the experts soon!." 
            } if (this.stateData.isAdmin) {
              this.notificationMsg = "Experts have " + this.unansweredList.length + " messages to answer."
            } if (this.stateData.isExpert) {
              this.notificationMsg = "You have " + this.unansweredList.length + " messages to attend."
            }
          } 
        },
        error: (error: any) => { },
        complete: () => { }
      })

  }
  getCurrentState() {
    this.stateService.current_state.pipe(takeUntil(this.destroy$)).subscribe((data) => {

      this.stateData = data;

    })
  }
}
