var MongoClient = require('mongodb').MongoClient;

//average per year, per locale, per quality

function DataAggregator(connectionURL, collection){
	this.connectionURL = connectionURL;
	this.collection = collection;
};

function map(){
	var d = new Date(this.date);
	var key = (d.getMonth()+1) + '/1/' + d.getFullYear();
	var val = {
		quality:this.quality,
		ppg: this.ppg
	};
	emit(key, val);
}

function reduce(key,vals){
	var sums = {low:0, medium:0, high:0},
		counts = {low:0, medium:0, high:0},
		reducedVal = {low_avg:0, mid_avg:0, high_avg:0};

	for(var i=0; i<vals.length;i++){
		sums[vals[i].quality]+=vals[i].ppg
		counts[vals[i].quality]++;
	}

	reducedVal['low_avg'] = sums['low']/counts['low'];
	reducedVal['mid_avg'] = sums['medium']/counts['medium'];
	reducedVal['high_avg'] = sums['high']/counts['high'];

	return reducedVal;
}

DataAggregator.prototype.getStateData = function getStateData(startDate, endDate, loc, cb){
	var self = this;

	MongoClient.connect(self.connectionURL, function(err, db){
		var collection = db.collection(self.collection);

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
			function(err, data, stats){
				for(var i in data){
					data[i]._id = new Date(data[i]._id);
				}
				cb(err,data,stats);
			}
		);
	});
}

DataAggregator.prototype.getNationalData = function getNationalData(startDate, endDate, cb){
	var self = this;

	MongoClient.connect(self.connectionURL, function(err, db){
		var collection = db.collection(self.collection);

		collection.mapReduce(
			map,
			reduce,
			{
				query: {
					date:{$gt: startDate, $lt:endDate}
				},
				out: {inline:1}
			},
			function(err, data, stats){
				for(var i in data){
					data[i]._id = new Date(data[i]._id);
				}
				cb(err,data,stats);
			}
		);
	});	
}

module.exports = DataAggregator;