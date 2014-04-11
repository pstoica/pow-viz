var MongoClient = require('mongodb').MongoClient;

//average per year, per locale, per quality

function DataSource(){};

DataSource.prototype.getStateData = function getStateData(startDate, endDate, loc, cb){
	MongoClient.connect('mongodb://localhost/pow', function(err, db){
		var collection = db.collection('weed_data');

		function map(){
			emit(this.quality, this.ppg);
		}

		function reduce(key,values){
			return Array.sum(values)/values.length;
		}

		collection.mapReduce(
			map,
			reduce,
			{
				query: {
					state:loc, 
					date:{$gte: startDate, $lt:endDate}
				},
				out: {inline:1}
			},
			cb
		);
	});
}

DataSource.prototype.getNationalData = function getNationalData(startDate, endDate, cb){
	MongoClient.connect('mongodb://localhost/pow', function(err, db){
		var collection = db.collection('weed_data');

		function map(){
			emit(this.quality, this.ppg);
		}

		function reduce(key,values){
			return Array.sum(values)/values.length;
		}

		collection.mapReduce(
			map,
			reduce,
			{
				query: {
					date:{$gte: startDate, $lt:endDate}
				},
				out: {inline:1}
			},
			cb
		);
	});	
}

module.exports = DataSource;