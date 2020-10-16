import React, {useState, useEffect, useContext} from 'react';
import { IDContext } from '../scripts/id-context';
import { ProfileContext } from '../scripts/profile-context';
import { SignedinContext } from '../scripts/signedin-context';
import { Row, Col, Button, Dropdown } from 'react-bootstrap';


const Header = ({setView, setSignedInView, ...props}) => {
    //eslint-disable-next-line
    const [userID, setUserID] = useContext(IDContext);
    const [profileInfo, setProfileInfo] = useContext(ProfileContext);
    const [signedIn, setSignedIn] = useContext(SignedinContext);
    const [initialPath, setInitialPath] = useState((document.location.pathname).slice(1));
    const [initialID, setInitialID] = useState(window.location.search);

    useEffect(() => {
        initiateSigninButton();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        signedIn ? setSignedInView(initialPath, initialID) : setView("welcome");
        //eslint-disable-next-line
    }, [signedIn]);

    function signOut() {
        let auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            setSignedIn(false);
            initiateSigninButton();
        });
    }

    const onSignIn = async (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        setUserID(id_token);
        const profile = googleUser.getBasicProfile();
        const user = {
            email:  profile.getEmail(),
            image: profile.getImageUrl(),
            name: profile.getName(),
        };
            
        const res = await fetch('/api/signin', {method:'POST', body: JSON.stringify({id_token, user})});
        if(res.status === 200) {
            setProfileInfo(user);
            setSignedIn(true);
        } else {
            console.log("Authentication failed");
            signOut();
        }
    }  

    const initiateSigninButton = () => {
        try {
            window.gapi.signin2.render("google-sign-in-button", {
                width: 200,
                height: 50,
                onsuccess: onSignIn
            });
        } catch(err) {
            console.error(err);
            setTimeout(initiateSigninButton, 500);
        }
    }

    const ProfileImage = React.forwardRef(({onClick, ...props}, ref) => (
        <img 
            className="clickable" 
            id="profile-image" 
            src={profileInfo.image} 
            ref={ref}
            onClick={(e)=> {
                e.preventDefault();
                onClick(e);
            }}
            alt="Profile"
        />
    ));

    return (
        <div>
            <Row id="header" className="d-flex justify-content-end">
                <Col className="d-flex justify-content-start">
                    <img className="clickable banner-logo" src="logo_long.png" alt="Banner logo" onClick={()=>setView("home")}/>
                </Col>
                <Col className="d-flex justify-content-end">
                    { 
                    signedIn 
                    ? 
                        <Dropdown>
                            <Dropdown.Toggle as={ProfileImage} id="profile-image-dropdown"/>
                            <Dropdown.Menu>
                                <Dropdown.Header>{profileInfo.name}</Dropdown.Header>
                                <Dropdown.Item eventKey="1">
                                    <span onClick={()=>setView("profile")}>Profile</span>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="2">
                                    {
                                    signedIn 
                                    ?
                                    <span id="google-sign-out-button" onClick={signOut}>Sign Out</span>
                                    :
                                    <div id="google-sign-in-button" data-onsuccess="onSignIn">Sign In</div>
                                    }
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    :
                    <div id="google-sign-in-button" data-onsuccess="onSignIn">Sign In</div>
                    }
                </Col>
            </Row>
        </div>
    )
}

export default Header;