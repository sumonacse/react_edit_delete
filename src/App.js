
import { useState, useEffect } from 'react';
import {Button, Form, Container, ListGroup, Modal} from 'react-bootstrap';
import { getDatabase, ref, set, push, onValue, remove, update} from "firebase/database";


function App() {

  const db = getDatabase();
  let [firstname,setFirstname] = useState("");
  let [tasklist,setTasklist] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(false);


  const handleShow = (id) =>{
    setShow(true);
    setId(id);
  };

  const handleClose = () =>{
    setShow(false);
    update(ref(db,"todo/"+id),{
      task:firstname,
    })
  };



  let handleForm = (e)=>{
    e.preventDefault();

    set (push(ref(db, 'todo')) , {
      task : firstname,
    });
  }; 


  let handleFirstName = (e)=>{
    setFirstname(e.target.value);
   
  };
  
  useEffect(()=>{
    onValue(ref(db, 'todo'), (snapshot) => {
       let arr=[];
       snapshot.forEach(item=>{
        let task={
          id:item.key,
          task:item.val(),
        };
           arr.push(task);
      }); 
      setTasklist(arr);
    });

  },[]);

 let handleDelete = (id)=>{
    remove(ref(db,"todo/"+id));
 };

  return (
    <Container>
        <h1>TODO APP</h1>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your task</Form.Label>
              <Form.Control onChange={handleFirstName} type="text"  />
            </Form.Group>
           
            <Button onClick={handleForm} variant="primary" type="submit"> Submit </Button>
        </Form>
        <br/>
        <br/>
        <br/>

        <ListGroup>
            {tasklist.map(item =>(
                 <ListGroup.Item> {item.task.task}  <br/>
                    <Button variant="info" onClick={()=>handleShow(item.id)}>Edit</Button>{' '}
                    <Button onClick={()=> handleDelete(item.id)} variant="danger">Delete</Button>{' '}
                 </ListGroup.Item>
            ))}
        </ListGroup>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit your task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Your task</Form.Label>
                  <Form.Control onChange={handleFirstName} type="text"  />
              </Form.Group>  
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
  );
}



export default App;



