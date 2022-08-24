import { Component, OnInit } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phatak',
  templateUrl: './phatak.component.html',
  styleUrls: ['./phatak.component.css']
})
export class PhatakComponent implements OnInit {

  showForm = true;

  phatakForm = new FormGroup(
    {
      phatakName: new FormControl(''),
      inchargeName: new FormControl(''),
      inchargePhone: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      phatakImage: new FormControl(''),
    }
  );

  phataksList : any[] = [];

  constructor(private firestore: Firestore) { 
    
  }

  // Whenever Angular component comes on screen, init chal rha hai
  ngOnInit(): void {
    // Read Operation
    let collectionRef = collection(this.firestore, "crossings")
  }

  // Create Operation

}
