import axios from 'axios';
import onChange from 'on-change';
import parserRSS from './parser';

const render = (state) => {
  console.log(state);
};

export default () => {
  const state = {
    feeds: [],
    posts: [],
    error: null,
  };

  const watchedState = onChange(state, () => render(watchedState));

  // https://ru.hexlet.io/lessons.rss
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#url_input');
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${input.value}`)
      .then((res) => { console.log(res); return res; })
      .then((res) => parserRSS(res.data.contents))
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description });
        watchedState.posts.push(...items);
        console.log(state);
      })
      .catch((err) => console.log(err));
  });
};
