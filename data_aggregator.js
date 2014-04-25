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
	var key = (d.getUTCMonth()+1) + '/1/' + d.getUTCFullYear();
	var val = {
		low_avg: null,
		mid_avg: null,
		high_avg: null,
		low_total: 0,
		mid_total: 0,
		high_total: 0,
		low_count: 0,
		mid_count: 0,
		high_count: 0
	};

	var translateQuality = {
		'low': 'low',
		'medium': 'mid',
		'high': 'high'
	};

	val[translateQuality[this.quality] + '_avg'] = this.ppg;
	val[translateQuality[this.quality] + '_total'] = this.ppg;
	val[translateQuality[this.quality] + '_count'] = 1;
	emit(key, val);
}

function reduce(key,vals){
	var reducedVal = {low_avg:[], mid_avg:[], high_avg:[], low_count: 0, mid_count: 0, high_count: 0, low_total: 0, mid_total: 0, high_total: 0},
		qualities = ['low', 'mid', 'high'];

	vals.forEach(function(row) {
		qualities.forEach(function(quality) {
			reducedVal[quality + '_total'] += row[quality + '_total'];
			reducedVal[quality + '_count'] += row[quality + '_count'];
		});
	});

	qualities.forEach(function(quality) {
		reducedVal[quality + '_avg'] = reducedVal[quality + '_total'] / reducedVal[quality + '_count']/* / reducedVal[quality + '_avg'].length*/;
	});

	return reducedVal;
}

function mapByState() {
	var key = this.state;
	var val = {
		low_avg: null,
		mid_avg: null,
		high_avg: null,
		low_total: 0,
		mid_total: 0,
		high_total: 0,
		low_count: 0,
		mid_count: 0,
		high_count: 0
	};

	var translateQuality = {
		'low': 'low',
		'medium': 'mid',
		'high': 'high'
	};

	val[translateQuality[this.quality] + '_avg'] = this.ppg;
	val[translateQuality[this.quality] + '_total'] = this.ppg;
	val[translateQuality[this.quality] + '_count'] = 1;
	emit(key, val);
}

function reduceByState(key,vals) {
	var sums = {low:0, medium:0, high:0},
		counts = {low:0, medium:0, high:0},
		reducedVal = {low_avg: null, mid_avg: null, high_avg: null};

	for(var i=0; i<vals.length;i++){
		sums[vals[i].quality]+=vals[i].ppg;
		counts[vals[i].quality]++;
	}

	reducedVal['low_avg'] = sums['low']/counts['low'] || null;
	reducedVal['mid_avg'] = sums['medium']/counts['medium'] || null;
	reducedVal['high_avg'] = sums['high']/counts['high'] || null;

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
		reduce,
		{
			query: {
				date:{$gte: startDate, $lt: endDate}
			},
			out: {inline:1}
		},
		function(err, data, stats){
			cb(err,data,stats);
		}
	);
}

function padNumber(number) {
	if (number < 10) {
		return "0" + number;
	} else {
		return number;
	}
}

module.exports = DataAggregator;