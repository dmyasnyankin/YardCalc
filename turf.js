// Define a function backyard() that returns the geometry indicating the backyard of the building on the map

// You may use the following global variables:
// parcel - is the polygon feature denoting the parcel,
// building - is the polygon feature denoting the building on the parcel,
// lotlines.front - is the lineString feature denoting the front lot line,
// lotlines.rear - is the lineString feature denoting the front lot line, and
// lotlines.side - is an Array of (2) lineString features denoting the side lot lines.

function backyard() {
	//
	////
	// TO IDENTIFY REAR COORDS-LINE //
	////
	//

	var rearcoords = lotlines.rear.geometry.coordinates;

	let rearParcel1 = rearcoords[0];
	let rearParcel2 = rearcoords[1];

	//
	////
	// TO IDENTIFY POINTS //
	////
	//

	let buildingPoints = building.geometry.coordinates[0];

	// GET LONG PTS FROM BUILDING-PTS

	let pointLongs = [];
	for (let i = 0; i < buildingPoints.length; i++) {
		pointLongs.push(buildingPoints[i][0]);
	}

	// FIND MIN LONG FROM POINT-LONGS

	const minLong = Math.max(...pointLongs);

	// ANOTHER FOR LOOP TO FIND COORDS OF MIN-LONG

	let buildingRears = [];
	for (let i = 0; i < buildingPoints.length; i++) {
		if (buildingPoints[i][0] === minLong) {
			buildingRears.push(buildingPoints[i]);
		}
	}

	//
	////
	// ASSIGN REAR POINTS OF BUILDING TO VARS
	////
	//

	let rear1 = buildingRears[0];
	let rear2 = buildingRears[1];

	let side1 = lotlines.side[0].geometry.coordinates;

	let side2 = lotlines.side[1].geometry.coordinates;

	let lengthSide1FromRear1 = calcPointDistance(rear1, side1);

	let lengthSide2FromRear1 = calcPointDistance(rear1, side2);

	//
	////
	// DETERMINE INTERSECTING POINTS USING SHORTER LENGTH OF SIDE FROM REAR
	////
	//

	let intersect1;
	let intersect2;
	if (lengthSide1FromRear1 < lengthSide2FromRear1) {
		intersect1 = findNearestPointOnLine(side1, rear1);
		intersect2 = findNearestPointOnLine(side2, rear2);
	} else {
		intersect1 = findNearestPointOnLine(side2, rear1);
		intersect2 = findNearestPointOnLine(side1, rear2);
	}

    //
    ////
    // BUILD POLYGON
    ////
    //

	const minY = Math.min(
		rearParcel1[0],
		rearParcel2[0],
		intersect1[0],
		intersect2[0]
	);

	const maxY = Math.max(
		rearParcel1[0],
		rearParcel2[0],
		intersect1[0],
		intersect2[0]
	);

	const minX = Math.min(
		rearParcel1[1],
		rearParcel2[1],
		intersect1[1],
		intersect2[1]
	);

	const maxX = Math.max(
		rearParcel1[1],
		rearParcel2[1],
		intersect1[1],
		intersect2[1]
	);

	var bbox = [maxY, maxX, minY, minX];

	var poly = turf.bboxPolygon(bbox);

	return poly;
}

//
////
// HELPER FUNC TO CALC POINT-TO-LINE-DISTANCE
////
//

function calcPointDistance(point, line) {
	let pt = turf.point(point);
	let ln = turf.lineString(line);

	var distance = turf.pointToLineDistance(pt, ln, { units: "feet" });

	return distance;
}

//
////
// HELPER FUNC TO CALC NEAREST POINT ON LINE
////
//

function findNearestPointOnLine(line, point) {
	let ln = turf.lineString(line);
	let pt = turf.point(point);

	let nearest = turf.nearestPointOnLine(ln, pt, { units: "feet" });

	return nearest.geometry.coordinates;
}

// RANDOM JUNK

//
////
//CONSOLE LOGS USED
////
//

//
//console.log('distances', distances)
//console.log('Rear Cords', rearcoords);
//console.log('Rear Line String', rearLineString.geometry.coordinates);
//console.log('pointLongs', pointLongs);
//console.log('minLong',minLong);
//console.log('side1',side1)
//console.log('side2',side2)
//console.log('lengthSide1FromRear1',lengthSide1FromRear1)
//console.log('lengthSide2FromRear1',lengthSide2FromRear1)
//console.log('intersect1', intersect1);
//console.log('intersect2', intersect2);
//console.log('rearParcel1', rearParcel1);
//console.log('rearParcel2', rearParcel2);
//console.log('building rears', buildingRears[0])
