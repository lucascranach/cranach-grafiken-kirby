
// import Bulma from '@vizuaalog/bulmajs';

console.log('main-2.js')


// import Bulma from '@vizuaalog/bulmajs';

console.log('main.js')

var zoomable = document.querySelector('.js-zoomable')
if (zoomable) {
  let imgUrl = document.querySelector('img').src.replace(/.*imageserver/, '/img/graphics')
  imgUrl = imgUrl.replace(/-l\./, '-xl.')
  zoomable.classList.add('is-faded')
  var viewer = OpenSeadragon({
    id: zoomable.id,
    prefixUrl: '/libs/openseadragon/images/',
    tileSources: {
      type: 'image',
      url: imgUrl
    }
  })
}
