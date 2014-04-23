var MongoClient = require('mongodb').MongoClient;

//average per year, per locale, per quality

function DataAggregator(connectionURL, collection){
	var self = this;

	this.connectionURL = connectionURL;
	this.collection = collection;

	MongoClient.connect(connectionURL, function(err, database) {
	  	if(err) throw err;

	  	self.db = database;
  	});
}

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

	reducedVal['low_avg'] = sums['low']/counts['low'] || undefined;
	reducedVal['mid_avg'] = sums['medium']/counts['medium'] || undefined;
	reducedVal['high_avg'] = sums['high']/counts['high'] || undefined;

	return reducedVal;
}

function mapByState() {
	var key = this.state;
	var val = {
		quality:this.quality,
		ppg: this.ppg
	};
	emit(key, val);
}

function reduceByState(key,vals) {
	var sums = {low:0, medium:0, high:0},
		counts = {low:0, medium:0, high:0},
		reducedVal = {low_avg:0, mid_avg:0, high_avg:0};

	for(var i=0; i<vals.length;i++){
		sums[vals[i].quality]+=vals[i].ppg
		counts[vals[i].quality]++;
	}

	reducedVal['low_avg'] = sums['low']/counts['low'] || undefined;
	reducedVal['mid_avg'] = sums['medium']/counts['medium'] || undefined;
	reducedVal['high_avg'] = sums['high']/counts['high'] || undefined;

	return reducedVal;
}

DataAggregator.prototype.getStateData = function getStateData(startDate, endDate, loc, cb){
	var self = this;

	if(self.db==null){
		return;
	}

	var collection = self.db.collection(self.collection);


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
		function(err, data, stats){
			for(var i in data){
				data[i]._id = new Date(data[i]._id);
			}
			cb(err,data,stats);
		}
	);
}

DataAggregator.prototype.getNationalData = function getNationalData(startDate, endDate, cb){
	var self = this;

	if(self.db==null){
		return;
	}

	var collection = self.db.collection(self.collection);

	collection.mapReduce(
		map,
		reduce,
		{
			query: {
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
}

DataAggregator.prototype.getStateAverages = function getStateAverages(startDate, endDate, cb){
	var self = this;

	if(self.db==null){
		return;
	}

	var collection = self.db.collection(self.collection);

	collection.mapReduce(
		mapByState,
		reduceByState,
		{
			query: {
				date:{$gte: startDate, $lt:endDate}
			},
			out: {inline:1}
		},
		function(err, data, stats){
			cb(err,data,stats);
		}
	);
}

module.exports = DataAggregator;