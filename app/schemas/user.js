var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	// 0: user
	// 1: verified user
	// 2:  premium user
	// >10: admin
	role:  {
		type: Number,
		default: 0
	},
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},
		updatedAt: {
			type: Date,
			default: Date.now()
		}
	}
})

UserSchema.pre('save', function(next){
	var user = this

	if(this.isNew){
		this.meta.createdAt = this.meta.updatedAt = Date.now()
	}else{
		this.meta.updatedAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) {
			console.log('error encrypting')
			return next(err)
		}
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err){
				console.log('error encrypting step2')
				return next(err)
			}
			user.password = hash
			next()
		})
	})
})

UserSchema.methods = {
	comparePassword: function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatched){
			if(err)
				return cb(err)

			cb(null, isMatched)
		})
	}
}

UserSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updatedAt')
			.exec(cb)
	},
	findByName: function(name, cb){
		return this
			.findOne({name: name})
			.exec(cb)
	}
}

module.exports = UserSchema