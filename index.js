const endpoint =
  "https://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

function getAuthorName(author) {
  return author.split('"')[1];
}

function getDateString(date) {
  return `${new Date(date).toLocaleDateString()}`;
}

function getTagString(tags) {
  return tags ? `Tags: ${tags}` : "";
}

function makeDiv(className, text) {
  const el = document.createElement("div");
  el.classList.add(className);
  el.textContent = text;
  el.setAttribute('title', text);
  return el;
}

function makeImgLink(image, link) {
  const img = document.createElement("img");
  const anchor = document.createElement("a");

  img.setAttribute("src", image);
  img.classList.add("image");
  anchor.setAttribute("href", link);
  anchor.setAttribute("target", "_blank");
  anchor.appendChild(img);
  return anchor;
}

function createCard(item) {
  const card = makeDiv("card", "");
  const name = makeDiv("name", getAuthorName(item.author));
  const date = makeDiv("date", getDateString(item.date_taken));
  const tags = makeDiv("tags", getTagString(item.tags));

  const imgLink = makeImgLink(item.media.m, item.link);

  card.appendChild(name);
  card.appendChild(imgLink);
  card.appendChild(date);
  card.appendChild(tags);

  document.getElementById("results").appendChild(card);
}

function displayFailMessage(response) {
  clearResults();
  document.getElementById("results").innerHTML = "<p>Sorry, there was an error, please try again later!</p>";
}

function hideNoResults() {
  const empty = document.getElementById("empty");
  empty.classList.add('hidden');
}

function showNoResults() {
  const empty = document.getElementById("empty");
  empty.classList.remove('hidden');
}

function displayImages(response) {
  clearResults();
  if (response.items.length === 0) {
    showNoResults();
    return;
  }
  response.items.map(createCard);
}

function clearResults() {
  document.getElementById("results").innerHTML = "";
  hideNoResults();
}

function searchTags(tags) {
  $.getJSON(endpoint, {
    tags,
    tagmode: "all",
    format: "json"
  }).done(displayImages).fail(displayFailMessage);
}

function handleSearch(e) {
  const searchTerm = this.value;
  if (!searchTerm) {
    clearResults();
    return;
  }

  const tags = searchTerm.split(" ").join(",");
  searchTags(tags);
}

function preventSubmit(e) {
  e.preventDefault();
  return false;
}

$(function() {
  searchTags("range");

  const searchInput = document.querySelector(".search");
  const form = document.querySelector(".search-form");

  form.addEventListener("submit", preventSubmit);
  searchInput.addEventListener('input', handleSearch);
});
