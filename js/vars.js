var vars = {
    DEBUG: true,

    audio: {
        volumeOfCoins: 0.2
    },

    canvas: {
        width: 1920,
        height: 1080,
        cX: 1920/2,
        cY: 1080/2,
    },

    colours: {
        backgrounds: [
            [[0x440000],[0x990000],[0xcc0000]],
            [[0x004400],[0x009900],[0x00cc00]],
            [[0x000044],[0x000099],[0x0000cc]]
        ]
    },

    convertors: {
        fromLetterToFrame: function(_letter) {
            return _letter.charCodeAt(0);
        }
    },

    durations: {
        moveToWinPosition: 3000,
        playAgain: 1000,
        turnDuration: 300,
        wellDone: 4000,
    },

    emitters: {
        create: function() {
            let p0 = new Phaser.Math.Vector2(0, vars.canvas.height+200);
            let p1 = new Phaser.Math.Vector2(vars.canvas.width*0.33, vars.canvas.height);
            let p2 = new Phaser.Math.Vector2(vars.canvas.width*0.66, vars.canvas.height);
            let p3 = new Phaser.Math.Vector2(vars.canvas.width, vars.canvas.height+200);

            let curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

            let max = 40;
            let points = [];
            let tangents = [];

            for (let c=0; c<=max; c++) {
                let t = curve.getUtoTmapping(c / max);
                points.push(curve.getPoint(t));
                tangents.push(curve.getTangent(t));
            }

            let tempVec = new Phaser.Math.Vector2();

            let spark0 = scene.add.particles('spark0').setName('fw_0');
            let spark1 = scene.add.particles('spark1').setName('fw_1');

            for (let i=0; i<points.length; i++) {
                let p = points[i];
                tempVec.copy(tangents[i]).normalizeRightHand().scale(-32).add(p);
                let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));
                let particles = (i % 2 === 0) ? spark0 : spark1;
                particles.createEmitter({ x: tempVec.x, y: tempVec.y, alpha: 0.33, angle: angle, speed: { min: -100, max: 1200 }, gravityY: 200, scale: { start: 0.4, end: 0.1 }, lifespan: 800, blendMode: 'SCREEN' });
            }
        },

        destroy: function() {
            scene.children.getByName('fw_0').destroy();
            scene.children.getByName('fw_1').destroy();
        }
    },

    files: {
        destroy: {
            images: ['cardBack', 'cardBackAlt'],
            sounds: [],
        },

        batman: {
            cardType: 'spritesheet',
            editionText: 'Lego Batman Edition',
            paragraph: '\n\n',
            welcomeData: [50, 920, 52, 1, 0.9, 1],
            images: [
                ['cardBack','images/batmanCardBack.png'],
                ['cardBackAlt','images/batmanCardBackSilver.png'],
            ],
            cards: {
                spritesheet: ['batmanLego','imageSets/batmanLego.png', 200, 260, 1, 2]
            },
            font: ['batFont','fonts/batFont.png','fonts/batFont.xml'],
            sounds: {
                good: ['batmanYes1.ogg','batmanYes2.ogg','batmanYes3.ogg','batmanYes4.ogg','batmanYes5.ogg'],
                bad:  ['batmanNo1.ogg','batmanNo2.ogg','batmanNo3.ogg','batmanNo4.ogg','batmanNo5.ogg','batmanNo6.ogg','batmanNo7.ogg'],
                win:  'batmanWin.ogg'
            }
        },

        dragons: {
            cardType: 'spritesheet',
            editionText:'Dragons: Rescue Riders Edition',
            paragraph: '\n',
            welcomeData: [50, 905, 80, 1, 1.73, 1],
            images: [
                ['cardBack','images/dragonsCardBack.png'],
                ['cardBackAlt','images/dragonsCardBackSilver.png'],
            ],
            cards: {
                spritesheet: ['dragonsRR', 'imageSets/dragonsRR.png', 200, 260, 1, 2]
            },
            font: ['dragonFont','fonts/dragonsRRFont.png','fonts/dragonsRRFont.xml'],
            sounds: {
                good: [],
                bad: [],
                win: 'dragonsWin.ogg',
                init: function() {
                    this.bad = Phaser.Utils.Array.NumberArray(1,17,'dragonsNo','.ogg');
                    this.good = Phaser.Utils.Array.NumberArray(1,8,'dragonsYes','.ogg');
                }
            },

            init: function() {
                this.sounds.init();
            }
        },

        starWarsLego: {
            cardType: 'spritesheet',
            editionText: 'Lego Star Wars Edition',
            paragraph: '\n',
            welcomeData: [70,885,100,1,1.1,1],
            images: [
                ['cardBack','images/sWLCardBack.png'],
                ['cardBackAlt','images/sWLCardBackSilver.png'],
            ],
            cards: {
                spritesheet: ['starWarsLego','imageSets/legoStarWars.png', 200, 260, 1, 2]
            },
            font: ['starFont','fonts/starFont.png','fonts/starFont.xml'],
            sounds: {
                good: ['starWarsYes1.ogg','starWarsYes2.ogg','starWarsYes3.ogg','starWarsYes4.ogg','starWarsYes5.ogg','starWarsYes6.ogg','starWarsYes7.ogg'],
                bad:  ['starWarsNo1.ogg','starWarsNo2.ogg','starWarsNo3.ogg','starWarsNo4.ogg','starWarsNo5.ogg','starWarsNo6.ogg','starWarsNo7.ogg','starWarsNo8.ogg','starWarsNo9.ogg'],
                win:  'starWarsWin.ogg'
            }
        },

        loadAssets: function() {
            let files;
            switch (vars.imageSets.current) {
                case 'batmanLego': files = vars.files.batman; multiLoader(files); break;
                case 'dragonsRR': files = vars.files.dragons; files.init(); multiLoader(files); break;
                case 'starWarsLego': files = vars.files.starWarsLego; multiLoader(files); break;
            }
        }
    },

    imageSets: {
        available: ['batmanLego','starWarsLego', 'dragonsRR'],
        fileName: ['batman','starWarsLego','dragons'],
        current: 'dragonsRR',
        currentFName: -1,
    },

    localStorage: {
        init: function() {
            let lS = window.localStorage;
            let gV = vars.game;
            if (lS.match2_selectedGame===undefined) {
                lS.match2_selectedGame='batmanLego';
                lS.match2_best=999;
                lS.match2_bgColour='2,0';
                gV.bestScore=999;
            } else {
                gV.bestScore=parseInt(lS.match2_best);
                vars.imageSets.current = lS.match2_selectedGame;
            }

            // updates since caleb first played the game
            if (lS.match2_bgColour===undefined) {
                lS.match2_bgColour='2,0';
            } else {
                gV.bgColour= lS.match2_bgColour;
            }

            // score system
            if (lS.match2_playerScore===undefined) {
                lS.match2_playerScore=0;
                gV.score = 0;
            } else {
                gV.score = parseInt(lS.match2_playerScore);
            }
        },

        checkForBestScore: function() {
            let lS = window.localStorage;
            let gV = vars.game;
            if (gV.moves<parseInt(lS.match2_best)) {
                let newHighScore = vars.game.moves;
                lS.match2_best = newHighScore;
                gV.bestScore = newHighScore;
            }
            vars.cards.pairsLeft[0]=vars.cards.pairsLeft[1];
        },

        saveScore: function(_newScore=0) {
            if (_newScore>0) {
                let lS = window.localStorage;
                lS.match2_playerScore=_newScore;
            }
        },

        updateBGColour: function() {
            let lS = window.localStorage;
            lS.match2_bgColour = vars.game.bgColour;
        },

        updateCardSet: function(_cardSet=null) {
            if (_cardSet===null) { console.warn('You forgot to send the cardSet you wanted!'); return false; }
            let lS = window.localStorage;
            let needsReset = false;
            let possibleDestruction = lS.match2_selectedGame;
            if (_cardSet!==possibleDestruction) {
                // check for valid card set
                let valid = false;
                for (avail of vars.imageSets.available) { if (_cardSet===avail) { valid=true; break; } }
                // was a valid card set found that wasnt already selected?
                if (valid===true) { lS.match2_selectedGame=_cardSet; needsReset=true; } else { return false; }
                // we need to delete the old cardBack and Alt
                for (image of vars.files.destroy.images) {
                    scene.textures.removeKey(image);
                }
                for (s of vars.files.destroy.sounds) {
                    scene.cache.audio.remove(s);
                }
                // deal with the new deck
                if (needsReset===true) { scene.registry.destroy(); scene.events.off(); scene.scene.restart(); } else { return false; }
            } else {
                return false;
            }
        }
    },

    animate: {
        cardsToFound: function(_cardNumber) {
            if (vars.DEBUG===true) { console.log('Spinning the cards to the found area'); }
            let cardA = scene.children.getByName('card_' + _cardNumber + '_a');
            cardA.setDepth(2);
            let cardB = scene.children.getByName('card_' + _cardNumber + '_b');
            cardB.setDepth(1).setTint(0x888888);

            let cV = vars.cards;
            let spinToCol = _cardNumber%3; // col 0, 1 or 2
            let spinToRow = ~~(_cardNumber/3); // row 0, 1 or 2
            let x = cV.spinToOffsets[0] + (spinToCol * (cV.cardWidth/2+60));
            let y = cV.spinToOffsets[1] + (spinToRow * (cV.cardHeight/2+60));

            let rndAngle = Math.random()*0.5*Phaser.Math.RND.sign();
            rndAngle = ~~(rndAngle*1000)/1000;
            rndAngle += Math.PI*3;
            if (vars.DEBUG===true) { console.log('rndAngle: ' + rndAngle); }
            let duration = vars.durations.moveToWinPosition;
            scene.tweens.add({
                targets: cardA,
                x: x,
                y: y,
                scale: 0.5,
                rotation: Math.PI*3+rndAngle,
                ease: 'Cubic.easeOut',
                duration: duration,
            });
            scene.tweens.add({
                targets: cardB,
                x: x+10,
                y: y+10,
                scale: 0.5,
                rotation: Math.PI*3+rndAngle,
                ease: 'Cubic.easeOut',
                duration: duration,
            });
        },

        toDefaultState: function() {
            let cV = vars.cards;
            let selected = cV.selected;
            let selectedPair = cV.selectedPair;

            let card1Name = 'card_' + selected[0][0] + '_' + selectedPair[0];
            let back1Name = 'back_' + selected[0][0] + '_' + selectedPair[0];

            let card2Name = 'card_' + selected[1][0] + '_' + selectedPair[1];
            let back2Name = 'back_' + selected[1][0] + '_' + selectedPair[1];

            let card1 = scene.children.getByName(card1Name);
            let back1 = scene.children.getByName(back1Name);
            let card2 = scene.children.getByName(card2Name);
            let back2 = scene.children.getByName(back2Name);

            let duration = vars.durations.turnDuration/2;

            scene.tweens.add({
                targets: [card1,card2],
                delay: duration*3,
                scaleX: 0,
                duration: duration
            })
            scene.tweens.add({
                targets: [back1,back2],
                delay: duration*4,
                scaleX: 1,
                duration: duration,
                onComplete: vars.input.enable,
            })
        }
    },

    audio: {
        no: [],
        noUsed: [],
        win: null,
        yes: [],
        yesUsed: [],

        lastSoundCheck: function(__type) {
            if (vars.audio[__type].length===0) {
                if (vars.DEBUG===true) { console.log('This was the last ' + __type + ' sound. Resetting the available sounds array'); }
                vars.audio[__type] = vars.audio[__type + 'Used'];
                vars.audio[__type + 'Used'] = [];
            }
        },

        playSound: function(_type) {
            let aV = vars.audio;
            let audioKey = null;
            if (_type==='yes') {
                // grab a yes sound
                audioKey = aV.yes.splice(0,1);
                aV.yesUsed.push(audioKey);
            } else if (_type==='no') {
                // grab a no sound
                audioKey = aV.no.splice(0,1);
                aV.noUsed.push(audioKey);
            } else if (_type==='win') {
                // play the win sound
                audioKey = 'win';
            }

            if (audioKey!==null) {
                scene.sound.stopAll();
                scene.sound.play(audioKey);
                aV.lastSoundCheck(_type);
            }
        }
    },

    cards: {
        cardArray: [],
        cardsUsed: [],
        cardPosArray: [],
        cardWidth: 200,
        cardHeight: 260,
        options: [['cmd_batmanLego','batmanButton'],['cmd_starWarsLego','starWarsButton'], ['cmd_dragonsRR', 'dragonsButton']],
        pairsLeft: [9,9],
        spinToOffsets: [1450,150],
        selected: [],
        selectedPair: [],

        addCardToSelected: function(_tween,_card) {
            let cV = vars.cards;
            cV.selected.push(_card[0].getData('cardID'));
            cV.selectedPair.push(_card[0].getData('pair'));
            if (cV.selected.length===2) { // 2nd card has been clicked
                vars.cards.checkForPair();
            }
        },

        allFaceDown: function() {
            let first = true;
            let duration = vars.durations.turnDuration/2;
            scene.groups.cardsGroup.children.each( (c)=> {
                let onComplete = null;
                if (first===true) {
                    first = false;
                    onComplete = vars.cards.showCardBacks;
                }
                scene.tweens.add({
                    targets: c,
                    delay: 1750,
                    scaleX: 0,
                    duration: duration,
                    onComplete: onComplete
                })
            })
        },

        buildDefaultArrays: function() {
            vars.cards.cardArray = Phaser.Utils.Array.NumberArray(0,8); // 9 individual cards in each set
            vars.cards.cardPosArray = Phaser.Utils.Array.NumberArray(0,17); // <-- total positions = 18
        },

        checkForPair: function() {
            if (vars.DEBUG===true) { console.log('Checking for pair...'); }
            let cV = vars.cards;
            let aV = vars.audio;
            let gV = vars.game;
            vars.input.disable();
            gV.moves++;

            // do we have a pair?
            let card1 = cV.selected[0][0]; let card2 = cV.selected[1][0];
            if (card1===card2) { // YES
                // enable input again
                vars.input.enable();
                // update the found count
                cV.pairsLeft[0]--;
                if (cV.pairsLeft[0]>0) { // do we have pairs still to find?
                    // play yes sound
                    aV.playSound('yes');
                } else { // all pairs found!
                    vars.game.playerWin(gV);
                }
                // send the 2 cards to the found group
                if (vars.DEBUG===true) { console.log('Pair found!'); }
                vars.animate.cardsToFound(card1);
            } else { // NO
                // turn the 2 cards back over
                if (vars.DEBUG===true) { console.log('This ISNT a pair :('); }
                // play no sound
                aV.playSound('no');
                vars.animate.toDefaultState();
            }
    
            // next empty out the selected array
            cV.selected=[];
            cV.selectedPair=[];
        },

        showCardBacks: function() {
            // set all backs to visible
            scene.groups.cardBacksGroup.children.each( (c)=> {
                c.setVisible(true);
                let duration = vars.durations.turnDuration/2;
                scene.tweens.add({
                    targets: c,
                    scaleX: 1,
                    duration: duration
                })
            })
        },

        showThisCard: function(_card) {
            if (vars.input.enabled===false) { return false; }
            if (vars.DEBUG===true) { console.log('Showing This card'); }
            let cardName = _card.name; // this is the back of the card
            cardName = cardName.match(/\w+_([0-9])_([ab])/);
            cardName = 'card_' + cardName[1] + '_' + cardName[2];
            if (vars.DEBUG===true) { console.log('Looking for ' + cardName); }
            let card = scene.children.getByName(cardName);

            let duration = vars.durations.turnDuration/2;

            // we now have the back of the card as "_card" and the front as "card"
            scene.tweens.add({
                targets: _card,
                scaleX: 0,
                duration: duration
            })
            scene.tweens.add({
                targets: card,
                delay: duration,
                scaleX: 1,
                duration: duration,
                onComplete: vars.cards.addCardToSelected,
                onCompleteParams: [ card ]
            })
        }
    },

    game: {
        moves: 0,
        score: -1,
        bestScore: -1,
        bgColour: '2,0',

        getScore: function() {
            let prize = 0;
            let gV = vars.game;
            if (gV.moves===9) {
                prize = 5000;
            } else if (gV.moves>=10 && gV.moves<=12) {
                prize = 2000;
            } else if (gV.moves===13) {
                prize = 1500;
            } else if (gV.moves>=14 && gV.moves<=19) {
                prize = 500;
            } else if (gV.moves>=20 && gV.moves<=29) {
                prize = 250;
            } else if (gV.moves>=30 && gV.moves<=39) {
                prize = 200;
            } else if (gV.moves>=40) {
                prize = 100;
            }
            gV.score+=prize;

            // save the users score
            vars.localStorage.saveScore(gV.score);
        },

        init: function() {
            let gV = vars.game;
            gV.moves=0;
            let cV = vars.cards;
            let xyOffset = 10;
            let xInc = cV.cardWidth+xyOffset;
            let yInc = cV.cardHeight+xyOffset;
            let cardSet = vars.imageSets.current;
            let cardArray = cV.cardArray;
            let cardPosArray = cV.cardPosArray;
            let cCX = cV.cardWidth/2 + 10;
            let cCY = cV.cardHeight/2 + 10;

            if (scene.children.getByName('gameBG')===null) { 
                let colour = vars.game.bgColour.split(',');
                scene.add.image(vars.canvas.cX, vars.canvas.cY, 'background').setName('gameBG').setTint(vars.colours.backgrounds[colour[0]][colour[1]]); 
            }

            for (let c=0; c<9; c++) {
                let index = Phaser.Math.RND.between(0, cardArray.length-1);
                index = cardArray.splice(index,1); // remove the card from the array

                // get 2 positions from the positions array
                let pos1 = Phaser.Math.RND.between(0, cardPosArray.length-1);
                pos1 = cardPosArray.splice(pos1,1);
                if (vars.DEBUG===true && vars.VERBOSE===true) { console.log('Pos1: ' + pos1); }

                let pos2 = Phaser.Math.RND.between(0, cardPosArray.length-1);
                pos2 = cardPosArray.splice(pos2,1);
                if (vars.DEBUG===true && vars.VERBOSE===true) { console.log('Pos2: ' + pos2); }

                // figure out the position on screen for these cards
                let xPos1 = pos1%6;
                let yPos1 = ~~(pos1/6);
                let xPos2 = pos2%6;
                let yPos2 = ~~(pos2/6);

                // place the 2 cards
                // card 1
                let x = xPos1 * xInc + cCX; let y = yPos1 * yInc + cCY;
                let picA = scene.add.sprite(x,y,cardSet,index).setName('card_' + index + '_a');
                picA.setData({ cardID: index, pair: 'a', x: x, y: y, xPos: xPos1, yPos: yPos1 }).setInteractive();
                // back of 1st card pair
                let cardBackA = scene.add.sprite(x,y,'cardBack').setScale(0,1).setVisible(false).setName('back_' + index + '_a').setInteractive();
                // card 2
                x = xPos2 * xInc + cCX; y = yPos2 * yInc + cCY;
                let picB = scene.add.sprite(x,y,cardSet,index).setName('card_' + index + '_b');
                picB.setData({ cardID: index, pair: 'b', x: x, y: y, xPos: xPos2, yPos: yPos2, visible: true }).setInteractive();
                // back of 2nd card pair
                let cardBackB = scene.add.sprite(x,y,'cardBack').setScale(0,1).setVisible(false).setName('back_' + index + '_b').setInteractive();

                scene.groups.cardsGroup.addMultiple([picA,picB]);
                scene.groups.cardBacksGroup.addMultiple([cardBackA,cardBackB]);
            }
        },

        playerWin: function(_gV) {
            vars.game.getScore();
            vars.emitters.create();
            vars.localStorage.checkForBestScore();
            // play win sound
            vars.audio.playSound('win');
            // create the win message
            let wellDone=null;
            let playAgain = null;
            let iC = vars.imageSets.current;
            if (iC==='batmanLego') {
                wellDone = scene.add.bitmapText(50, 450, 'batFont', 'Well Done!\n\nYou completed it in\n\n' + _gV.moves + ' moves!', 64, 1).setAlpha(0).setName('wellDone');
                playAgain = scene.add.bitmapText(150, 550, 'batFont', '@ Play Again? @', 64, 1).setAlpha(0).setName('playAgain').setTint(0xffff00).setInteractive();
            } else if (iC==='starWarsLego') {
                wellDone = scene.add.bitmapText(110, 450, 'starFont', 'Well Done!\nYou completed it in\n' + _gV.moves + ' moves!', 142, 1).setAlpha(0).setName('wellDone');
                playAgain = scene.add.bitmapText(150, 550, 'starFont', '@ Play Again? @', 142, 1).setAlpha(0).setName('playAgain').setTint(0xffff00).setInteractive();
            } else if (iC==='dragonsRR') {
                wellDone = scene.add.bitmapText(110, 450, 'dragonFont', 'Well Done!\nYou completed it in\n' + _gV.moves + ' moves!', 142, 1).setAlpha(0).setName('wellDone').setScale(1.25,1);
                playAgain = scene.add.bitmapText(250, 550, 'dragonFont', 'Play Again', 142, 1).setAlpha(0).setName('playAgain').setTint(0xffff00).setInteractive().setScale(1.73,1);
            } else {
                console.error('** The wellDone and playAgaint wasnt been set up! **')
            }

            // show the well done message
            let dV = vars.durations;
            scene.tweens.add({
                targets: wellDone,
                delay: dV.moveToWinPosition/2,
                alpha: 1,
                y: 100,
                duration: dV.wellDone
            })

            // show the play again button
            scene.tweens.add({
                targets: playAgain,
                delay: dV.wellDone + dV.moveToWinPosition/2, // <== the time for the cards to move to the win position on screen
                alpha: 1,
                duration: dV.playAgain
            })
        },

        restart: function() {
            // CLEAN UP
            // re initialise all the variables
            let cV = vars.cards;
            cV.pairsLeft[0]=cV.pairsLeft[1];
            vars.game.moves=0;
            vars.cards.buildDefaultArrays();

            // empty out the groups
            let groups = scene.groups;
            groups.cardsGroup.children.each( (c)=> { c.destroy(); })
            groups.cardsGroup.clear();
            groups.cardBacksGroup.children.each( (c)=> { c.destroy(); })
            groups.cardBacksGroup.clear();

            // remove well done and play again
            let wD = scene.children.getByName('wellDone'); // note: if well done is visible, play again will be too. This just allows us to restart mid game
            if (wD!==null) { scene.children.getByName('wellDone').destroy(); scene.children.getByName('playAgain').destroy(); }

            // Remove fireworks
            if (scene.children.getByName('fw_0')) {
                vars.emitters.destroy();
            }

            // START THE GAME
            vars.game.init();
            vars.cards.allFaceDown();
        },

        updateScore: function() {

        }
    },

    input: {
        enabled: true,

        disable: function() {
            if (vars.input.enabled===true) {
                vars.input.enabled=false;
            }
        },

        enable: function() {
            if (vars.input.enabled===false) {
                vars.input.enabled=true;
            }
        },

        init: function() {
            scene.input.on('gameobjectdown', function (pointer, card) {
                if (card.name.includes('back')) {
                    vars.cards.showThisCard(card);
                } else if (card.name==='playAgain') {
                    vars.game.restart();
                } else if (card.name==='fullScreenButton') {
                    if (scene.scale.isFullscreen) { card.setFrame('fullScreen'); scene.scale.stopFullscreen(); } else { card.setFrame('fullScreen2'); scene.scale.startFullscreen(); }
                } else if (card.name==='restartButton') { 
                    vars.game.restart();
                } else if (card.name==='optionsButton') { 
                    vars.UI.showOptions();
                } else if (card.name.includes('bgC_')===true) { 
                    vars.UI.changeBackground(card.name.replace('bgC_','').split('_'));
                } else if (card.name==='cmd_batmanLego' || card.name==='cmd_starWarsLego' || card.name==='cmd_dragonsRR') {
                    let reset = vars.localStorage.updateCardSet(card.name.replace('cmd_',''));
                    if (reset===false) { vars.UI.optionsHide(); }
                } else {
                    if (vars.DEBUG===true) { console.log(card); }
                }
            });
        }
    },

    player: {
        name: 'friend'
    },

    UI: {

        askForName: function() {
            let nameForm = scene.add.dom(vars.canvas.cX, vars.canvas.cY).createFromCache('nameform').setAlpha(0).setName('nameForm');
            nameForm.addListener('click');
            nameForm.getChildByName('cmd_name').select();
            nameForm.on('click', function (event) {
                if (event.target.name === 'playButton') {
                    var username = this.getChildByName('cmd_name');
                    this.removeListener('click');
                    this.setVisible(false);
                    vars.player.name = username.value;
                }
            });

            scene.tweens.add({
                targets: nameForm,
                alpha: 1,
                duration: 3000,
                ease: 'Power3'
            });
        },

        changeBackground: function(_selected) {
            let s = parseInt(_selected[0]); let c = parseInt(_selected[1]); // better safe than sorry
            let tint = vars.colours.backgrounds[s][c];
            if (vars.DEBUG===true) { console.log(_selected + ', tint: ' + tint + '('+ s + ',' + c + ')'); }
            
            // set the actual tint
            scene.children.getByName('gameBG').setTint(tint[0]);

            // update the vars
            vars.game.bgColour = s + ',' + c;
            vars.localStorage.updateBGColour();

            // hide the options
            vars.UI.optionsHide();
        },

        draw: function() {
            // Options
            scene.add.image(vars.canvas.cX, vars.canvas.cY, 'whitePixel').setTint(0x000000).setScale(vars.canvas.width, vars.canvas.height).setName('optionsBG').setVisible(false);

            // Background Colours
            let x = 1440; let xInc=180; let realX=x;
            let y=200; let yInc=180;
            let m=0;

            for (s of vars.colours.backgrounds) {
                let l=0;
                for (c of s) {
                    realX=x+(l*xInc);
                    let a = scene.add.image(realX,y,'bgColour').setTint(c[0]).setName('bgC_' + m + '_' + l).setVisible(false).setInteractive().setDepth(11);
                    scene.groups.bgOptions.add(a);
                    l++;
                }
                m++; y+=yInc; realX=x;
            }
            
            // Card Set options
            scene.add.bitmapText(150, 20, 'default', 'Please select a card set...', 72, 1).setTint(0x0092DC).setName('optionsTitle').setVisible(false);
            // Full Screen Icon
            scene.add.image(1840,1000, 'fullScreenButton').setName('fullScreenButton').setData('fullScreen','false').setInteractive();
            // Options Icon
            scene.add.image(1430,1000,'optionsButton').setName('optionsButton').setInteractive();
            // Restart Icon
            scene.add.image(1640,1000, 'restartButton').setName('restartButton').setInteractive();

            // Show the Welcome message
            let iSV = vars.imageSets;
            let avail = iSV.available;
            let imageSetName = iSV.current;
            let valid=false;
            for (let i=0; i<avail.length; i++) {
                if (avail[i]===imageSetName) { // valid cardSet
                    iSV.currentFName = iSV.fileName[i];
                    valid=true; break;
                }
            }

            if (valid!==false) {
                let files = vars.files[iSV.currentFName];
                let fontName = files.font[0];
                let welcomeMsg = 'Welcome to Match 2, Caleb' + files.paragraph + files.editionText;
                let wD = files.welcomeData;
                scene.add.bitmapText(wD[0], wD[1], fontName, welcomeMsg, wD[2], wD[3]).setScale(wD[4],wD[5]);
            } else {
                console.error('Error creating the welcome message!');
            }
        },

        optionsHide: function() {
            scene.children.getByName('cmd_batmanLego').destroy();
            scene.children.getByName('cmd_starWarsLego').destroy();
            scene.children.getByName('cmd_dragonsRR').destroy();
            scene.children.getByName('optionsBG').setVisible(false);
            scene.children.getByName('optionsTitle').setVisible(false);
            scene.groups.bgOptions.children.each( (c)=> { c.setVisible(false); })
        },

        showOptions: function() {
            let UIDepth = 10;
            scene.children.getByName('optionsBG').setVisible(true).setDepth(UIDepth);
            scene.children.getByName('optionsTitle').setVisible(true).setDepth(UIDepth);
            scene.groups.bgOptions.children.each( (c)=> { c.setVisible(true); })
            let cV = vars.cards;
            let gameTypes=[];
            let xSpacing = [[],[],[-200,200],[-300,0,300]];
            // with these we can deal with anything up to 10 different card sets
            // The order (3,5,2,7) is important. It allows groups of 3 and 5 to be created before groups of 2
            if (cV.options.length%3===0) { // 3 6 or 9 games
                if (vars.DEBUG===true) { console.log('3\'s'); }
                gameTypes.push(3);
            } else if (cV.options.length%5===0) { // 5, a special case of a 2 followed by a 3
                if (vars.DEBUG===true) { console.log('5\'s'); }
                gameTypes.push([2,3]);
            } else if (cV.options.length%2===0) {
                if (vars.DEBUG===true) { console.log('2\'s'); }
                gameTypes.push(2);
            } else if (cV.options.length%7===0) { // 7, another special case of 2,3,2
                if (vars.DEBUG===true) { console.log('7\'s'); }
                gameTypes.push([2,3,2]);
            }

            let x = 650; let y = 200; let o=0; let logos = [];
            for (gT of gameTypes) {
                if (vars.DEBUG===true) { console.log('gT is ' + gT); }
                for (let xPos=0; xPos<gT; xPos++) {
                    let xOffset = xSpacing[gT][xPos]; let actualX = x+xOffset;
                    if (vars.DEBUG===true) { console.log('xOffset: ' + xOffset + '. Actual x: ' + actualX + '. y: ' + y); }
                    let buttonName = vars.cards.options[o][0]; let spriteName = vars.cards.options[o][1];
                    let a = scene.add.image(actualX, y, 'gameButtons', spriteName).setDepth(UIDepth).setName(buttonName).setInteractive();
                    logos.push(a);
                    o++;
                }
                y+=200; 
            }

            scene.tweens.add({ targets: logos, scale: 0.9, duration: 3000, yoyo: true, ease: 'Bounce', repeat: -1 })
        }
    }

}
