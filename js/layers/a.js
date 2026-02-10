const PrestigeNames = {
    normal: "Normal",
    tiering: "Tiering",
    cracked: "Cracked",
    hexagonial: "Hexagonial",
    shiny: "Shiny",
    ancient: "Ancient",
}
const PrestigeTypes = {
    0: "normal",
    1: "tiering",
    2: "cracked",
    3: "hexagonial",
    4: "shiny",
    5: "ancient",
}
function getLevelSum(id) {
    let data=player.p.grid[id]
    let sum = new Decimal(0)
    for (let i=0;i<layers.p.grid.slots();i++) {
        sum=sum.add(data.level[i])
    }
    return sum
}
function getCrystalsEffect(type='') {
    let grid = player.p.grid
    let eff = new Decimal(1)
    for (let i=0;i<layers.p.grid.slots();i++) {
        let slots = Object.keys(grid).filter(x => grid[x].slot[i]==type)
        for (let j = 0;j<slots.length;j++) {
            switch(type) {
             case 'normal': eff=eff.mul(gridEffect('p',slots[j])[i]); break;
             case 'tiering': eff=eff.add(gridEffect('p',slots[j])[i]); break;
            }
        } 
    }
    return eff
}
addLayer("p", {
    name: "Prestiges", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⛥", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches:["rp"],
    color: "#58a106",
    requires: new Decimal(`1.7975e308`), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0173, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    upgrades: {
        11: {
        title: "Prestige I",
        description: "Reduce the <b>[Level Increaser]</b> cost based on points (starts at 1e308 Points)" ,
        effect() {return player.points.max(1).div(1e308).max(1).pow(1.674)},
        effectDisplay() {return format(upgradeEffect("p",11))+"x"},
        cost: new Decimal(5),
    },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(`1e316`).pow(x.add(1).pow((x*0.15)+(x/1000))).div(hasUpgrade("p",11)?upgradeEffect("p",11):1) },
            name() {return "Level Increaser"},
            title() {return `Buyable Level - [`+format(player[this.layer].buyables[this.id],0)+`]<hr color="black"><h2>${this.name()}</h2>`},
            display() { return `<span style="font-size:12.5px">Increase max level of crystal on roll.<br><hr color="black"><br>Cost to level up: `+format(this.cost())+` points.<br> Increases max level by +`+format(this.effect(),4) +`</span>`},
            effect(x) {
                let eff = new Decimal(1).mul(Decimal.log10(x+1).mul(x)).div(1+(x/10))
                return eff.toNumber()
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            
        },
        },
    milestones: [
        {
            requirementDescription: " 1 Total Prestige Points. ",
            effectDescription: `Unlock first Alchemy Lab and automate Hex Up.<br>Remove the limit of points and Rankings costs. `,
            done() { return player.p.total.gte(1) }
        },
        {
            requirementDescription: " 2 Total Prestige Points. ",
            effectDescription: `Unlock <b>[Level Increaser] - a new buyable</b><br>Hex Up doesnt reset anything. `,
            done() { return player.p.total.gte(2) },
            unlocked() {return player.p.total.gte(1)},
        },
        {
            requirementDescription: " 5 Total Prestige Points. ",
            effectDescription: `Automate 6th Ranking, Unlock Prestige Upgrades. `,
            done() { return player.p.total.gte(5) },
            unlocked() {return player.p.total.gte(2)},
        },
        {
            requirementDescription: " 25 Total Prestige Points. ",
            effectDescription: `Keep Ranking Points upgrades on Prestige Reset. `,
            done() { return player.p.total.gte(25) },
            unlocked() {return player.p.total.gte(5)},
        },
    ],
    grid: {
        cols() {let num = 1
            return num},
            maxCols: 3,
        rows() {let rows = 1
        return rows},
        slots() {
            let num = 3
            return num
        },
        maxRows: 3, // If these are dynamic make sure to have a max value as well!
        getStartData(id) {
            return {type: 'normal', slot:[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],level:[new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],eff:[]}
        },

getBgColor(id) {
            let color = "#";
            for (var i = 0; i < 6; i++) {
                color += Math.floor(Math.random() * 10);
            }
return color
        },   
 getStyle(data, id) {
             return {
                'background-color': player.p.points.gte(gridCost('p',id))?'#444':'#171717',
                'border':'5px solid',
                
                'border-color': 'white',
                'min-width':'350px',
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
        getCost(data,id){
            let lSum=new Decimal(getLevelSum(id))
            let sum = new Decimal(lSum.mul(2.15).floor().add(lSum.mul(1.75).floor()).pow(new Decimal(lSum).add(1).log(4).max(1).floor()).pow(new Decimal(lSum.div(20)))).max(1).mul(player.p.total.mul(0.1))
            return sum
        },
        getStartCost(data,id) {
            let cost = new Decimal(1e30).pow(new Decimal(id%100).mul(2.75).add(new Decimal(20).mul(new Decimal(id/100).floor().sub(1)))).max(1).div(100)
            return cost
        },
        getUnlocked(id) { // Default
            if (id==101) return (hasMilestone('p',0))
                else return false
        },
        getCanClick(data, id) {
            return player.p.points.gte(this.getCost(data,id))
        },
        onClick(data, id) { 
            player.p.points=player.p.points.sub(gridCost('p',id))
            let typeUnlocks = 2
            let randomSlot = Math.floor(Math.random() * (this.slots()));
            let randomType = Math.floor((Math.random() * (typeUnlocks)*0.75));
            let startLevel = 1
            let maxLevel = 3
            if (player.p.buyables[11].gte(1)) maxLevel+=buyableEffect("p",11)
            let randomLevel = (Math.random() * (maxLevel - startLevel) + startLevel);
            data.slot[randomSlot] = PrestigeTypes[randomType]
            data.level[randomSlot] = new Decimal(randomLevel)
            gridBgColor('p',id)
        },
        getEffect(data, id) {
            let effect = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined]
            for (i=0;i<this.slots();i++) {
                switch(data.slot[i]){
                    case 'normal':
                        effect[i] = new Decimal(3.15).mul(1+(data.level[i]/10)).pow(data.level[i]*player.p.total.max(1).log(2).div(2).add(1))
                        effect[i]=  softcap(effect[i],new Decimal(1e10),0.5)
                        break
                    case 'tiering':
                        let base= new Decimal(.37356)
                        effect[i] = new Decimal(data.level[i]*(base.mul(Decimal.log10(player.p.total.max(1).add(1).pow(0.435)))))
                        break
                }
            }
            return effect
},
        getDisplay(data, id,i) {
            let b= gridCost('rp',id)
            let lSum=new Decimal(getLevelSum(id))
            let sum = new Decimal(lSum.mul(2.15).floor().add(lSum.mul(1.75).floor()).pow(new Decimal(lSum).add(1).log(4).max(1).floor()).pow(new Decimal(lSum.div(20)))).max(1).mul(player.p.total.mul(0.1))
            const effects = {
                normal: "<b>x{}</b> to <b>points gain</b>",
                tiering: "<b>+{}</b> to Rank's effect base in Rankings formula. ",
                cracked: "<b>b3rd Ranking's effect softcap</b> starts later by <b>x{}</b>",
                hexagonial: "Weakens <b>Hex Up Cost</b> by <b>/{}</b>",
            }
            const color={
                normal: "#58a106",
                tiering: "#19bd85",
                cracked: "#38223b",
                hexagonial: "#2eb6de",
            }
            let table=`<h2>Alchemy Lab</h2><br><br><hr color='white' size='0.65 px' width='50%'>`
            for (i=0;i<this.slots();i++){
                table+=`<p><span style='font-size:14px; color:${data.slot[i]?color[data.slot[i]]:"grey"}'>[${i+1}/${this.slots()}] | \
                ${data.slot[i]?`<`+format(data.level[i],3)+`>`:""}\
                ${data.slot[i]?PrestigeNames[data.slot[i]]:" No "} Prestige Crystal.</span><span style="font-size:12px;color:skyblue;">\
            ${data.slot[i]?effects[data.slot[i]].replace("{}", format(this.getEffect(data,id)[i],4)):""}</span>`
            }
            table+=`<hr color='white' size='0.65 px' width='50%'><br><h4>Cost to create a Prestige Crystal in a random slot:<br> <b>`+format(sum,2)+`</b> Prestige Point</b></h4>`
            return table
        },
    },
    tabFormat: {
        "Main": {
        content:[
            function() { if (player.tab == "p")  return ["column", [
            "main-display",
            'prestige-button',
            "blank",
            "grid",
			]
        ]
 },
 ]
        },
        "Upgrades": {
            unlocked() {return player.p.points.gte(1)},
            content:[
                'main-display',
                function() { if (player.tab == "p")  return ["column", [
                'prestige-button',
                "blank",
                "upgrades",
                ]
            ]
     },
     ]
            },
        "Buyables": {
                unlocked() {return player.p.points.gte(1)},
                content:[
                    'main-display',
                    function() { if (player.tab == "p")  return ["column", [
                    'prestige-button',
                    "blank",
                    "buyables",
                    ]
                ]
         },
         ]
                },
            "Milestones": {
                unlocked() {return hasMilestone("p",0)},
                content:[
                    'main-display',
                    function() { if (player.tab == "p")  return ["column", [
                    'prestige-button',
                    "blank",
                    "milestones",
                    ]
                ]
         },
         ]
                },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    update(diff) {
    },
    hotkeys: [
        {key: "p", description: "p: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.points.gte(`1.79e308`)||player.p.unlocked==true)}
})
