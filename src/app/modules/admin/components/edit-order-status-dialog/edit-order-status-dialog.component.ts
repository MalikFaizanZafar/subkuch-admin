import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IsModalService, IsActiveModal, IsButton } from 'app/lib';
@Component({
  selector: 'edit-order-status-dialog',
  templateUrl: './edit-order-status-dialog.component.html',
  styleUrls: ['./edit-order-status-dialog.component.scss']
})
export class EditOrderStatusDialogComponent implements OnInit {
  editStatusForm : FormGroup;
  constructor(private isActiveModel: IsActiveModal) { }

  ngOnInit() {
    this.editStatusForm = new FormGroup({
      status: new FormControl(this.isActiveModel.data.status, [Validators.required])
    });
  }

  onEditOrderStatusSubmit( btn : IsButton){
    if(this.editStatusForm.valid){
      let statusVal = this.editStatusForm.value;
      let newStatus = statusVal.status
      btn.startLoading()
      this.isActiveModel.close(newStatus)
      btn.stopLoading()
    }
  }

}
