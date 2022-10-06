import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { PeriodicElement } from '../adminpage/adminpage.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-expertpage',
  templateUrl: './expertpage.component.html',
  styleUrls: ['./expertpage.component.scss']
})
export class ExpertpageComponent implements OnInit {

  displayedColumns: string[] = ['No', 'Name', 'Email', 'DOB', 'Created On', 'minus'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.displayAllExperts();
  }

  ngOnDestroy() {

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  displayAllExperts() {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (data: any) => {
          console.log('allusers::::', data);
          let expData = data.response.filter((usr: any) => usr.admin == "11");
          this.dataSource = new MatTableDataSource<PeriodicElement>(expData);


        },
        error: (error: any) => { },
        complete: () => {

          this.getAllStarRatings()
        }
      })
  }


  getAllStarRatings() {
    this.userService.getAllStars().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (data: any) => {
          console.log('allstars::::', data);
          this.findAvgStars(data.response);
        },
        error: (error: any) => { },
        complete: () => { }
      })
  }


  findAvgStars(stardata: any) {
    let newlistuser:any=[];
    stardata.forEach((element:{ expertid: string,rating:number } )=> {

      let totalrating =0;
      let totalreply=0;

      if(!(element.expertid in newlistuser)){

        stardata.forEach((ele:{ expertid: string,rating:number } )=> {
          
          if(element.expertid = ele.expertid){

            totalrating+=ele.rating
            totalreply+=1
          }
       });
       newlistuser.push(element.expertid)
      }
      
    });

    console.log('newlistuser',newlistuser);
    

  }




}
