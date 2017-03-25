var Category = require('../models/category')
var _ = require('underscore')

// render category
exports.new = function(req, res){
	res.render('category_admin', {
		title: 'Category Management',
		category: ""
	})
}

// save a category
exports.save = function(req, res){
	var _category = req.body.category

	var	category = new Category(_category)

	category.save(function(err, category){
		if(err){
			console.log(err)
		}

		res.redirect('/admin/category/list')
	})
}

//category list
exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err)
		}

		res.render('categorylist', {
			title: 'Homepage',
			categories: categories
		})
	})
}
