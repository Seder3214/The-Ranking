const typeNames = {
    normal: "Normal",
    scaled: "Upscaled",
    sideways: "Sideways",
    starred: "Starred",
    passive: "Passive",
    exponenial: "Exponential",
}
function formatRoman(num) {
    let minus = 0
    if (num<0) minus = 1
    num = Math.abs(num)
    var roman = {
      M: 1000, CM: 900, D: 500, CD: 400,
      C: 100, XC: 90, L: 50, XL: 40,
      X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    var str = minus==1?'-':'';
  
    for (var i of Object.keys(roman)) {
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
  
    return str;
}
function seededRandom(seed) {
    let value = seed % 16777216
    var x = Math.tan(value*1000+1);
    x = x / 125
    x = Math.min(Math.sin(x+1) * 16777216, 16777216)
    return x - Math.floor(x);
}
function sidewaysEff() {
    let boost=new Decimal(1)
    for(var i in player.rp.grid) {
      if (getGridData("rp", i).type=='sideways') boost=boost.mul(gridEffect('rp',i).eff2)
    }
    return boost
  }
  function starredEff() {
    let boost=new Decimal(1)
    for(var i in player.rp.grid) {
      if (getGridData("rp", i).type=='starred') boost=boost.mul(gridEffect('rp',i).eff2)
    }
    return boost
  }
function getColor(seed, tier) {
    let value = Math.floor(seededRandom(seed * Math.sin(((+tier * (seed ** 1.1))))) * 16777216)
    return "#" + value.toString(16).padStart(6, '0')
}
function getTextColor(seed, tier) {
    let value = Math.floor(seededRandom(seed * Math.sin(((+tier * (seed ** 1.1))))) * 16777216)
    return "#" + value.toString(16).padStart(6, '0')
}
addLayer("rp", {
    name: "Rankings", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "RP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        colors: {},
		points: new Decimal(0),
        best: new Decimal(0),
        pool: ["starred", "scaled", "sideways"],
        gridPower: new Decimal(0),
        choosed: [],
    }},
    
    color: "rgb(255,166,0)",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "ranking points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        if (player.rp.points.gte(2)) return new Decimal(2)
            else return new Decimal(1)
    },
    tabFormat: {
        "Main": {
        content:[
            function() { if (player.tab == "rp")  return ["column", [

["display-text", "You have <h2 style='color:rgb(255, 166, 0); text-shadow: rgb(255,166,0) 0px 0px 10px;'>"+format(player.rp.points)+"</h2> ranking points "],
            'prestige-button',
            "blank",
            "grid",
			]
        ]
 },
 ]
        },
        "Upgrades": {
            unlocked() {return player.rp.points.gte(1)},
            content:[
                function() { if (player.tab == "rp")  return ["column", [
    
    ["display-text", "You have <h2 style='color:rgb(255, 166, 0); text-shadow: rgb(255,166,0) 0px 0px 10px;'>"+format(player.rp.points)+"</h2> ranking points "],
                'prestige-button',
                "blank",
                "upgrades",
                ]
            ]
     },
     ]
            },
            "Challenges": {
                unlocked() {return hasUpgrade('rp',32)},
                content:[
                    function() { if (player.tab == "rp")  return ["column", [
        
        ["display-text", "You have <h2 style='color:rgb(255, 166, 0); text-shadow: rgb(255,166,0) 0px 0px 10px;'>"+format(player.rp.points)+"</h2> ranking points "],
                    'prestige-button',
                    "blank",
                    "challenges",
                    ]
                ]
         },
         ]
                },
    },
    upgrades: {
        11: {
            title: "Rankings I",
            apply() {
                let rankApplies=1
                if (player.rp.points.gte(2)) rankApplies++
                if (player.rp.points.gte(3)) rankApplies++
                if (player.rp.points.gte(4)) rankApplies++
                return rankApplies
            },
            description() {return "Points boosts Rankings effects."+`(Applies to Rankings I-${formatRoman(this.apply())})`},
            cost: new Decimal(3e10),
            unlocked() {return player.rp.points.gte(1)},
            effect() {let eff = new Decimal(1)
                eff = player.points.max(1).log10().add(1).mul(2.653)
                if (hasUpgrade('rp',21)) eff =player.points.max(1).pow(0.35).add(1).mul(2.653)
                 if (hasUpgrade('rp',33)) {
                    eff =player.points.max(1).pow(0.85).add(1).mul(2.653)
                    eff = softcap(eff,new Decimal(1e18),new Decimal(0.05))
                 }
               if(!hasUpgrade('rp',33)) eff = softcap(eff,new Decimal(1e12),new Decimal(0.15))
            return eff;},
            effectDisplay() {return "x"+format(upgradeEffect("rp", 11),4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        12: {
            title: "Rankings II",
            description: "Rankings points reduces cost to tier up",
            cost: new Decimal(1e12),
            unlocked() {return player.rp.points.gte(1)},
            effect() {let eff = new Decimal(1)
                eff = player.rp.points.mul(1.75).floor()
            return eff;},
            effectDisplay() {return "-"+format(upgradeEffect("rp", 12),4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        13: {
            title: "Rankings III",
            description: "Autobuy 1st and 2nd ranking and it doesn't cost anything (except for tier and tetr up).",
            cost: new Decimal(1e21),
            unlocked() {return player.rp.points.gte(1)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        21: {
            title: "Rankings IV",
            description: "3rd Ranking effect is boosted by its rank, tier and tetr. Rankings I is better.",
            cost: new Decimal(1e22),
            unlocked() {return player.rp.points.gte(2)},
            effect() {let eff = new Decimal(1)
                let data = player.rp.grid[103]
                eff = new Decimal(data.tier+data.tetr+data.pent).max(1).pow(5.55)
                if (hasUpgrade('rp',41))eff= new Decimal(data.tier+data.tetr+data.pent+data.hex).mul(1e8).max(1).pow(5.85)
                if (!hasUpgrade('rp',41))eff = softcap(eff,new Decimal(10000),new Decimal(0.15))
                    eff = softcap(eff, new Decimal(1e10),0.15)
            return eff;},
            effectDisplay() {return "x"+format(upgradeEffect("rp", 21),4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        22: {
            title: "Rankings V",
            description: "Unlock Pent.<br>Remove Tier Up requirement display from rankings.",
            cost: new Decimal(1e24),
            unlocked() {return player.rp.points.gte(2)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        23: {
            title: "Rankings VI",
            description: "Remove 1st softcap of Rankings effect. Tier and Tetr Up doesnt reset anything.",
            cost: new Decimal(1e26),
            unlocked() {return player.rp.points.gte(2)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        31: {
            title: "Rankings VII",
            description: "Autobuy 3rd ranking and it doesn't cost anything. 4th Ranking effect is boosted by 1.35<sup>Rank + Tier + Tetr.",
            effect() {let eff = new Decimal(1)
                let data = player.rp.grid[201]
                eff = Decimal.pow(1.35,data.tier+data.tetr+data.pent)
                eff = softcap(eff, new Decimal(1e5),0.15)
            return eff;},
            effectDisplay() {return "x"+format(upgradeEffect("rp", 31),4)},
            cost: new Decimal(3e59),
            unlocked() {return player.rp.points.gte(4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        32: {
            title: "Rankings VIII",
            description: "Unlock Challenges. Autobuy 4th ranking and it doesn't cost anything.",
            cost: new Decimal(1e62),
            unlocked() {return player.rp.points.gte(4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        33: {
            title: "Rankings IX",
            description: "Pent Up doesn't reset anything. Remove Rankings I's effect softcap, effect formula is better.",
            cost: new Decimal(1e70),
            unlocked() {return player.rp.points.gte(4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        41: {
            title: "Rankings X",
            description: "Rankings IV's effect softcap is removed, and the effect formula is much better.",
            cost: new Decimal(5e84),
            unlocked() {return player.rp.points.gte(4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        42: {
            title: "Rankings XI",
            description: "Rankings V's effect scales 3rd Rankings effect softcap start.",
            cost: new Decimal(1e120),
            unlocked() {return player.rp.points.gte(5)},
            effect() {let eff = new Decimal(1)
                let data = gridEffect('rp',202).eff
                if (player.rp.grid[202].tier>=1)eff = eff.mul(data.pow(0.5).div(1.5).add(1))
                eff = softcap(eff,new Decimal(1e5),hasUpgrade('rp',62)?0.5:0.2)
            return eff;},
            effectDisplay() {return "x"+format(upgradeEffect("rp", 42),4)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        43: {
            title: "Rankings XII",
            description: "Unlock next challenge. Autobuy 5th ranking and it doesn't cost anything.",
            cost: new Decimal(1e140),
            unlocked() {return player.rp.points.gte(5)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        51: {
            title: "Rankings XIII",
            description: "Tier's boost to Rankings's effect is much better. Softcap weakening while in Rankings <strike>Un</strike>limited is better.",
            cost: new Decimal(1e145),
            unlocked() {return player.rp.points.gte(5)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        52: {
            title: "Rankings XIV",
            description: "3rd Rankings's effect softcap is slightly weaker.",
            cost: new Decimal(1.59e159),
            unlocked() {return player.rp.points.gte(5)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        53: {
            title: "Rankings XV",
            description: "Pent's and Tetr's boost to Rankings's effect is much better.",
            cost: new Decimal(1e165),
            unlocked() {return player.rp.points.gte(5)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        61: {
            title: "Rankings XVI",
            description: "Unlock Hex, a new Rankings tier that will boost Rankings effect <b>after</b> 3rd softcap. Remove Tetr req-s display",
            cost: new Decimal(1e206),
            unlocked() {return player.rp.points.gte(6)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        62: {
            title: "Rankings XVII",
            description: "Weaken Rankings XI's effect 1st softcap.",
            cost: new Decimal(3e261),
            unlocked() {return player.rp.points.gte(6)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
        63: {
            title: "Rankings XVIII",
            description: "Increase Hex Up chance and its effect based on current points.",
            cost: new Decimal(1e290),
            effect() {let eff = new Decimal(1)
                    eff = player.points.max(1).log10().max(1).log10().pow(0.5).add(1)
            return eff;},
            effectDisplay() {return "x"+format(upgradeEffect("rp", 63),4)},
            unlocked() {return player.rp.points.gte(6)},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                currencyLayer: "",
        },
    },
    challenges: {
    11: {
        name: "Rankcapped!",
        completionLimit: new Decimal(3),
        onEnter() {
            for (i in player.rp.grid) {
                player.rp.grid[i] = {type: 'normal', tier: 0,tetr:0,pent:0,hex:0,oct:0}
            }
        },
        onExit() {
            for (i in player.rp.grid) {
                player.rp.grid[i] = {type: 'normal', tier: 0,tetr:0,pent:0,hex:0,oct:0}
            }
        },
        rankCap() {
            let cap = new Decimal(30).pow(new Decimal(1).div(new Decimal(challengeCompletions('rp',11)/2.5).add(1)))
            return cap.toNumber()
        },
        challengeDescription() {return "Completions: "+format(challengeCompletions('rp',11),0)+"/"+format(this.completionLimit,0)+"<br>You cant tier your rankings up, and ranks are capped at <b>[ Rank "+formatRoman(this.rankCap())+" ]</b>"},
        unlocked() { return hasUpgrade('rp',32)},
        goal: function(){
            let goal=new Decimal(1e22).pow(new Decimal(challengeCompletions('rp',11)/5).add(1))
            if (challengeCompletions('rp',11)==2) goal = new Decimal(1e28)
            return goal
        },
        canComplete(){
            return player.points.gte(tmp.rp.challenges[this.id].goal) && player.rp.activeChallenge==11;
        },
        rewardEffect() {
            let ret = Decimal.pow(1e4,new Decimal(challengeCompletions('rp',11)/(challengeCompletions('rp',11)==3?0.85:1.15)))
            return ret
        },
        goalDescription() {let req = " Points"
            return "Get "+format(this.goal())+req},
        currencyDisplayName: "Points",
        rewardDescription() { return "3rd Rankings's effect softcap starts later. At 3rd completion, the effect is greatly boosted <br>Currently: "+format(challengeEffect('rp',11))+"x" },
},
12: {
    name: "Rankings <strike><b>Un</b></strike>limited",
    completionLimit: new Decimal(4),
    onEnter() {
        for (i in player.rp.grid) {
            player.rp.grid[i] = {type: 'normal', tier: 0,tetr:0,pent:0,hex:0,oct:0}
        }
    },
    onExit() {
        for (i in player.rp.grid) {
            player.rp.grid[i] = {type: 'normal', tier: 0,tetr:0,pent:0,hex:0,oct:0}
        }
    },
    rankCap() {
        let cap = new Decimal(4).sub(challengeCompletions('rp',12))
        return cap.toNumber()
    },
    challengeDescription() {return "Completions: "+format(challengeCompletions('rp',12),0)+"/"+format(this.completionLimit,0)+"<br>You cant tier your rankings up, and you can only rank up <b>[  "+(this.rankCap()>1?"Rankings I-":(this.rankCap()==1?'Rankings ':'No Rankings'))+formatRoman(this.rankCap())+" ]</b>. But, 2nd Rankings's effect softcap is much weakier."},
    unlocked() { return hasUpgrade('rp',43)},
    goal: function(){
        let goal=new Decimal(1e133).root(new Decimal(challengeCompletions('rp',12)/2.85).add(1))
        if (challengeCompletions('rp',12)==2) goal = new Decimal(1e73)
        if (challengeCompletions('rp',12)==3) goal = new Decimal(3.7e37)
        return goal
    },
    canComplete(){
        return player.points.gte(tmp.rp.challenges[this.id].goal) && player.rp.activeChallenge==12;
    },
    rewardEffect() {
        let ret = Decimal.pow(1e20,new Decimal(challengeCompletions('rp',12)/(4.376)))
        return ret
    },
    goalDescription() {let req = " Points"
        return "Get "+format(this.goal())+req},
    currencyDisplayName: "Points",
    rewardDescription() { return "5th Ranking effect is boosted. At 4th completion, the effect applies to 3rd Rankings's effect softcap at reduced rate. <br>Currently: "+format(challengeEffect('rp',12))+"x" },
}
},
    getBoosterEff() {
        let boost=new Decimal(1)
        for(var i in player.rp.grid) {
          if (new Decimal(getGridData("rp", i).tier).gt(0)) boost=boost.mul(gridEffect('rp',i).eff)
        }
        return boost.pow(sidewaysEff())
      },
    grid: {
        cols() {let num = 0
            num = player.rp.best.toNumber()
            return Math.min(4,num)},
            maxCols: 3,
        rows() {let rows = 0
        rows += player.rp.best.div(2).max(1).floor().toNumber()
        return rows},
        maxRows: 3, // If these are dynamic make sure to have a max value as well!
        getStartData(id) {
            return {type: 'normal', tier: 0,tetr:0,pent:0,hex:0,oct:0}
        },

getBgColor(id) {
            let color = "#";
            for (var i = 0; i < 6; i++) {
                color += Math.floor(Math.random() * 10);
            }
return color
        },   
 getStyle(data, id) {
            if (data.tier<1) return {
                'min-width':'280px',
                'min-height':'125px',
                'height': 'auto',
                'width':'auto',
                'font-size':'12px',
                'background-color': 'gray',
                'border-color': 'dark gray',
                'border-radius':'0%',
                'color': 'black'
            }
            if (!player.rp.colors[id]) player.rp.colors[id] = Math.floor(Math.random() * 16777216)
             return {
                'background-color': player.points.gte(gridCost('rp',id))?'#444':'#171717',
                'border':'5px solid',
                
                'border-color': getColor(player.rp.colors[id], data.tier+data.tetr+data.pent+data.hex),
                'min-width':'280px',
                'color':'white',
                'border-radius':'0%',
                'height': 'auto',
                'width':'auto',
                'font-size':'12px',
                'min-height':'125px',
                'background-blend-mode': 'revert',
                /* Blends the gradient with the image */
                'background-size': 'cover',
                'background-repeat':'no-repeat',
    
            }
        },
        getCost(data,id) {
            let b = gridStartCost('rp',id).add(2).div(new Decimal(100).mul((id%100)-2).max(1)).mul(Math.pow(1.5,data.tier)).add(10).mul(id/100).mul(id%100)
            if (data.tier==gridTierUpCost('rp',id)) b = b.mul(2.15)
            if (data.tetr>=1) b=b.mul(Math.pow(2,data.tetr+1))
            if (data.tetr==gridTetrUpCost('rp',id)) b = b.mul(10.55)
            if (data.pent>=1) b=b.mul(Math.pow(2,data.pent+1))
            if (data.pent==gridPentUpCost('rp',id)) b = b.mul(1250)
            if (data.hex>=1) b=b.mul(Math.pow(1.25,data.hex+1))
            if (data.oct>=1) b=b.mul(Math.pow(1e22,data.oct+1))
            if (b.gte(new Decimal(`1.79769e308`))) b= Decimal.dInf
            return b
        },
        getStartCost(data,id) {
let rowBoost = Math.floor(id/100)
            let cost = new Decimal(10).pow(new Decimal(id%100).sub(1).mul(7).add(new Decimal(20).mul(new Decimal(id/100).floor().sub(1)))).mul(new Decimal(1e25).mul(new Decimal(id/100).floor().sub(1)).max(1)).div(100)
            if (id%100<=2 && id/100<2) cost = new Decimal(10).mul(10000**((id%100)-1))
            if (id==201) cost = new Decimal(1e39)
            if (id==202) cost = new Decimal(1e95)
            if (id==203) cost = new Decimal(1e196)
            
return cost
        },
        getUnlocked(id) { // Default
            if (id==104) return false
            if (Math.floor(id/100)>=3) return player.rp.points.gte(3+(id%100)+Math.floor(id/100))
            if (Math.floor(id/100)>=2) return player.rp.points.gte(1+(id%100)+Math.floor(id/100))
            else if (((id%100)<=tmp.rp.grid.cols) && (Math.floor(id/100)<=tmp.rp.grid.rows))return true
        },
        getCanClick(data, id) {
            return true
        },
        tierUpCost(data,id) {
            let tierUp = new Decimal(4)
            if (data.tier>=1){
                tierUp=tierUp.mul(new Decimal(data.tetr).div(2).add(1))
            if (hasUpgrade('rp',12)&&data.tier) tierUp = tierUp.sub(upgradeEffect('rp',12))
            }
            return tierUp
        },
        tetrUpCost(data,id) {
            let tetrUp = new Decimal(10)
            if (data.tetr>=1)tetrUp=tetrUp.mul(new Decimal(data.pent).div(2).add(1))
            return tetrUp
        },
        pentUpCost(data,id) {
            let pentUp = new Decimal(6)
            if (data.pent>=1)pentUp=pentUp.mul(new Decimal(data.hex).div(2).add(1))
            return pentUp
        },
        hexUpCost(data,id) {
            let hexUp = new Decimal(17)
            if (data.hex>=1)hexUp=hexUp.mul(new Decimal(data.oct).div(4).add(1)).floor()
            return hexUp
        },
        hexUpChance(data,id) {
            let ch = new Decimal(0)
            ch=player.points.max(1).div(gridCost('rp',id)).log(2).div(data.oct+1).mul(2).mul(hasUpgrade('rp',63)?upgradeEffect('rp',63):1).max(0)
            ch=softcap(ch,new Decimal(20),0.15)
            return ch
        },
        onClick(data, id) { 
            gridBgColor('rp',id)
            let chance = Math.random()
if (hasUpgrade('rp',61)&&new Decimal(data.hex).gte(gridHexUpCost('rp',id))&& player.points.gte(gridCost('rp',id))) {
    if (chance<(gridHexUpChance('rp',id).div(100))) {
    player.points = new Decimal(0)
    data.oct++
    data.pent=1
    data.tetr=1
    data.tier=1  
    data.hex=1
    }
    else player.points = player.points.div(gridCost('rp',id));
}
if (new Decimal(data.pent).gte(gridPentUpCost('rp',id))&& player.points.gte(gridCost('rp',id))&&(player.rp.activeChallenge!=12)) {
    data.hex++
    if(!hasUpgrade('rp',33)) {
        player.points = new Decimal(0)
        data.pent=1
        data.tetr=1
        data.tier=1
        }
    }
if (new Decimal(data.tetr).gte(gridTetrUpCost('rp',id))&& player.points.gte(gridCost('rp',id))) {
    if (!hasUpgrade('rp',23))player.points = new Decimal(0)
    data.pent++
    if (!hasUpgrade('rp',23)){data.tetr=1
    data.tier=1}
    }
if (new Decimal(data.tier).gte(gridTierUpCost('rp',id))&& player.points.gte(gridCost('rp',id))&&(player.rp.activeChallenge!=11)) {
    if (!hasUpgrade('rp',23))player.points = new Decimal(0)
    data.tetr++
    if (!hasUpgrade('rp',23))data.tier=1
}
else if (data.tier>=1 && player.points.gte(gridCost('rp',id))){
player.points = player.points.sub(gridCost('rp',id))
if (player.rp.activeChallenge==11 && data.tier>=tmp.rp.challenges[11].rankCap) return
else data.tier++
}
else if (data.tier<1 && player.points.gte(gridStartCost('rp',id))){
    if (player.rp.activeChallenge==12 && ((Math.floor(id/200)*3+id%100)>tmp.rp.challenges[12].rankCap)) return 
    player.points = player.points.sub(gridStartCost('rp',id))
    data.tier++
    player.rp.total++}
        },
        onHold(data, id) { 
            let chance = Math.random()
            if (hasUpgrade('rp',61)&&new Decimal(data.hex).gte(gridHexUpCost('rp',id))&& player.points.gte(gridCost('rp',id))) {
                player.points = player.points.sub(gridCost('rp',id))
                if (chance<(gridHexUpChance('rp',id).div(100))) {
                player.points = new Decimal(0)
                data.oct++
                data.pent=1
                data.tetr=1
                data.tier=1  
                data.hex=1
                }
                else return;
            }
            if (new Decimal(data.pent).gte(gridPentUpCost('rp',id))&& player.points.gte(gridCost('rp',id))&&(player.rp.activeChallenge!=12)) {
                data.hex++
                if(!hasUpgrade('rp',33)) {
                    player.points = new Decimal(0)
                    data.pent=1
                    data.tetr=1
                    data.tier=1
                    }
                }
            if (new Decimal(data.tetr).gte(gridTetrUpCost('rp',id))&& player.points.gte(gridCost('rp',id))) {
                if (!hasUpgrade('rp',23))player.points = new Decimal(0)
                data.pent++
                if (!hasUpgrade('rp',23)){data.tetr=1
                    data.tier=1}
                }
            if (new Decimal(data.tier).gte(gridTierUpCost('rp',id))&& player.points.gte(gridCost('rp',id))&&player.rp.activeChallenge!=11) {
                if (!hasUpgrade('rp',23))player.points = new Decimal(0)
                data.tetr++
                if (!hasUpgrade('rp',23))data.tier=1
            }
else if (data.tier>=1 && player.points.gte(gridCost('rp',id))){
    if (player.rp.activeChallenge==12 && ((Math.floor(id/200)*3+id%100)>tmp.rp.challenges[12].rankCap)) return 
    player.points = player.points.sub(gridCost('rp',id))
    if (player.rp.activeChallenge==11 && data.tier>=tmp.rp.challenges[11].rankCap) return
    else data.tier++
    }
                            else if (data.tier<1 && player.points.gte(gridStartCost('rp',id))){
                player.points = player.points.sub(gridStartCost('rp',id))
                data.tier++
                player.rp.total++}
                    },
        getEffect(data, id) {
            let eff = new Decimal(2)
            let eff2 = new Decimal(2)
            let base = new Decimal(0.75)
            let tetrBase = new Decimal(1.85)
            if (hasUpgrade('rp',51)) tetrBase = tetrBase.mul(2.55)
            let pentBase = new Decimal(11.25)
            let hexBase = new Decimal(36.75)
            let octBase = new Decimal(1.763e4)
            let thirdSoftcapStart = new Decimal(1e18)
            let thirdSoftcapPower = new Decimal(0.05)
            if (hasUpgrade('rp',52)) thirdSoftcapPower = new Decimal(0.075)
            if (hasUpgrade('rp',53)) {
                pentBase=pentBase.mul(8.95)
                hexBase=hexBase.mul(2.35)
            }
            if (challengeCompletions('rp',11)>=1) thirdSoftcapStart = thirdSoftcapStart.mul(challengeEffect('rp',11))
            if (challengeCompletions('rp',12)==4) thirdSoftcapStart = thirdSoftcapStart.mul(challengeEffect('rp',12).max(1).pow(0.1))
            if (hasUpgrade('rp',42)) thirdSoftcapStart = thirdSoftcapStart.mul(upgradeEffect('rp',42))
            let tetrEff= new Decimal(Decimal.pow(tetrBase,data.tetr+1))
            tetrEff=softcap(tetrEff,new Decimal(1e50),0.005)
            let pentEff= new Decimal(Decimal.pow(pentBase,data.pent+1))
            let hexEff= new Decimal(Decimal.pow(hexBase,data.hex+1)).mul((hexBase)**(data.hex+1))
            let octEff= new Decimal(Decimal.mul(octBase,(data.oct+1)*10**(hasUpgrade('rp',63)?upgradeEffect('rp',63):1))).div(id%100+Math.floor(id/200)*3).mul(2.763+(data.oct*15)**2)
            if (data.tier>=1) eff = eff.pow(data.tier+1).pow(base)
            if ((id%100)>=2) eff = eff.max(1).log(8+(id%100)).add(1)
            if (data.tetr>=1) eff = eff.mul(tetrEff)
            if (data.pent>=1) eff = eff.mul(pentEff)
            if (data.hex>=1) eff = eff.mul(hexEff)
            if (hasUpgrade('rp',11)&&(id/100<2 || id==201)) eff = eff.mul(upgradeEffect('rp',11))
            if (hasUpgrade('rp',21)&&id==103) eff = eff.mul(upgradeEffect('rp',21))
            if (hasUpgrade('rp',31)&&id==201) eff = eff.mul(upgradeEffect('rp',31))
            if (challengeCompletions('rp',12)>=1&&id==202) eff = eff.mul(challengeEffect('rp',12))
            if (!hasUpgrade('rp',23)) eff=softcap(eff,new Decimal(1000),new Decimal(0.75))
            eff=softcap(eff,new Decimal(1e6),player.rp.activeChallenge==12?new Decimal(0.225).mul(hasUpgrade('rp',51)?2.75:1):new Decimal(0.15))
            eff=softcap(eff,thirdSoftcapStart,thirdSoftcapPower)
            if (data.oct>=1) eff = eff.mul(octEff)
            return {eff: eff,eff2: octEff}
},
        getDisplay(data, id) {
            if (data.tier==0) return "<h4>This is an Empty Slot. Craft a Ranking to proceed.<br>Cost to craft: "+format(gridStartCost('rp',id),3)+" points</h4>"
            const effects = {
                normal: data.oct>=1?"<b>x{}(x<> - hex)</b><br> to <b>points gain</b>":"<b>x{}</b> to <b>points gain</b>",
                starred: "Booosts <b>stars gain</b> by <b>x{}</b>",
                scaled: "Boosts <b>booster points gain</b> by <b>x{}</b>",
                sideways: "Boosts <b>booster power</b> by <b>^{}</b>",
            }
            const effects2 = {
                normal: "(Boost Power: x[]) ",
                starred: "(Boost Power: x[]) ",
                scaled: "(Boost Power: x[]) ",
                sideways: "(Boost Power: x[]) ",
            }

            return `<h3>Rank ${formatRoman(data.tier)}</h3>${data.tetr>=1?` | <h3>Tier ${formatRoman(data.tetr)}</h3>`:''}${data.pent>=1?`<br><h3>Tetr ${formatRoman(data.pent)}</h3>`:''}${data.hex>=1?` | <h3>Pent ${formatRoman(data.hex)}</h3>`:''}${data.oct>=1?` | <h2>Hex ${formatRoman(data.oct)}</h2>`:''}
                <h4>${effects["normal"].replace("{}", format(this.getEffect(data, id).eff,4)).replace("<>", format(this.getEffect(data, id).eff2,2))+(data.hex>=1&&hasUpgrade('rp',61)?'<br><b>To Hex up, reach Pent '+formatRoman(gridHexUpCost('rp',id))+(new Decimal(data.hex).gte(gridHexUpCost('rp',id))?".<br>Hex Up Chance - ("+format(gridHexUpChance('rp',id),2)+"%)":''):'')+(data.pent>=1&&hasUpgrade('rp',22)?'<br><b>To pent up, reach Tetr '+formatRoman(gridPentUpCost('rp',id))+"</b>":'')+(data.tetr>=1&&!hasUpgrade('rp',61)?'<br><b>To tetr up, reach Tier '+formatRoman(gridTetrUpCost('rp',id))+"</b>":'')+(data.tier>=1&&!hasUpgrade('rp',22)?'<br><b>To tier up, reach Rank '+formatRoman(gridTierUpCost('rp',id))+"</b>":'')+'<br><b>Cost to tier up: '+format(gridCost('rp',id))+" booster points</b></h4>"}
            `

        },
    },

    update(diff) {
        if (hasUpgrade('rp',43)) {
            num = 202
            data = player.rp.grid[num]
            chance=Math.random()
            if (hasUpgrade('rp',61)&&new Decimal(data.hex).gte(gridHexUpCost('rp',num))) return;
        if (new Decimal(data.pent).gte(gridPentUpCost('rp',num))&& player.points.gte(gridCost('rp',num))&&(player.rp.activeChallenge!=12)) {
            if(!hasUpgrade('rp',33)) {
                player.points = new Decimal(0)
                data.pent=1
                data.tetr=1
                data.tier=1
                }
    data.hex++
    }
        if (new Decimal(data.tetr).gte(gridTetrUpCost('rp',num))&& player.points.gte(gridCost('rp',num))) {
            data.pent++
            }
        if (new Decimal(data.tier).gte(gridTierUpCost('rp',num))&& player.points.gte(gridCost('rp',num))&&player.rp.activeChallenge!=11) {
            data.tetr++
        }
        else if (data.tier>=1 && player.points.gte(gridCost('rp',num))){
            if (player.rp.activeChallenge==11 && data.tier>=tmp.rp.challenges[11].rankCap) return
            else data.tier++
        }
    }
        if (hasUpgrade('rp',32)) {
            num = 201
            data = player.rp.grid[num]
            chance=Math.random()
            if (hasUpgrade('rp',61)&&new Decimal(data.hex).gte(gridHexUpCost('rp',num))) return;
        if (new Decimal(data.pent).gte(gridPentUpCost('rp',num))&& player.points.gte(gridCost('rp',num))&&(player.rp.activeChallenge!=12)) {
            if(!hasUpgrade('rp',33)) {
                player.points = new Decimal(0)
                data.pent=1
                data.tetr=1
                data.tier=1
                }
    data.hex++
    }
        if (new Decimal(data.tetr).gte(gridTetrUpCost('rp',num))&& player.points.gte(gridCost('rp',num))) {
            data.pent++
            }
        if (new Decimal(data.tier).gte(gridTierUpCost('rp',num))&& player.points.gte(gridCost('rp',num))&&player.rp.activeChallenge!=11) {
            data.tetr++
        }
        else if (data.tier>=1 && player.points.gte(gridCost('rp',num))){
            if (player.rp.activeChallenge==11 && data.tier>=tmp.rp.challenges[11].rankCap) return
            else data.tier++
        }
    }
        if (hasUpgrade('rp',31)) {
            data = player.rp.grid[103]
            chance=Math.random()
            if (hasUpgrade('rp',61)&&new Decimal(data.hex).gte(gridHexUpCost('rp',103))) return;
        if (new Decimal(data.pent).gte(gridPentUpCost('rp',103))&& player.points.gte(gridCost('rp',103))&&(player.rp.activeChallenge!=12)) {
            if(!hasUpgrade('rp',33)) {
                player.points = new Decimal(0)
                data.pent=1
                data.tetr=1
                data.tier=1
                }
    data.hex++
    }
        if (new Decimal(data.tetr).gte(gridTetrUpCost('rp',103))&& player.points.gte(gridCost('rp',103))) {
            data.pent++
            }
        if (new Decimal(data.tier).gte(gridTierUpCost('rp',103))&& player.points.gte(gridCost('rp',103))&&player.rp.activeChallenge!=11) {
            data.tetr++
        }
        else if (data.tier>=1 && player.points.gte(gridCost('rp',103))){
            if (player.rp.activeChallenge==11 && data.tier>=tmp.rp.challenges[11].rankCap) return
            else data.tier++
        }
    }
    if (hasUpgrade('rp',13)) {
        data = player.rp.grid[101]
        data2 = player.rp.grid[102]
        chance=Math.random()
        if (hasUpgrade('rp',61)&&new Decimal(data2.hex).gte(gridHexUpCost('rp',102))) return;
        if (new Decimal(data2.pent).gte(gridPentUpCost('rp',102))&& player.points.gte(gridCost('rp',102))&&(player.rp.activeChallenge!=12)) {
            player.points = new Decimal(0)
            data2.hex++
            if(!hasUpgrade('rp',33)) {
                player.points = new Decimal(0)
                data2.pent=1
                data2.tetr=1
                data2.tier=1
                }
            }
        if (new Decimal(data2.tetr).gte(gridTetrUpCost('rp',102))&& player.points.gte(gridCost('rp',102))) {
            data2.pent++
            if (!hasUpgrade('rp',23)){data2.tetr=1
                data2.tier=1}
            }
        if (new Decimal(data2.tier).gte(gridTierUpCost('rp',102))&& player.points.gte(gridCost('rp',102))&&player.rp.activeChallenge!=11) {
            data2.tetr++
        }
        else if (data2.tier>=1 && player.points.gte(gridCost('rp',102))){
            if (player.rp.activeChallenge==11 && data2.tier>=tmp.rp.challenges[11].rankCap) return
            else data2.tier++
        }
}
    else if (hasUpgrade('rp',13)) {
        data = player.rp.grid[101]
        chance=Math.random()
        if (hasUpgrade('rp',61)&&new Decimal(data.hex).gte(gridHexUpCost('rp',101))) return;
        if (new Decimal(data.pent).gte(gridPentUpCost('rp',101))&& player.points.gte(gridCost('rp',101))&&(player.rp.activeChallenge!=12)) {
            data.hex++
            if(!hasUpgrade('rp',33)) {
                player.points = new Decimal(0)
                data.pent=1
                data.tetr=1
                data.tier=1
                }
            }
                if (new Decimal(data.tetr).gte(gridTetrUpCost('rp',101))&& player.points.gte(gridCost('rp',101))) {
                    data.pent++
                    }
                if (new Decimal(data.tier).gte(gridTierUpCost('rp',101))&& player.points.gte(gridCost('rp',101))&&player.rp.activeChallenge!=11) {
                    data.tetr++
                }
                else if (data.tier>=1 && player.points.gte(gridCost('rp',101))){
                    if (player.rp.activeChallenge==11 && data.tier>=tmp.rp.challenges[11].rankCap) return
                    else data.tier++
                }
}
    if (player.points.gte(new Decimal(`1.79769e308`))) player.points = player.points.min(new Decimal(`1.79769e308`))
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)

    hotkeys: [
        {key: "b", description: "b: Reset for booster points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
