import React, {useState, useContext, useEffect} from 'react';
import { Row, Button, Form, Col} from 'react-bootstrap';
import { ProfileContext } from '../scripts/profile-context';

const Home = ({...props}) => {
  const [profileInfo, setProfileInfo] = useContext(ProfileContext);
  const [name, setName] = useState(profileInfo.name);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    //If user gives up on editing profile, set it back to default value
    if(disabled === true) {
      setName(profileInfo.name);
    }
    //eslint-disable-next-line
  }, [disabled])

  const handleForm = async (event) => {
    event.preventDefault(); //Prevent form submission
    const body = { 
      userid: profileInfo.userid,
      name,
      email: profileInfo.email,
      image: profileInfo.image,
    };
    const res = await fetch('/api/signin', {method:'PUT', body:JSON.stringify(body)});
    const airtableUser = await res.json();
    setProfileInfo(airtableUser);
    setDisabled(true);
  }

  return (
    <div id="profile" className="container mt-5 d-flex justify-content-center align-items-center">
      <Col md={6} sm={12}>
        <Form onSubmit={(e) => handleForm(e)}>
          <Form.Group>
            <h2>Profile</h2>
          </Form.Group>

          <Form.Group controlId="formatProfilePicture">
            <Form.Row className="justify-content-center disabled">
              <Form.Label>Profile Picture</Form.Label>
            </Form.Row>
            <Form.Row className="justify-content-center disabled">
              <img id="profile-image" src={profileInfo.image} alt="Profile Page" />
            </Form.Row>
          </Form.Group>

          <Form.Group controlId="formatUsersName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e)=>setName(e.target.value)} disabled={disabled} autoComplete="off" />
          </Form.Group>

          <Form.Group controlId="formatUsersName">
            <Form.Label>Email Address</Form.Label>
            <Form.Control className="disabled" type="email" defaultValue={profileInfo.email} readOnly autoComplete="off" />
          </Form.Group>
          
          <Form.Group as={Row} className="justify-content-around" controlId="formatSubmission">
            <Button variant="secondary" onClick={()=>setDisabled(!disabled)}>
              {disabled ? "Edit Profile" : "Cancel"}
            </Button>
            <Button variant="primary" type="submit" disabled={disabled}>Submit Changes</Button>
          </Form.Group>
        </Form>
      </Col>
    </div>
    
  );
}

export default Home;