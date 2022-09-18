import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, onSnapshot, setDoc, Timestamp, GeoPoint } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-phatak',
  templateUrl: './phatak.component.html',
  styleUrls: ['./phatak.component.css']
})
export class PhatakComponent implements OnInit {

  showForm = false;

  phatakForm = new FormGroup(
    {
      phatakName: new FormControl('', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(50), 
        // Validators.pattern(/^[a-z]/g)
      ]),
      inchargeName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      inchargePhone: new FormControl('', [
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      latitude: new FormControl('', [
        Validators.required,
        // Validators.pattern('[0-9]'),
      ]),
      longitude: new FormControl('', [
        Validators.required,
        // Validators.pattern('[0-9]'),
      ]),
      phatakImage: new FormControl('', [

      ]),
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
  async addPhatakToFirebase() {
    if(this.phatakForm.invalid) {
      this.phatakForm.markAllAsTouched();
      console.log("Invalid, can't submit");
      return;
    }

    console.log("Add phatak to firebase");
    console.log(this.phatakForm.value);

    let value: any = {...this.phatakForm.value};

    // value['phatakId'] = value['phatakId']?.length === 0 ? doc(collection(this.firestore, "crossings")).id : value['phatakId']; // null as an id is generated when adding new document
    // console.log(value['phatakId'].length === 0)
    // value['phatakId'] = value['phatakId'] === null || value['phatakId'].length === 0 ? doc(collection(this.firestore, "crossings")).id : value['phatakId'];
    // value['timings'].map((element) => {
    //   element['time'] = Timestamp.fromDate(new Date(element['time']))
    // }) 

    let phatakInfo = {
      phatakId: value['phatakId'] === null || value['phatakId'].length === 0 ? doc(collection(this.firestore, "crossings")).id : value['phatakId'],
      location: new GeoPoint(parseFloat(value['latitude']), parseFloat(value['longitude'])),
      phatakName: value['phatakName'],
      inchargeName: value['inchargeName'],
      inchargePhone: value['inchargePhone'],
      phatakImage: value['phatakImage'],
      status: value['status'],
      timings: value['timings'].map((element) => ({
        trafficStatus: element['trafficStatus'],
        train: element['train'],
        time: Timestamp.fromDate(new Date(element['time'])),
      })) 
    }

    // addDoc(collection(this.firestore, "crossings"), value);

    if(this.tempImg != null) {
      let storageRef = ref(this.storage, 'crossings/' + this.tempImg.name + this.tempImg.lastModified);
      await uploadBytes(storageRef, this.tempImg);
      phatakInfo['phatakImage'] = await getDownloadURL(storageRef);
      console.log(phatakInfo['phatakImage']);
    }


    console.log(">>> Phatak Id: " , value['phatakId']);
    
    let docRef = doc(this.firestore, 'crossings/', phatakInfo['phatakId']);
    setDoc(docRef, phatakInfo)
    .then(()=>{
      alert("Data Saved");
      console.log("Data Saved");
      this.getTimingsArrayFromPhatakForm().clear();
      this.phatakForm.reset({});
      this.showForm = !this.showForm;
    }, (error) => {
      console.error(error);
    })

    // console.log(value)
  }
  
  // Delete Operation
  deletePhatak(phatakId) {
    let docRef = doc(this.firestore, 'crossings/' + phatakId);
    if(confirm("Are you sure to delete this phatak")) {
      console.log("Implement delete functionality here");
      deleteDoc(docRef)
      .then(() => {
        console.log("Deleted Successfully");   
      })
      .catch((error) => {
        console.error(error);
      })
    }
    
  }

  // Update Operation
  updatePhatak(phatak) {
    this.showForm = true;
    
    let datePipe = new DatePipe('en-US');
    // phatak.timings.forEach(element => {
    //   element['time'] = datePipe.transform(element.time.toDate(), 'yyyy-MM-dd HH:mm');
    // });

    // this.phatakForm = new FormGroup({
    //   phatakname: new FormControl(phatak.phatakName),
    //   inchargename: new FormControl(phatak.inchargeName),
    //   inchargephone: new FormControl(phatak.inchargePhone),
    //   latitude: new FormControl(phatak.location[0]),
    //   longitude: new FormControl(phatak.location[1]),
    //   phatakimage: new FormControl(phatak.phatakImage),
    //   phatakId: new FormControl(phatak.phatakId),
    //   status: new FormControl(phatak.status),
    //   timings: new FormArray(phatak.timings.length === 0 ? [] : phatak.timings.map(element => new FormGroup({
    //     time: new FormControl(datepipe.transform(element.time.toDate(), 'yyyy-MM-dd HH:mm')),
    //     trafficStatus: new FormControl(element.trafficStatus),
    //     train: new FormControl(element.train)
    //   })))
    // });

    // this.phatakForm.setValue(
    this.phatakForm.patchValue(
      {
        phatakName: phatak.phatakName,
        inchargeName: phatak.inchargeName,
        inchargePhone: phatak.inchargePhone,
        latitude: phatak.location.latitude,
        longitude: phatak.location.longitude,
        // phatakImage: phatak.phatakImage,
        // phatakImage: this.tempImg,
        phatakId: phatak.phatakId,
        status: phatak.status,
        // timings: new FormArray(phatak.timings.length === 0 ? [] : phatak.timings.map(element => new FormGroup({
        //   // time: new FormControl(datePipe.transform(element.time.toDate(), 'yyyy-MM-dd HH:mm')),
        //   time: new FormControl(element.time),
        //   trafficStatus: new FormControl(element.trafficStatus),
        //   train: new FormControl(element.train)
        // })))
      }
    );

    phatak.timings.forEach(element => {
      this.getTimingsArrayFromPhatakForm().push(new FormGroup({
        time: new FormControl(datePipe.transform(element.time.toDate(), 'yyyy-MM-dd HH:mm')),
        trafficStatus: new FormControl(element.trafficStatus),
        train: new FormControl(element.train)
      }))
    });
  }
}