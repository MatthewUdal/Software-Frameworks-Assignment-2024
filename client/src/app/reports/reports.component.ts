import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Report } from '../interfaces/report.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {

  reportedUsers: Report[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getReportedUsers()
  }

  getReportedUsers(): void {
    this.http.get<Report[]>('http://localhost:3000/reports').subscribe(
      (reports) => {
        this.reportedUsers = reports;
        console.log('Reported Users:', this.reportedUsers);
      },
      (error) => {
        console.error('Error loading reported users:', error);
      }
    );
  }

  ignore(reportID: string): void{
    this.http.post('http://localhost:3000/reports/ignore', { reportID })
      .subscribe(response => {
        console.log('User report ' + response + 'ID deleted successfully');
        this.getReportedUsers()
      }, error => {
        console.error('Error deleting report:', error);
      });
  }

  deleteUser(userID: string): void{
    this.http.post('http://localhost:3000/deleteUser', { userID })
    .subscribe(response => {
      console.log(response);
      this.getReportedUsers()
    }, error => {
      console.error('Error deleting user:', error);
    });
  }

}
