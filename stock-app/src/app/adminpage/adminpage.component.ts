import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DialogboxComponent } from 'src/app/dialogbox/dialogbox.component';
import { UserService } from '../user.service';
// import { DialogboxComponent } from 'src/app/dialogbox/dialogbox.component';


@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss']
})
export class AdminpageComponent implements AfterViewInit {

  roles: any[] = [  
    {name: 'Admin', value: '00'},  
    {name: 'User', value: '01'},
    {name: 'Expert', value: '11'}
  ];  
  displayedColumns: string[] = ['No', 'Name', 'Email','DOB', 'Role','Created On','minus'];
  dataSource = new MatTableDataSource<PeriodicElement>();
 
  destroy$: Subject<boolean> = new Subject<boolean>();
  dataLength: any;
 
  
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private userService :UserService) { }

    @ViewChild(MatPaginator)
  paginator!: MatPaginator;




  ngOnInit(): void {
  }
  ngAfterViewInit() {

    this.displayAllUsers();
    
    // this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  openDialog(new_value :any,public_id:string) {
    const dialogRef = this.dialog.open(DialogboxComponent);
    console.log(new_value);
    let new_role =[ {name: 'admin', value: new_value}]
    console.log(new_role[0]);
    

    dialogRef.afterClosed().subscribe(result => {
      this.userService.userRoleUpgrade(new_role[0],public_id).pipe(takeUntil(this.destroy$)).subscribe(
        {next: (data: any) => { 
          console.log('allusers::::', data);
          // this.dataSource = new MatTableDataSource<PeriodicElement>(data.response);
        },
        error: (error: any) => { },
        complete: () => {}
      })

      console.log(`Dialog result: ${result}`);
    });
  }

  displayAllUsers(){

    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('allusers::::', data);
        this.dataLength =data.response.length;
        this.dataSource = new MatTableDataSource<PeriodicElement>(data.response);
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => { },
      complete: () => {}
    })

  }

  deleteUser(publicid:string){
    this.userService.userDelete(publicid).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('allusers::::', data);
        this.displayAllUsers();
      },
      error: (error: any) => { },
      complete: () => {}
    })
  }
}

export interface PeriodicElement {
  name: string;
  emailid: string;
  admin: string;
  dob: string;
  address :string;
  created_on : string;
  public_id :string;
}

// address: "Asdfgxcbv fd"
// admin: "00"
// created_on: "Fri, 19 Aug 2022 19:38:20 GMT"
// dob: "Tue, 11 Aug 1998 00:00:00 GMT"
// emailid: "admin@abc.com"
// name: "Admin"
// public_id: "9be3ca77-3bb6-46ef-862e-44f4a7fbeced"


// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];