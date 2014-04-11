var MongoClient = require('mongodb').MongoClient;

//average per year, per locale, per quality

//     DataSource = require('./data_aggregator.js'),
//     ds = new DataSource();

// ds.getStateData(new Date(2011), new Date(2012), 'GA', function(err, stats){
//   console.log(stats);
// });


function DataSource(){};

DataSource.prototype.getStateData = function getStateData(startDate, endDate, loc, cb){
	MongoClient.connect('mongodb://localhost/pow', function(err, db){
		var collection = db.collection('weed_data');

		function map(){
			emit(this.quality, this.ppg);
		}

		function reduce(key,values){
			var sum=0
			for(var i=0; i<values.length; i++){
				sum+=values[i];
			}

			return sum/values.length;
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
			function(err,collection,stats){
				cb(err,stats);
			}
		);
	});
}

module.exports = DataSource;