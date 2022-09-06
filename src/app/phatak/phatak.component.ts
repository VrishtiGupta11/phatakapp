import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, onSnapshot, setDoc, Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-phatak',
  templateUrl: './phatak.component.html',
  styleUrls: ['./phatak.component.css']
})
export class PhatakComponent implements OnInit {

  showForm = false;

  phatakForm = new FormGroup(
    {
      phatakName: new FormControl(''),
      inchargeName: new FormControl(''),
      inchargePhone: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      phatakImage: new FormControl(''),
      phatakId: new FormControl(''),
      status: new FormControl(),
      timings: new FormArray([])
    }
  );

  phataksList : any[] = [];
  tempImg: any = null;

  constructor(private firestore: Firestore, private storage: Storage) { 
    
  }

  // Whenever Angular component comes on screen, init chal rha hai
  ngOnInit(): void {
    // Read Operation
    let collectionRef = collection(this.firestore, "crossings")

    // Snapshot
    onSnapshot(collectionRef, (value)=>{
      this.phataksList = value.docs.map((e) => ({id: e.id, ...e.data()}));
    }, (error) => {
      console.error(error);
    })

    // getDocs(collectionRef).then((value) => {
    //   // console.log()
    //   this.phataksList = value.docs.map((e) => ({id: e.id, ...e.data()}));
    // })
  }

  getTimingsArrayFromPhatakForm() {
    return this.phatakForm.get('timings') as FormArray;
  }

  addTimingsDetailToPhatak() {
    this.getTimingsArrayFromPhatakForm().push(new FormGroup({
      time: new FormControl(''),
      trafficStatus: new FormControl(''),
      train: new FormControl('')
    }))
  }

  removeTimingsDetailFromPhatak(idx: any) {
    this.getTimingsArrayFromPhatakForm().removeAt(idx);
  }

  selectImage(event) {
    console.log(">>>event", event);
    // Array of files
    console.log(">>>Files", event.target.files);
    this.tempImg = event.target.files[0];
  }

  // Create Operation
  addPhatakToFirebase() {
    console.log("Add phatak to firebase");
    console.log(this.phatakForm.value);
    let value: any = {...this.phatakForm.value};
    // value['phatakId'] = value['phatakId']?.length === 0 ? doc(collection(this.firestore, "crossings")).id : value['phatakId']; // null as an id is generated when adding new document
    console.log(value['phatakId'].length === 0)
    value['phatakId'] = value['phatakId'] === null || value['phatakId'].length === 0 ? doc(collection(this.firestore, "crossings")).id : value['phatakId'];
    value['timings'].map((element) => {
      element['time'] = Timestamp.fromDate(new Date(element['time']))
    }) 

    // addDoc(collection(this.firestore, "crossings"), value);

    // if(this.tempImg != null) {
    //   let storageRef = ref(this.storage, 'crossings/' + this.tempImg.name);
    //   await uploadBytes(storageRef, this.tempImg);
    //   value['phatakImage'] = await getDownloadURL(storageRef);
    //   alert(value['phatakImage']);
    // }
    console.log(">>> Phatak Id: " , value['phatakId']);
    
    let docRef = doc(this.firestore, 'crossings/', value['phatakId']);
    setDoc(docRef, value)
    .then(()=>{
      console.log("Data Saved");
      this.phatakForm.reset();
      this.showForm = !this.showForm;
    }, (error) => {
      console.error(error);
    })

    console.log(value)
  }
  
  // Delete Operation
  deletePhatak(phatakId) {
    let docRef = doc(this.firestore, 'crossings/' + phatakId);
    deleteDoc(docRef)
    .then(() => {
      console.log("Deleted Successfully");   
    })
    .catch((error) => {
      console.error(error);
    })
  }

  // Update Operation
  updatePhatak(phatak) {
    this.showForm = true;
    
    // let datePipe = new DatePipe('en-US');
    // phatak.timings.forEach(element => {
    //   element['time'] = datePipe.transform(element.time.toDate(), 'yyyy-MM-dd HH:mm');
    // });

    // this.phatakForm.setValue(
    this.phatakForm.patchValue(
      {
        phatakName: phatak.phatakName,
        inchargeName: phatak.inchargeName,
        inchargePhone: phatak.inchargePhone,
        latitude: phatak.latitude,
        longitude: phatak.longitude,
        phatakImage: phatak.phatakImage,
        phatakId: phatak.phatakId,
        status: phatak.status,
        timings: phatak.timings,
      }
    );
  }
}