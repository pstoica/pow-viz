var fs = require('fs');

/*
Resulting output is an array of json. something like:

[{date: DATE_OBJ, val: TREND_VAL},
...]
*/

function TrendLoader(){}

TrendLoader.prototype.getTrendData = function getTrendData(loc, cb){	
	//loc can be us for nation or ga for a state like georgia for ex.
	var fileName = 'public/trends_data/' + loc.toLowerCase() + '.js';

	fs.readFile(fileName, 'utf8', function(error, data){
		var jsonStartIdx = data.indexOf('{');
		var jsonContent = data.slice(jsonStartIdx, data.length-2);
		eval('jsonContent=' + jsonContent);
		var jsonResult = [];

		for(var i=0; i<jsonContent.table.rows.length; i++){
			var dataPoint = jsonContent.table.rows[i];
			var pointDate = new Date(dataPoint.c[0].v);

			if(pointDate>=startDate && pointDate<=endDate){
				jsonResult.push({date:pointDate, val:dataPoint.c[1].v});
			}
		}

		cb(jsonResult);
	});
}

module.exports = TrendLoader;