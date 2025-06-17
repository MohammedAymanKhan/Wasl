import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8081',   // Replace with your Keycloak server URL
  realm: 'Wasl',         // Replace with your Keycloak realm
  clientId: 'videoAudioApp',      // Replace with your Keycloak client ID
});

export default keycloak;