/* eslint-disable no-param-reassign */

import i18next from 'i18next';

export default (state, elements) => {
  console.log('rerender');
  console.log('state: ', state);

  const {
    input, errorText, feeds, posts, modalTitle, modalContent, modalLink,
  } = elements;

  elements.addButton.textContent = i18next.t('navigation.add');
  elements.exampleText.textContent = i18next.t('content.example');
  elements.feedsTitle.textContent = i18next.t('content.feeds');
  elements.postsTitle.textContent = i18next.t('content.posts');

  input.classList.remove('is-invalid');
  errorText.classList.add('d-none');

  const container = document.querySelector('#main_container');

  // Render feeds
  if (state.feeds.length > 0) {
    container.classList.remove('d-none');
    // console.log(state);
    feeds.innerHTML = '';

    state.feeds.forEach((feed) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');
      li.classList.add('list-group-item', 'list-group-item-dark');
      h3.textContent = feed.title;
      p.textContent = feed.description;

      li.append(h3, p);
      feeds.append(li);
    });

    // Render posts
    posts.innerHTML = '';
    state.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-dark', 'd-flex', 'justify-content-between');
      const a = document.createElement('a');
      a.classList.add(state.readIds.has(post.guid) ? 'fw-normal' : 'fw-bold');
      a.textContent = post.title;
      a.setAttribute('href', post.link);
      li.append(a);

      // Render button
      const showButton = document.createElement('button');
      showButton.classList.add('btn', 'btn-primary', 'btn-sm');
      showButton.dataset.bsToggle = 'modal';
      showButton.dataset.bsTarget = '#modal';
      showButton.textContent = i18next.t('navigation.preview');
      showButton.id = `show_${post.guid}`;
      showButton.addEventListener('click', () => {
        state.modal.title = post.title;
        state.modal.content = post.description;
        state.modal.link = post.link;
        state.readIds.add(post.guid);
      });

      li.append(showButton);
      posts.append(li);
    });
  } else {
    container.classList.add('d-none');
  }

  // Render error

  if (state.error) {
    const { type } = state.error;
    if (type === 'rss' || type === 'required' || type === 'url') {
      input.classList.add('is-invalid');
    }

    errorText.textContent = state.error.message;
    errorText.classList.remove('d-none');
  }

  // console.log(state);

  modalTitle.textContent = state.modal.title;
  modalContent.textContent = state.modal.content;
  modalLink.setAttribute('href', state.modal.link);
};
