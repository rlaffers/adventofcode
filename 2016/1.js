// puzzle 1/2016
var steps = ['L2', 'L3', 'L3', 'L4', 'R1', 'R2', 'L3', 'R3', 'R3', 'L1', 'L3', 'R2', 'R3', 'L3', 'R4', 'R3', 'R3', 'L1', 'L4', 'R4', 'L2', 'R5', 'R1', 'L5', 'R1', 'R3', 'L5', 'R2', 'L2', 'R2', 'R1', 'L1', 'L3', 'L3', 'R4', 'R5', 'R4', 'L1', 'L189', 'L2', 'R2', 'L5', 'R5', 'R45', 'L3', 'R4', 'R77', 'L1', 'R1', 'R194', 'R2', 'L5', 'L3', 'L2', 'L1', 'R5', 'L3', 'L3', 'L5', 'L5', 'L5', 'R2', 'L1', 'L2', 'L3', 'R2', 'R5', 'R4', 'L2', 'R3', 'R5', 'L2', 'L2', 'R3', 'L3', 'L2', 'L1', 'L3', 'R5', 'R4', 'R3', 'R2', 'L1', 'R2', 'L5', 'R4', 'L5', 'L4', 'R4', 'L2', 'R5', 'L3', 'L2', 'R4', 'L1', 'L2', 'R2', 'R3', 'L2', 'L5', 'R1', 'R1', 'R3', 'R4', 'R1', 'R2', 'R4', 'R5', 'L3', 'L5', 'L3', 'L3', 'R5', 'R4', 'R1', 'L3', 'R1', 'L3', 'R3', 'R3', 'R3', 'L1', 'R3', 'R4', 'L5', 'L3', 'L1', 'L5', 'L4', 'R4', 'R1', 'L4', 'R3', 'R3', 'R5', 'R4', 'R3', 'R3', 'L1', 'L2', 'R1', 'L4', 'L4', 'L3', 'L4', 'L3', 'L5', 'R2', 'R4', 'L2'];


// test
//steps = ['R2', 'L3'];
//steps = ['R2', 'R2', 'R2'];
//steps = ['R5', 'L5', 'R5', 'R3'];

console.log('there are', steps.length, 'steps');

var sides = {
    0: 'N',
    1: 'E',
    2: 'S',
    3: 'W'
};

// facing: north = 0, east = 1, south = 2, west = 3
var step, 
    len, 
    position = [0, 0], 
    newPosition = [0, 0], 
    facing = 0, 
    hash, 
    hit;
// first position visited twice will be saved here
var visited = {};
var hqPosition;

for (var i=0; i < steps.length; i++) {
    step = steps[i];
    console.log(step);
    len = parseInt(step.slice(1), 10);

    // find out which direction we are moving now
    if (step[0] === 'L') {
        facing = facing - 1;
    } else {
        facing = facing + 1;
    }

    if (facing < 0) {
        facing = 3;
    }
    if (facing > 3) {
        facing = 0;
    }

    switch (facing) {
        case 0:
            newPosition = [position[0], position[1] + len];
            break;

        case 1:
            newPosition = [position[0] + len, position[1]];
            break;
        
        case 2:
            newPosition = [position[0], position[1] - len];
            break;

        case 3:
            newPosition = [position[0] - len, position[1]];
            break;
        
        default:
            throw 'bad facing direction:' + facing;
    }
    distance = (Math.abs(newPosition[0]) + Math.abs(newPosition[1]));
    console.log(i + ". new position " + newPosition + ", distance " + distance  + ", facing " + sides[facing]);

    // save all visited places since the previous position
    var place,marker;

    switch (facing) {
        case 0:
            // y+
            for (var y=position[1]+1; y <= newPosition[1]; y++) {
                place = [newPosition[0], y];
                marker = place[0] + ',' + place[1];
                if (hqPosition === undefined && visited[marker]) {
                    // BINGO
                    hqPosition = place;
                }
                savePlace(visited, marker);
            }
            break;

        case 1:
            // x+
            for (var x=position[0]+1; x <= newPosition[0]; x++) {
                place = [x, newPosition[1]];
                marker = place[0] + ',' + place[1];
                if (hqPosition === undefined && visited[marker]) {
                    // BINGO
                    hqPosition = place;
                }
                savePlace(visited, marker);
            }
            break;
        case 2:
            // y-
            for (var y=position[1]-1; y >= newPosition[1]; y--) {
                place = [newPosition[0], y];
                marker = place[0] + ',' + place[1];
                if (hqPosition === undefined && visited[marker]) {
                    // BINGO
                    hqPosition = place;
                }
                savePlace(visited, marker);
            }
            break;

        case 3:
            // x-
            for (var x=position[0]-1; x >= newPosition[0]; x--) {
                place = [x, newPosition[1]];
                marker = place[0] + ',' + place[1];
                if (hqPosition === undefined && visited[marker]) {
                    // BINGO
                    hqPosition = place;
                }
                savePlace(visited, marker);
            }
            break;

        default:
            throw 'bad facing direction:' + facing;
    }
    position = newPosition;
}
console.log("final position", position);
console.log("final distance", distance);
if (hqPosition === undefined) {
    console.error('Failed to find HQ');
} else {
    console.log("HQ is at: " + hqPosition + ' ' + (Math.abs(hqPosition[0]) + Math.abs(hqPosition[1])) + ' block away');
}

// savePlace
function savePlace(places, marker) {
    if (places[marker] === undefined) {
        places[marker] = 1;
    } else {
        places[marker]++;
    }
}
