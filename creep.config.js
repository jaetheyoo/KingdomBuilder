module.exports = Object.freeze({
    HARVESTER_L1_CONFIG: [WORK,CARRY,MOVE,MOVE],
    HARVESTER_L1_COST: 250,
    HARVESTER_L2_CONFIG: [WORK,WORK,WORK,CARRY,MOVE,MOVE],
    HARVESTER_L2_COST: 450,
    HARVESTER_L3_CONFIG: [WORK,WORK,WORK,WORK,WORK,MOVE],
    HARVESTER_L3_COST: 550,

    UPGRADER_L1_CONFIG: [WORK,CARRY,MOVE,MOVE],
    UPGRADER_L1_CONFIG: 250,
    UPGRADER_L2_CONFIG: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
    UPGRADER_L2_COST: 400,
    UPGRADER_L3_CONFIG: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
    UPGRADER_L3_COST: 700,
    UPGRADER_L4_CONFIG: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    UPGRADER_L4_COST: 1150,

    BUILDER_L1_CONFIG: [WORK,CARRY,MOVE,MOVE],
    BUILDER_L1_CONFIG: 250,
    BUILDER_L2_CONFIG: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
    BUILDER_L2_COST: 400,
    BUILDER_L3_CONFIG: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
    BUILDER_L3_COST: 700,
    BUILDER_L4_CONFIG: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    BUILDER_L4_COST: 1300,

    /**
     * OLD CONFIGS BEGIN HERE
     */



    MELEE_DEFENDER_CONFIG: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,MOVE],
    MELEE_DEFENDER_COST: 1110,
    WALL_BREAKER_CONFIG: [MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
    ATTACK_CONFIG: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE], // 1700
    RANGER_CONFIG: [MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE],
    HEALER_CONFIG: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE], // 2100
    DRAINER_CONFIG: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    HEAL,HEAL,HEAL,HEAL,HEAL,MOVE],
    
    MELEE_BODYGUARD_CONFIG: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,MOVE],
    MELEE_BODYGUARD_COST: 700,
    MELEE_BODYGUARD_COUNT: 1,//2

    MELEE_SCOUT_CONFIG: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,MOVE],
    MELEE_SCOUT_COST: 680,

    CLAIMER_CONFIG: [CLAIM,CLAIM,MOVE],
    CLAIMER_COST: 1250,
    CLAIMER_COUNT: 0, //2 PER FLAG

    CHEAP_HARVESTER_CONFIG: [WORK,WORK,WORK,CARRY],
    CHEAP_HARVESTER_COST: 9999,
    HARVESTER_CONFIG: [WORK,WORK,WORK,WORK,WORK,MOVE],
    HARVESTER_COST: 550,
    DROP_HARVESTER_CONFIG: [WORK,WORK,WORK,WORK,WORK,MOVE],
    DROP_HARVESTER_COST: 550,
    
    REMOTE_HARVESTER_CONFIG: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,],
    REMOTE_HARVESTER_COST: 800,
    REMOTE_HARVESTER_COUNT: 0, //NOT USED
    REMOTE_DROP_HARVESTER_CONFIG: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
    REMOTE_DROP_HARVESTER_COST: 1300,
    REMOTE_DROP_HARVESTER_COUNT: 3, //3
    // REMOTE_DROP_HARVESTER_BIG_CONFIG: M12W8C16 for 2350
    
    REMOTE_TRANSFER_CONFIG: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
    REMOTE_TRANSFER_COST: 700,
    REMOTE_TRANSFER_COUNT: 0,//2
    
    //TRANSPORTER_CONFIG: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
    //TRANSPORTER_COST: 450,
    TRANSPORTER_CONFIG: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
    TRANSPORTER_COST: 300,
    TRANSPORTER_COUNT: 1,//2

    SCAVENGER_CONFIG: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
    SCAVENGER_COST: 450,
    SCAVENGER_COUNT: 2,
    
    UPGRADER_STARTER: [WORK,CARRY,MOVE,MOVE],
    UPGRADER_CONFIG: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    UPGRADER_COST: 1850,
    UPGRADER_COUNT: 0,
    
    CHEAP_BUILDER_CONFIG: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    CHEAP_BUILDER_COST: 800, // 750
    //BUILDER_CONFIG: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
    BUILDER_CONFIG: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    BUILDER_COST: 1300, //1050
    BUILDER_COUNT: 2, //2
    REMOTE_BUILDER_CONFIG: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    MAXREPAIRERS: 5,
});