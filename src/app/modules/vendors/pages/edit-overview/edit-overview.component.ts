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
  dragging: boolean;
  loaded: boolean;
  imageSrc: any;
  imageLoaded: boolean;
  
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


  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      const pattern = /image-*/;
      const reader = new FileReader();

      if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
      }

      this.loaded = false;
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
  }

}
