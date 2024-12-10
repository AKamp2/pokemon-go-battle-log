/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  const errorPopup = document.getElementById('errorPopup');
  const errorText = document.getElementById('errorText');

  errorText.textContent = message;
  errorPopup.classList.remove('hidden');
};

const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  hideError(); // Ensure any previous errors are hidden

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

const hideError = () => {
  const errorPopup = document.getElementById('errorPopup');
  errorPopup.classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  hideError,
};