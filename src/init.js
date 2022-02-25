import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import { downloadRSS, TypeError } from './utils';
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

const form = document.querySelector('form');
const input = document.querySelector('#url_input');
const errorText = document.querySelector('#error_text');
const feeds = document.querySelector('#feeds_list');
const posts = document.querySelector('#posts_list');

/* eslint-disable no-param-reassign */

const updatePosts = (watchedState, timeout = 5000) => {
  const rssChanges = watchedState.urls.map((url) => downloadRSS(url)
    .then(({ items: newPosts }) => {
      const updatedPosts = _.unionBy(watchedState.posts, newPosts, 'guid');
      watchedState.posts = updatedPosts;
    })
    .catch((err) => {
      const type = err.type ?? 'network';
      watchedState.error = { type, message: errors[type] };
    }));
  Promise.allSettled(rssChanges)
    .then(() => setTimeout(() => updatePosts(watchedState), timeout));
};

export default () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    error: null,
  };

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
        return downloadRSS(input.value);
      })
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description, url: input.value });
        watchedState.posts.push(...items);
        watchedState.urls.push(input.value);
        input.value = '';
      })
      .catch((err) => {
        // console.log(err);
        const type = err.type ?? 'network';
        watchedState.error = { type, message: errors[type] };
        console.log(watchedState.error);
      });
  });

  updatePosts(watchedState);
};
