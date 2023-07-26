//TOGGLE MENU NAV
const hamburgerButton = document.getElementById('hamburgerButton');
const closeButton = document.getElementById('btnCloseNavigationDrawer')
const navBg = document.getElementById('navigationDrawerBackground');
const navContainer = document.getElementById('navigationDrawerContainer');

hamburgerButton.addEventListener('click', () => {
    hamburgerButton.classList.toggle('active');
    navBg.classList.add('active');
    navContainer.classList.add('active');
});

closeButton.addEventListener('click', () => {
  navBg.classList.remove('active');
  navContainer.classList.remove('active');
})

var rellax = new Rellax('.content__inner-container', {
  speed: 1,
  center: false,
  wrapper: null,
  round: true,
  vertical: true,
  horizontal: false
});

// Custom Button Playing Youtube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('js-video-iframe', {
    videoId: 'dyYs7eFW9jo',
    events: {
      'onReady': onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  // bind events
  const videaPlayerArea = document.getElementById("js-video-click-area");
  videaPlayerArea.addEventListener("click", function() {
    videaPlayerArea.remove();
    player.playVideo();
  });
}

// Select Dropdown Language Switcher
const dropdown = document.getElementById('dropboxLanguageSwitcher')
const selectBox = dropdown.querySelector('select.select-box')
const selectionText = document.getElementById('selected_title')

const dropdownNav = document.getElementById('dropboxLanguageSwitcherNav')
const selectionTextNav = document.getElementById('selected_title-nav')

dropdown.addEventListener('click', (e) => dynamicDropdownChange(e, dropdown)) // Desktop
dropdownNav.addEventListener('click', (e) => dynamicDropdownChange(e, dropdownNav)) // Mobile and Tablet

const dynamicDropdownChange = (e, dropdownElement) => {
  const arrowIcon = dropdownElement.querySelector('.arrow-icon')
  const dropList = dropdownElement.querySelector('ul.list-items')
  if(dropList.classList.contains('open')){
    dropList.classList.remove('open')
    arrowIcon.classList.remove('open')
  }else{
    dropList.classList.add('open')
    arrowIcon.classList.add('open')
  }
  if(e.target.localName=='li' && e.target.dataset.value){
    selectBox.value = e.target.dataset.value
    selectionText.innerHTML = e.target.dataset.index
    selectionTextNav.innerHTML = e.target.dataset.index
    dynamicListItemChanges(dropList, e.target)
  }
}

const dynamicListItemChanges = (listItems, selectedItem) => {
  for(let i = 0;i<listItems.children.length;i++){
    let li = listItems.children.item(i)
    if(li) li.classList.remove('active')
  }
  selectedItem.classList.add('active')
}

// Outside Click Dropdown Language Switcher
window.addEventListener('click', e => dynamicCloseOutside(e, dropdown)); // Desktop
window.addEventListener('click', e => dynamicCloseOutside(e, dropdownNav)); // Tablet and Mobile
const dynamicCloseOutside = (e, element) => {
  if( element.contains(e.target)){
  } else{
    const dropList = element.querySelector('ul.list-items')
    const arrowIcon = element.querySelector('.arrow-icon')
    dropList.classList.remove('open')
    arrowIcon.classList.remove('open')
  }
}