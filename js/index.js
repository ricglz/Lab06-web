(function() {
  const searchInput = document.getElementById('search');
  const resultsHtml = document.querySelector('.results');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const getThumbnail = ({ thumbnails }) => thumbnails.default;

  let prevPage = nextPage = null;

  async function getApiResults(query, pageToken) {
    const defaultParams = {
      key: 'AIzaSyBlkrLro1muKL_f_nX_yEK94GqOK0dQooE',
      maxResults: 10,
      part: 'snippet',
      q: query,
      type: 'video',
    }
    const params = new URLSearchParams(
      pageToken ? {...defaultParams, pageToken} : defaultParams
    );
    const url = 'https://www.googleapis.com/youtube/v3/search?' + params;
    try {
      const response = await fetch(url);
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function createResultElement(title, uri, id) {
    const result = document.createElement('div');
    result.classList = 'result-item';
    result.innerHTML = `
      <h4 class="result-title">${title}</h4>
      <a href="https://www.youtube.com/watch?v=${id}" target="_blank">
        <img src="${uri}" alt="Thumbanil describing ${title}" \
             width="120" height="90">
      </a>
    `
    return result;
  }

  function addResults({ items }) {
    items.forEach(({ snippet, id }) => {
      const { title } = snippet, { url } = getThumbnail(snippet),
            { videoId } = id;
      const item = createResultElement(title, url, videoId);
      resultsHtml.append(item);
    });
  }

  function toogleButton(value, btn) {
    if(value) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  }

  function updatePages({ prevPageToken, nextPageToken }) {
    prevPage = prevPageToken;
    nextPage = nextPageToken;
    toogleButton(prevPage, prevPageBtn);
    toogleButton(nextPage, nextPageBtn);
  }

  async function search(pageToken) {
    const { value } = searchInput;
    const results = await getApiResults(value, pageToken);
    if(results) {
      console.log("It's working!");
      resultsHtml.innerHTML = '';
      addResults(results);
      updatePages(results);
    } else {
      console.error('Something went wrong when fethcing results');
    }
  }

  function init() {
    document.getElementById('submit-btn')
      .addEventListener('click', (event) => {
        event.preventDefault();
        search();
      });
    prevPageBtn.addEventListener('click', (event) => {
      event.preventDefault();
      search(prevPage);
    });
    nextPageBtn.addEventListener('click', (event) => {
      event.preventDefault();
      search(nextPage);
    });
  }

  init();
})();
