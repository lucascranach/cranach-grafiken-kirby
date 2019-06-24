var imageZoom = (function () {
  return function () {
    let zoomable = document.querySelector('.js-zoomable')
    if (zoomable) {
      let imgUrl = document.querySelector('img').src.replace(/-l\./, '-xl.')
      zoomable.querySelector('img').classList.add('is-faded')
      var viewer = OpenSeadragon({
        id: zoomable.id,
        prefixUrl: baseSegment + '/libs/openseadragon/images/',
        tileSources: {
          type: 'image',
          url: imgUrl
        }
      })
    }
  }
})()

imageZoom()
