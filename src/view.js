/* eslint-disable no-param-reassign */
import i18next from 'i18next';

export default (state, elements) => {
  console.log('rerender');
  console.log('state: ', state);

  const {
    input, infoText, feeds, posts, modalTitle, modalContent, modalLink,
  } = elements;

  input.classList.remove('is-invalid');

  elements.addButton.textContent = i18next.t('navigation.add');
  elements.exampleText.textContent = i18next.t('content.example');
  elements.feedsTitle.textContent = i18next.t('content.feeds');
  elements.postsTitle.textContent = i18next.t('content.posts');

  elements.input.readOnly = state.isLoading;
  elements.addButton.disabled = state.isLoading;

  // Render error
  if (state.error) {
    const { type } = state.error;
    if (type === 'url' || type === 'required') {
      input.classList.add('is-invalid');
    }
    infoText.textContent = state.error.message;
    infoText.classList.remove('text-success');
    infoText.classList.add('text-danger');
    infoText.classList.remove('d-none');
    return;
  }

  // Render success
  if (state.isSuccess) {
    infoText.textContent = i18next.t('info.success');
    infoText.classList.remove('d-none');
    infoText.classList.remove('text-danger');
    infoText.classList.add('text-success');
  }

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
      const a = document.createElement('a');
      li.classList.add('list-group-item', 'list-group-item-dark', 'd-flex', 'justify-content-between');
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
      showButton.type = 'button';
      showButton.name = 'Просмотр';
      showButton.ariaLabel = 'Просмотр';
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

  // console.log(state);

  modalTitle.textContent = state.modal.title;
  modalContent.textContent = state.modal.content;
  modalLink.setAttribute('href', state.modal.link);
};
