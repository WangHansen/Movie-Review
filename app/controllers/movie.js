var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore')

//detail page
exports.detail = function(req, res){
	var id = req.params.id

	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err)
		}

		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comment){
				res.render('detail', {
					title: movie.title,
					movie: movie,
					comments: comment
				})
			})
	})
}

//new movie page and request
exports.new = function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin', {
			title: 'Movies Management',
			categories: categories,
			movie: {}		
		})
	})
}

//update movie page
exports.update = function(req, res){
	var id = req.params.id

	if (id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
				
			Category.find({}, function(err,categories){
				res.render('admin', {
					title: 'Movie Information Update',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

exports.save = function(req, res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}else{
		_movie = new Movie(movieObj)

		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName

		_movie.save(function(err, movie){
			if(err){
				console.log(err)
			}

			if(categoryId){
				Category.findById(categoryId, function(err, category){
					category.movies.push(movie._id)

					category.save(function(err, category){
						res.redirect('/movie/' + movie._id)
					})
				})
			}
			else if(categoryName){
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})

				category.save(function(err, category){
					movie.category = category._id
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id)
					})
				})
			}
		})
	}
}

//movie list
exports.list = function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}

		res.render('list', {
			title: 'Homepage',
			movies: movies
		})
	})
}

//remove a movie call
exports.del = function(req, res){
	var id = req.params.id

	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success: 1})
			}
		})
	}
}