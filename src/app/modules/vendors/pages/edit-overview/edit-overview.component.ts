import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetailsService } from '../../services/userDetails.service';
import { IsModalService, IsModalSize } from 'app/lib/modal';
import { LocationSelectorComponent } from '../../modal/location-selector/location-selector/location-selector.component';

@Component({
  selector: 'edit-overview',
  templateUrl: './edit-overview.component.html',
  styleUrls: ['./edit-overview.component.scss']
})
export class EditOverviewComponent implements OnInit {
  overviewForm: FormGroup;
  @Output() overviewEdited: EventEmitter<any> = new EventEmitter();
  @Output() overviewEditedCancelled: EventEmitter<any> = new EventEmitter();
  
  constructor(private userDetailsService: UserDetailsService,
      private modal: IsModalService) { }

  ngOnInit() {
    this.overviewForm = new FormGroup({
      welcomeParagraph: new FormControl(null, [Validators.required]),
      phoneOne: new FormControl(null, [Validators.required]),
      phoneTwo: new FormControl(null),
      email: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]), 
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required])
    })
  }

  submitHandler(){
    let overviewData = {
      welcomeParagraph: this.overviewForm.get('welcomeParagraph').value,
      contact: {
        phone: [this.overviewForm.get('phoneOne').value, this.overviewForm.get('phoneTwo').value],
        email: [this.overviewForm.get('email').value]
      },
      openingStatus: {
        start: this.overviewForm.get('startTime').value,
        end: this.overviewForm.get('endTime').value
      }
    }
    let id = localStorage.getItem('user');
    this.userDetailsService.addUserOverview(id, overviewData).pipe().subscribe(overview => {
      console.log('Response is : ', overview)
      this.overviewEdited.emit(null);
    })
    this.overviewForm.reset();
  }
  cancelEditing(){
    this.overviewForm.reset()
    this.overviewEditedCancelled.emit(null);
  }
  onLocationTouch(){
    this.modal.open(LocationSelectorComponent, {
      size: IsModalSize.Large
    });
  }

}
