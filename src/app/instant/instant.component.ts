import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instant',
  templateUrl: './instant.component.html',
  styleUrls: ['./instant.component.css']
})
export class InstantComponent implements OnInit {

  constructor() { }

  rightSideMenus: any = [];

  ngOnInit(): void {
  }

  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }

}
