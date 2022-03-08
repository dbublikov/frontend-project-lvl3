/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
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

export default async () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    error: null,
    isSuccess: null,
    modal: { title: '', content: '', link: '#' },
    readIds: new Set(),
  };

  const elements = {
    input: document.querySelector('#url_input'),
    infoText: document.querySelector('#info_text'),
    errorText: document.querySelector('#error_text'),
    addButton: document.querySelector('#add_button'),
    feeds: document.querySelector('#feeds_list'),
    posts: document.querySelector('#posts_list'),
    feedsTitle: document.querySelector('#feeds_title'),
    postsTitle: document.querySelector('#posts_title'),
    exampleText: document.querySelector('#example_text'),

    modalTitle: document.querySelector('#modal_title'),
    modalContent: document.querySelector('#modal_body'),
    modalLink: document.querySelector('#modal_link'),
  };

  const watchedState = onChange(state, () => render(watchedState, elements));

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.error = null;

    schema.validate(elements.input.value)
      .then(() => {
        if (watchedState.urls.includes(elements.input.value)) {
          throw new TypeError('sameUrl', 'url exists');
        }
        return downloadRSS(elements.input.value);
      })
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description, url: elements.input.value });
        watchedState.posts.push(...items);
        watchedState.urls.push(elements.input.value);
        watchedState.isSuccess = true;
        elements.input.value = '';
      })
      .catch((err) => {
        // console.log(err);
        const type = err.type ?? 'network';
        watchedState.error = { type, message: errors[type] };
        watchedState.isSuccess = false;
        console.log(watchedState.error);
      });
  });

  render(watchedState, elements);
  updatePosts(watchedState);
};
