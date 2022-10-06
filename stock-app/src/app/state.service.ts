import { Injectable } from '@angular/core';
import { distinctUntilChanged,BehaviorSubject, map, Observable } from 'rxjs';


const INITIAL_STATE: IState = {
    token: '',
    isAdmin: false,
    isExpert :false,
    isUser :false,
    user_name : '',
    emailid:''
  };


@Injectable({
    providedIn: 'root'
  })


  export class StateService {

    private _state = new BehaviorSubject<IState>(INITIAL_STATE);

    current_state = this._state.asObservable(); 

    protected get state(): IState {
        return this._state.getValue();
      }

    //   protected select<K>(mapFn: (state: IState) => K): Observable<K> {
    //     return this._state.asObservable().pipe(
    //       map((state: IState) => mapFn(state)),
    //       distinctUntilChanged()
    //     );
    //   }

       setState(newState: Partial<IState>) {
        this._state.next({
          ...this.state,
          ...newState,
        });
  }
}


  export interface IState {
    token: string;
    isAdmin: Boolean;
    isExpert :Boolean;
    isUser :Boolean;
    user_name :string;
    emailid :string;
  }