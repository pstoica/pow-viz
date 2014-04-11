var fs = require('fs'),
	csv = require('csv'),
    db = require('monk')('localhost/pow'),
    weed_data = db.get('weed_data');

//class for importing csv data into mongo

    //average per year, per locale, per quality

function CSVImporter(){};

CSVImporter.prototype.import_data = function import_data(){
	csv()
	.from.path(__dirname+'/mj-clean.csv', {delimeter: ',', escape:'"'})
	.to.stream(fs.createWriteStream(__dirname+'/csv_output'))
	.transform( function(row){
		row.unshift(row.pop());
		return row;
	})
	.on('record', function(row, index){
		// console.log('#'+index+' '+JSON.stringify(row));
		weed_data.insert(mongo_map(row));
	})
	.on('close', function(count){
		console.log(count + ' lines processed\nImport Complete.');
	})
	.on('error', function(e){
		console.log(e.message);
	});
}

function mongo_map(csv){
	return {
		lon: csv[0],
		lat: csv[9],
		city: csv[1],
		state: csv[2],
		price: csv[3],
		amount: csv[4],
		quality: csv[5],
		date: new Date(csv[6]),
		ppg: csv[7],
		state_name: csv[8]
	}
}

imp = new CSVImporter();
imp.import_data();