import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import { parserRSS, TypeError } from './utils';
import render from './view';
import ru from './locales/ru.js';

const schema = yup.string().url().required();

i18next.init({
  lng: 'ru',
  // debug: true,
  resources: {
    ru,
  },
});

const errors = {
  required: i18next.t('errors.required'), // yup validation error
  url: i18next.t('errors.url'), // yup validation error
  rss: i18next.t('errors.rss'),
  sameUrl: i18next.t('errors.sameUrl'),
  network: i18next.t('errors.network'),
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
  const feeds = document.querySelector('#feeds_list');
  const posts = document.querySelector('#posts_list');

  const watchedState = onChange(state, () => render(watchedState, {
    input, errorText, feeds, posts,
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.error = null;

    schema.validate(input.value)
      .then(() => {
        if (watchedState.urls.includes(input.value)) {
          throw new TypeError('sameUrl', 'url exists');
        }
        return axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${input.value}`);
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
