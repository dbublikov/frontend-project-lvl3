export default (state, elements) => {
  console.log('rerender');
  const {
    input, errorText, feeds, posts,
  } = elements;

  input.classList.remove('is-invalid');
  errorText.classList.add('d-none');

  const container = document.querySelector('#main_container');

  // Render feeds and posts

  if (state.feeds.length > 0) {
    container.classList.remove('d-none');
    console.log(state.feeds);
    feeds.innerHTML = '';

    state.feeds.forEach((feed) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');
      li.classList.add('list-group-item', 'list-group-item-dark');
      h3.textContent = feed.title;
      p.textContent = feed.description;

      li.prepend(h3, p);
      feeds.prepend(li);
    });

    posts.innerHTML = '';
    state.posts.forEach((post) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      li.classList.add('list-group-item', 'list-group-item-dark');
      a.textContent = post.title;
      a.setAttribute('href', post.link);
      a.setAttribute('target', '_blank');

      li.prepend(a);
      posts.prepend(li);
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
    return;
  }

  console.log(state);
};
