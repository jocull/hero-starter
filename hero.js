
//This is a copy of safe diamond miner for now
var strategy = function (gameData, helpers) {
    var myHero = gameData.activeHero;

    //Get stats on the nearest health well
    var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function (boardTile) {
        if (boardTile.type === 'HealthWell') {
            return true;
        }
    });
    var distanceToHealthWell = healthWellStats.distance;
    var directionToHealthWell = healthWellStats.direction;

    if (myHero.health < 40) {
        //Heal no matter what if low health
        return directionToHealthWell;
    } else if (myHero.health < 100 && distanceToHealthWell === 1) {
        //Heal if you aren't full health and are close to a health well already
        return directionToHealthWell;
    } else {
        //If healthy, go capture a diamond mine!
        return helpers.findNearestNonTeamDiamondMine(gameData);
    }
};

// Export the move function here
module.exports = strategy;
