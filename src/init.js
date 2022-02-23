import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import { parserRSS, TypeError } from './utils';
import render from './view';

const schema = yup.string().url().required();

const errors = {
  required: 'Empty URL input', // yup validation error
  url: 'Invalid URL', // yup validation error
  rss: 'Invalid RSS data',
  sameUrl: 'URL already exists in the list',
  network: 'Network error',
};

export default () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    error: null,
  };

  const form = document.querySelector('form');
  const input = document.querySelector('#url_input');
  const errorText = document.querySelector('#error_text');

  const watchedState = onChange(state, () => render(watchedState, { input, errorText }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.error = null;

    schema.validate(input.value)
      .then(() => {
        if (watchedState.urls.includes(input.value)) {
          throw new TypeError('sameUrl', 'url exists');
        }
        return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${input.value}`);
      })
      .then((res) => { console.log(res); return res; })
      .then((res) => parserRSS(res.data.contents))
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description });
        watchedState.posts.push(...items);
        watchedState.urls.push(input.value);
        input.value = '';
      })
      .catch((err) => {
        const type = err.type ?? 'network';
        watchedState.error = { type, message: errors[type] };
        console.log(watchedState.error);
      });
  });
};
