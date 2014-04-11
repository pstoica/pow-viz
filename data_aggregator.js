var MongoClient = require('mongodb').MongoClient;

//average per year, per locale, per quality

function DataSource(){};

DataSource.prototype.getStateData = function getStateData(startDate, endDate, loc, cb){
	MongoClient.connect('mongodb://localhost/pow', function(err, db){
		var collection = db.collection('weed_data');

		function map(){
			var d = new Date(this.date);
			var key = (d.getMonth()+1) + '/15/' + d.getFullYear();
			var val = {
				quality:this.quality,
				ppg: this.ppg
			};
			emit(key, val);
		}

		function reduce(key,vals){
			var sums = {low:0, medium:0, high:0},
				counts = {low:0, medium:0, high:0},
				reducedVal = {low_avg:0, medium_avg:0, high_avg:0};

			for(var i=0; i<vals.length;i++){
				sums[vals[i].quality]+=vals[i].ppg
				counts[vals[i].quality]++;
			}

			reducedVal['low_avg'] = sums['low']/counts['low'];
			reducedVal['medium_avg'] = sums['medium']/counts['medium'];
			reducedVal['high_avg'] = sums['high']/counts['high'];

			return reducedVal;
		}

		collection.mapReduce(
			map,
			reduce,
			{
				query: {
					// state:loc, 
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
			var d = new Date(this.date);
			var key = (d.getMonth()+1) + '/15/' + d.getFullYear();
			var val = {
				quality:this.quality,
				ppg: this.ppg
			};
			emit(key, val);
		}

		function reduce(key,vals){
			var sums = {low:0, medium:0, high:0},
				counts = {low:0, medium:0, high:0},
				reducedVal = {low_avg:0, medium_avg:0, high_avg:0};

			for(var i=0; i<vals.length;i++){
				sums[vals[i].quality]+=vals[i].ppg
				counts[vals[i].quality]++;
			}

			reducedVal['low_avg'] = sums['low']/counts['low'];
			reducedVal['medium_avg'] = sums['medium']/counts['medium'];
			reducedVal['high_avg'] = sums['high']/counts['high'];

			return reducedVal;
		}

		collection.mapReduce(
			map,
			reduce,
			{
				query: {
					date:{$gt: startDate, $lt:endDate}
				},
				out: {inline:1}
			},
			cb
		);
	});	
}

module.exports = DataSource;