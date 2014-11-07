
//My custom hero brain!
var move = function (gameData, helpers) {
    var myHero = gameData.activeHero;

    //Get stats on the nearest health well
    var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function (boardTile) {
        if (boardTile.type === 'HealthWell') {
            return true;
        }
    });

    //Get stats on the nearest non-team diamond mine
    var diamondMineStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function (boardTile) {
        //Don't go after mines we already own
        if (boardTile.type === 'DiamondMine'
            && (!boardTile.owner //No owner
                || boardTile.owner.team !== myHero.team)) //Not owned by team
        {
            return true;
        }
    });

    //Get stats on the nearest enemy player
    var enemyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function (boardTile) {
        if (boardTile.type === 'Hero' && boardTile.team !== myHero.team) {
            return true;
        }
    });

    //Get stats on the nearest friendly player
    var friendlyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function (boardTile) {
        if (boardTile.type === 'Hero' && boardTile.team === myHero.team) {
            return true;
        }
    });

    //Is there a target of opportunity player standing next to us?
    if (enemyStats.distance === 1 && enemyStats.health <= 30) {
        //Stab stab stab!
        return enemyStats.direction;
    }

    //Go for health if low!
    if (myHero.health <= 60) {
        return healthWellStats.direction;
    }

    //Just kind of hurt... what's smart at the moment?
    if (myHero.health < 100) {
        //Heal us up if it's close
        if (healthWellStats.distance === 1) {
            return healthWellStats.direction;
        }
    }

    //Is a friendly player in trouble nearby?
    if (friendlyStats
        && friendlyStats.distance <= 4
        && friendlyStats.health <= 60)
    {
        //Is there an enemy that is closer?
        if (enemyStats
            && enemyStats.distance < friendlyStats.distance){
            //Stab stab stab!
            return enemyStats.direction;
        }

        //Otherwise, go heal them
        return friendlyStats.direction;
    }

    //Is there an unowned diamond mine closer than the nearest enemy?
    //Do we have enough health to risk capturing it?
    if (diamondMineStats
        && diamondMineStats.team !== myHero.team
        && diamondMineStats.distance < enemyStats.distance
        && myHero.health >= 50)
    {
        return diamondMineStats.direction;
    }

    //Is there someone closer to heal than attack?
    if (friendlyStats
        && enemyStats
        && friendlyStats.health < 60
        && friendlyStats.distance < (enemyStats.distance + 1))
    {
        return friendlyStats.distance;
    }
    else if (enemyStats) {
        //Go and attack
        return enemyStats.direction;
    }

    //If we got this far and there's no good choices, it's probably a good idea to heal.
    if (healthWellStats) {
        return healthWellStats.direction;
    }

    //...how did we get here even? Sit on our thumbs.
    return 'Stay';
};

// Export the move function here
if (typeof(module) !== 'undefined'){
    module.exports = move;
}
