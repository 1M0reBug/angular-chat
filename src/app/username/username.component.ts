import {Component, OnInit, Input, EventEmitter, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent implements OnInit {

  @Input() initialName: string;
  @Output() changedName = new EventEmitter<string>();

  private name: string;
  private isEditing: boolean = false;
  private newName: string;

  constructor() { }

  ngOnInit() {
    this.name = this.initialName;
    this.newName = this.initialName;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialName']) {
      const newName = changes['initialName'].currentValue;
      this.name = newName;
      this.newName = newName;
    }
  }

  onClick() {
    this.isEditing = !this.isEditing;
  }

  onSubmit() {
    console.log('onSubmit');
    this.name = this.newName;
    this.changedName.emit(this.name);
    this.isEditing = false;
  }

}
