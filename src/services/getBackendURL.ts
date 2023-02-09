export default function getBackendURL() {
  const { hostname } = window.location;

  let baseURL = 'https://apidev.wingswap.com';
  if (hostname === 'wingswap.com') {
    baseURL = 'https://api.wingswap.com';
  } else if (hostname.indexOf('localhost') > -1) {
    baseURL = 'http://localhost';
  }
  return baseURL;
}
