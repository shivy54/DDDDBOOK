import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput, Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from '../config'




export default class Transaction extends Component {
    constructor(){
        super();
        this.state = {
            hasCameraPermissions:null,
            scannedBookId:'',
        scannedStudentId:'',
            scanned:false,
            scannedData:'',
            ButtonState:'normal'
        }
    }
    getCameraPermission=async(id)=>{
        const {status}  = await Permissions.askAsync(Permissions.CAMERA);


        this.setState({
            hasCameraPermission:status === "granted",
            ButtonState: id,
            scanned: false
        });
    }

    handleBarCodeScanned = async({type, data})=>{
    const {ButtonState} = this.state
    if(buttonState === 'BookId'){
        this.setState({
            scanned:true,
            scannedData:data,
            ButtonState: 'normal',
        })
      }else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          ButtonState: 'normal'
        });
      }

    }







initiateBookIssue = async()=>{
  // add transaction(borrow data)
db.collection("transaction").add({
  'studentId' : this.state.scannedStudentId,
  'bookId' : this.state.scannedBookId,
  'data' : firebase.firestore.Timestamp.now().toDate(),
      'transactionType' : "Issue"
    })
    //Changing book staus from true to false
    db.collection("Books").doc(this.state.scannedBookId).update({
      'bookAvailability' : false
    })
    //Changing number of issue boook for student +1
    db.collection("Students").doc(this.state.scannedStudentId).update({
      'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
    })
    this.setState({
      scannedStudentId : '',
      scannedBookId: ''
    })
}//Function over






initiateBookReturn = async ()=>{
  //add a transaction
  db.collection("transactions").add({
    'studentId' : this.state.scannedStudentId,
    'bookId' : this.state.scannedBookId,
    'date'   : firebase.firestore.Timestamp.now().toDate(),
    'transactionType' : "Return"
  })

  //Change book status
  db.collection("Books").doc(this.state.scannedBookId).update({
    'bookAvailability' : true
  })
  //changing number of books issue for said student -1
  db.collection("students").doc(this.state.scannedStudentId).update({
    'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
  })

  this.setState({
    scannedStudentId : '',
    scannedBookId : ''
  })
}//function over









    handleTransaction = async()=>{
      var transactionMessage = null;
      //.collecton refers to the collection tab in the databse 
      db.collection("Books").doc(this.state.scannedBookId).get()
      .then((doc)=>{
        var book = doc.data()
        //below the if co dition will check for tru and false as the varible data as it is left alone nothing t be compared with
        if(book.bookAvailability){
          this.initiateBookIssue();
          transactionMessage = "Book Issued"
        }
        //this else is for false when the top one is for true
        else{
          this.initiateBookReturn();
          transactionMessage = "Book Returned"
        }
      })
  
      this.setState({
        transactionMessage : transactionMessage
      })
    }











    render(){
        
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.ButtonState;
  
        if (buttonState !== "normal" && hasCameraPermissions){
          return(
           <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          );
        }
  
        else if (buttonState === "normal"){
          return(
            <KeyboardAvoidingView style={styles.container} behaviour='paddding' enabled>
            <View style={styles.container}>
  <View>
    <Image
    source={require("../assets/logo.jpg")}
    style={{width:200,height:200}}/>
    <Text style={{textAlign: 'center',fontSize:30}}>Wily</Text>
  </View>
  <View style = {styles.inputBox}>
    <TextInput
    style={styles.inputBox}
    placeholder="Book Id"
    value={this.state.scannedBoookId}/>
    <TouchableOpacity
    style={styles.scanButton}
    onPress={()=>{
      this.getCameraPermission("BookId")
    }}>
       <Text style={styles.buttonText}>Scan</Text>
    </TouchableOpacity>
  </View>
  <View style={styles.inputView}>
  <TextInput 
              style={styles.inputBox}
              placeholder="Student Id"
              value={this.state.scannedStudentId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermission("StudentId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={async()=>{
               var transactionMessage = await this.handleTransaction();
            }}>
               <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
           </View>
           </KeyboardAvoidingView>
          );
        }
      }
    }











    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  displayText:{
    fontSize: 15,
    textDecorationLine: 'underline'
  },
  scanButton:{
    backgroundColor: '#2196F3',
    padding: 10,
    margin: 10
  },
  buttonText:{
    fontSize: 20,
  },
  inputView: {
flexDirection:'row',
Margin:20
  },
  inputBox: {
width:400,
height:20,
borderWidth:1.5,
borderRightWidth: 0,
fontSize:20,
  },
  scanButton:{
    backgroundColor: '#66BB6A',
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  submitButton:{
width:100,
height:50,
  },
  submitText:{
textAlign:'center',
fontSize:20,
Color:'white'
  }
});