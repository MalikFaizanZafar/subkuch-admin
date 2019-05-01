import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews=[
    {
      name : "Jafer Bin Shamshad",
      photo: "https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg",
      comment: "This is a sample comment . It holds no meaning and it is only written here to just fill up space for some text. But its nice to know that you have read the whole comment seriously ",
      date: "27-05-2019",
      rating: 3
    },
    {
      name : "Faiq Farhan",
      photo: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      comment: "This is a sample comment . It holds no meaning and it is only written here to just fill up space for some text. But its nice to know that you have read the whole comment seriously ",
      date: "17-05-2019",
      rating: 4
    }, {
      name : "Mohsin Latif",
      photo: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
      comment: "This is a sample comment . It holds no meaning and it is only written here to just fill up space for some text. But its nice to know that you have read the whole comment seriously ",
      date: "07-05-2019",
      rating: 5
    },{
      name : "Osama Bin Abid",
      photo: "https://images.pexels.com/photos/555790/pexels-photo-555790.png",
      comment: "This is a sample comment . It holds no meaning and it is only written here to just fill up space for some text. But its nice to know that you have read the whole comment seriously ",
      date: "27-04-2019",
      rating: 2
    },{
      name : "Kuldeep Kumar",
      photo: "https://images.pexels.com/photos/462680/pexels-photo-462680.jpeg",
      comment: "This is a sample comment . It holds no meaning and it is only written here to just fill up space for some text. But its nice to know that you have read the whole comment seriously ",
      date: "17-04-2019",
      rating: 4
    },{
      name : "Mazhar Hussain",
      photo: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
      comment: "This is a sample comment . It holds no meaning and it is only written here to just fill up space for some text. But its nice to know that you have read the whole comment seriously ",
      date: "27-03-2019",
      rating: 5
    }
  ]
  constructor() { }

  ngOnInit() {
    
  }

}
