/* eslint-disable no-param-reassign */
import loadRSS from './loadRSS.js';
import updateRSS from './updateRSS.js';
import validateLink from './validateLink.js';

export const handleAddFeed = (e, state, i18nInstance) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const link = formData.get('url').trim();

  document.querySelector('#url_input').value = '';

  const error = validateLink(link, state.feeds);
  console.log('validate error: ', error);
  state.form.error = error;

  if (!error) {
    state.form.state = 'pending';

    loadRSS(link)
      .then((res) => {
        // console.log(res);
        state.feeds.unshift(res.feed);
        state.posts = [...res.posts, ...state.posts];
        state.urls.push(link);

        state.form.state = 'success';

        updateRSS(link, state);

        e.target.reset();
      })
      .catch((err) => {
        console.log(err);
        state.form.state = 'failed';
        if (err.isAxiosError) {
          state.form.error = i18nInstance.t('errors.netError');
        } else {
          state.form.error = i18nInstance.t('errors.invalidRSS');
        }
      });
  } else {
    state.form.state = 'failed';
  }
};

export const handleSelectLanguage = (e, state, i18nInstance) => {
  i18nInstance.changeLanguage(e.target.dataset.lang);
  state.lang = e.target.dataset.lang;
  document.querySelector('#url_input').value = '';

  const buttonGroup = e.target.closest('.btn-group');
  const active = buttonGroup.querySelector('.active');

  active.classList.remove('btn-secondary', 'active');
  active.classList.add('btn-outline-secondary');

  e.target.parentElement.classList.remove('btn-outline-secondary');
  e.target.parentElement.classList.add('btn-secondary', 'active');
};

export const handleViewPost = (post) => {
  document.body.classList.add('modal-open');

  document.querySelector('#modal_title').textContent = post.title;
  document.querySelector('#modal_body').innerHTML = post.desc;
  document.querySelector('#modal_link').href = post.url;
  document.querySelector('#modal').classList.add('show');
};
