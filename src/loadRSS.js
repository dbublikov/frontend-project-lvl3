import axios from 'axios';
import parseRSS from './parseRSS.js';

export default (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((res) => parseRSS(url, res.data.contents));
