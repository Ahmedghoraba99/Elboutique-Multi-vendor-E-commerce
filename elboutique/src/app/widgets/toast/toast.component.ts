import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() title: string = 'Notification';
  @Input() delay: number = 5000;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.close();
    }, this.delay);
  }

  close() {
    const toastElement = document.getElementById('toast');
    if (toastElement) {
      toastElement.classList.remove('show');
    }
  }
}
