export default (state, elements) => {
  console.log('rerender');
  const { input, errorText } = elements;

  input.classList.remove('is-invalid');
  errorText.classList.add('d-none');

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
