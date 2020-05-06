$(document).ready(function () {

  var searchInput = $('.search__inputbox');
  var searchButton = $('.search__button');
  var productsBox = $('.products');
  var apiKey = 'e689af11fd9023e87bb5c5b4fd5dde1e';
  var urlMovie = 'https://api.themoviedb.org/3/search/movie';
  var urlSerie = 'https://api.themoviedb.org/3/search/tv';
  // HANDLEBARS SETTINGS
  var source = $('#products__template').html();
  var template = Handlebars.compile(source);

  // FOCUS ON INPUTBOX
  searchInput.focus();

  // SEARCH PRODUCT WITH BUTTON
  searchButton.click(function(){
    addProduct()
  });

  // SEARCH PRODUCT WITH ENTER KEY
  searchInput.keyup(function(e){
    if (e.which == 13){
      addProduct()
    }
  });

  // POSTER HOVER
  $('#app').on('mouseenter', '.product', function() {
    $(this).find('.poster').toggle();
    $(this).find('.product__info').toggle();
  });
  $('#app').on('mouseleave', '.product', function() {
    $(this).find('.poster').toggle();
    $(this).find('.product__info').toggle();
  });

  /****************************************************
  * FUNCTIONS
  ****************************************************/
  
  // FUNCTION: ADD PRODUCT WITH HANDLEBARS
  function addProduct (){
    productsBox.children().remove();
    apiCall(urlMovie,'title','Movie');
    apiCall(urlSerie,'name','SerieTv');
    // CLEAN PRODUCTS BOX AND INPUTBOX VALUE
    searchInput.val('');
  }

  // FUNCTION: DYNAMIC API CALL
  function apiCall (url,nameFormat,type){
    var originalFormat = 'original_' + nameFormat;
    $.ajax({
      url: url,
      method: 'GET',
      data: {
        api_key: apiKey,
        query: searchInput.val().trim()
      },
      success: function(data){
        var result = data.results;
        for (let i = 0; i < result.length; i++){
          // CHECK ON POSTER
          var poster = '';
          if (!!result[i].poster_path){
            poster = 'https://image.tmdb.org/t/p/w342/' + result[i].poster_path;
          } else{
            poster = 'https://media.giphy.com/media/H7wajFPnZGdRWaQeu0/giphy.gif'
          }
          
          var product = {
          img: poster,
          title : result[i][nameFormat],
          original_title : result[i][originalFormat],
          original_language: flag(result[i].original_language),
          vote_average: stars(result[i].vote_average),
          type: type,
          overview: result[i].overview.substr(0, 70)
          }
          // APPEND A PRODUCT
          var html = template(product);
          productsBox.append(html);
        }
        // ALERT IF THE SEARCH RETURN NO RESULT
        if(type == 'SerieTv' && productsBox.children().length == 0){
          alert('La ricerca non ha prodotto nessun risultato');         
        };
      },
      error: function(){
        console.log('Api Error');
      }
    })
  }

  // FUNCTION: TRANSFORM VOTE TO STARS 1-5
  function stars(number){
    number = Math.ceil(number / 2);
    var result = '';
    var blankStars = (5 - number);   
    for (let i = 0; i < number; i++){
      result += '<i class="fas fa-star"></i>'
    }
    for (let i = 0; i < blankStars; i++){
      result += '<i class="far fa-star"></i>'
    }
    return result;
  }

  // FUNCTION: TRANSFORM LANGUAGE IN FLAGS (ONLY IT-EN)
  function flag(text){
    switch (text) {
      case 'it':
        return '<img src="img/en.svg" alt="en">'
      case 'en':
        return '<img src="img/it.svg" alt="it">'
      default:
        return text
    }
  }
  
});