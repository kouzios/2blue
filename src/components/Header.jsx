import React, {useState, useEffect, useContext} from 'react';
import { IDContext } from '../scripts/id-context';
import { ProfileContext } from '../scripts/profile-context';
import { SignedinContext } from '../scripts/signedin-context';
import {Row, Col, Button} from 'react-bootstrap';


const Header = ({...props}) => {
    const [userID, setUserID] = useContext(IDContext);
    const [profileInfo, setProfileInfo] = useContext(ProfileContext);
    const [signedIn, setSignedIn] = useContext(SignedinContext);

    useEffect(() => {
        initiateSigninButton();
    }, [])//TODO: Profile image expands to have options like sign out, profile, etc

    function signOut() {
        let auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            setSignedIn(false);
            initiateSigninButton();
            props.setView("home");
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
        }
    }

    return (
        <div>
            <Row id="header">
                <Col>
                <img className="clickable banner-logo" src="logo_long.png" alt="Banner logo" onClick={()=>props.setView("home")}/>
                </Col>
                <Col>
                {
                    signedIn 
                    ?
                    <Button id="google-sign-out-button" onClick={signOut}>Sign Out</Button>
                    :
                    
                    <div id="google-sign-in-button" data-onsuccess="onSignIn">more</div>
                }
                </Col>
                <Col>{/*TODO: Make this invisible if not signed in*/}
                <img className="clickable" id="profile-image" src={profileInfo.image} onClick={()=>props.setView("profile")}/>
                </Col>
            </Row>
            <hr/>
        </div>
    )
}

export default Header;