import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { GroupContainerComponent } from '../group-container/group-container.component';
import { MessageContainerComponent } from '../message-container/message-container.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent, GroupContainerComponent, MessageContainerComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
