import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username = "";
  Password = "";
  constructor( private router: Router) { }

  doSomething(event : Event)
  {
    console.log(event);
  }

  ngOnInit() {
  }

}
