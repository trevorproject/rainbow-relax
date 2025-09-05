import ReactGA from "react-ga4";
import CookieConsent from "react-cookie-consent";

const GA4 = () => {
  var gtag = import.meta.env.VITE_GTAG;	
  if (gtag==null)
  {
    return null
  }else
  {
    return (
      <CookieConsent
        location="bottom"
        buttonText="I Accept"
        cookieName="cookie1"
        style={{ background: "#ff5a3e" }}
        buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
        expires={150}
         onAccept={(acceptedByScrolling) => {
         if (acceptedByScrolling) {
           // triggered if user scrolls past threshold, dna for our case but this didnt work if i didnt write it
         } else {
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
        }}

      >
        This website uses google analytics to better user expericence{"\n"}Este sitio utiliza google analytics para mejorar la experiencia de usuario.{" "}


      </CookieConsent>)
    }
  }
export default GA4;
