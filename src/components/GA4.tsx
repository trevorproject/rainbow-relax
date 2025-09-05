import ReactGA from "react-ga4";
import CookieConsent from "react-cookie-consent";

const GA4 = () => {
  var gtag = "your gtag tag"; // for us rn G-7ZZ5Z0WSKJ	

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="galleta"
      style={{ background: "#e34c00ff" }}
      buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
      expires={150}
        onAccept={(acceptedByScrolling) => {
        if (acceptedByScrolling) {
          // triggered if user scrolls past threshold, dna for our case but this didnt work if i didnt write it
          alert("Accept was triggered by user scrolling");
        } else {
          alert("Accept was triggered by clicking the Accept button");
          //initialize GA4 and anonimize IP
          ReactGA.initialize(gtag, {
          gaOptions: {
          anonymizeIp: true,
          },
        })
        }
      }}
      enableDeclineButton flipButtons
        onDecline={() => {
          alert("ok so nothing happens we dont track");
      }}
        
    >
      This website uses google analytics to better user expericence{"\n"}Este sitio utiliza google analytics para mejorar la experiencia de usuario.{" "}


    </CookieConsent>)
  }
export default GA4;
