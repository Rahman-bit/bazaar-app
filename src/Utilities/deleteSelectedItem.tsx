import React, { useEffect, useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';  
import Form from 'react-bootstrap/Form'; 
import axios from 'axios';
import CustomToast from './CustomToast';
import Button from '../components/buttons';

const DeleteSelectedItem = (props: any) => {

const [statusCode, setStatusCode] = useState("" as any) 
const [showToast, setshowToast] = useState(false) 

console.log("DeleteSelectedItem", props)

const dynamicURL = () => {
  let endpointurl = ""
  // createcustomer
  if(props?.journey === "mycustomer") {
    endpointurl = "createcustomer";
  }
  if(props?.journey === "invoice") {
    endpointurl = "createinvoice";
  }
  
  return endpointurl;
}
const handleDelete = async (id: any) => {
    // console.log(id, journey)
    props?.closeModal(false);
    try {
        const response = await axios.delete(`http://localhost:8000/${dynamicURL()}/${id}`);
        console.log('Resource deleted:', response.data);
        if (response.status === 200) {
          setStatusCode("success")
          setshowToast(true)
        } else if (response.status === 201) { 
          setStatusCode("success")
          setshowToast(true)
        } else { 
          setStatusCode("danger")
          setshowToast(true)
        }
    } catch (error) { 
        setStatusCode("danger")
        setshowToast(true)
    }
}

useEffect(() => {
  
    return () => {
      setshowToast(false)
    }
   }, [])

return (
<>
    <CustomToast showToast = {showToast} variantType = {statusCode}/>
    <Modal show={props?.show} onHide={props?.onHide}>
    <Modal.Header closeButton>
        <Modal.Title><h5>Are you sure you want to delete this lead - {props?.id}? </h5></Modal.Title>
    </Modal.Header>
    <Modal.Footer>
        <Button variant="secondary" onClick={props?.onHide}>
        Cancel
        </Button>
        <Button variant="primary" onClick={() => handleDelete(props?.id)}>
        Delete
        </Button>
    </Modal.Footer>
</Modal>
</>
)
}

export default DeleteSelectedItem