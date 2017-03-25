$(function(){
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/remove/' + id
		})
		.done(function(results){
			if(results.success){
				if(tr.length){
					tr.remove()
				}
			}
		})
	})

	var TMDb_get = function(_url, cb, setting){
		if( setting === undefined ){
			setting = {
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback'
			}
		}
		$.extend(setting, {url: _url, success: cb})
		$.ajax(setting)
	}

	$('#TMDb').blur(function(){
		var TMDb = $(this)
		var id = TMDb.val()
		var api_key = '2677597f7cb699a40abbc58abec228b8'
		var poster_path

		if(id){
			// for movie information
			var _url = 'https://api.themoviedb.org/3/movie/'+ id + '?api_key=' + api_key
			
			// get movie info
			TMDb_get(_url, function(data){
				$('#inputTitle').val(data.title)
				// $('#inputCategory').val(data.)
				$('#inputLanguage').val(data.spoken_languages[0].name)
				// $('#inputDirector').val(data.directors[0].name)
				$('#inputCountry').val(data.production_countries[0].name)
				$('#inputSummary').val(data.overview)
				poster_path = data.poster_path
			})

			_url = 'https://api.themoviedb.org/3/configuration?api_key=' + api_key

			TMDb_get(_url, function(data){
				$('#inputPoster').val(data.images.base_url + data.images.poster_sizes[3] + poster_path)
			})

			_url = 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + api_key

			TMDb_get(_url, function(data){
				$('#inputVideo').val('https://www.youtube.com/embed/'+data.results[0].key)
			})			
		}
	})
})