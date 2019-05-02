import { Component, OnInit } from '@angular/core';
import { IsActiveModal } from '../../../../lib';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  message: string;
  title?: string;

  constructor(private modal: IsActiveModal) { }

  ngOnInit() {
    this.title = this.modal.data.title;
    this.message = this.modal.data.message;
  }

  close(action: string) {
    this.modal.close(action);
  }

}
