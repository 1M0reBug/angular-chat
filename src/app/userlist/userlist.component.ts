import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  @Input() author: string;
  @Input() users: Array<string>;

  constructor() { }

  ngOnInit() {
  }

}
