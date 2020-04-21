// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Common = require("Common");
var Player = require("Player");
var Netdata = require("Netdata");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        ctor () {
            this.isPlaying = false;
            this.gameLabelTimeId = null;
        },

        chessboard:{
            default: null,
            type: cc.Node,
        },

        controlboard:{
            default: null,
            type: cc.Node,
        },

        curPlayerIds:[cc.Integer],

        //总当前参与玩家
        totalPlayers: {
            default: [],
            type: [Player],
            visible:false
        },

        //当前局玩家号
        curPlayPlayerNum:cc.Integer,
        isPlaying:cc.Boolean,

        curPlaySaiziNum: {
            default: null,
            type: Netdata,
            visible:false
        },

        myLabel:{
            default: null,
            type: cc.Label,
        },

        gameLabel:{
            default: null,
            type: cc.Label,
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Player.myPlayerId = Math.ceil(Math.random()*100) % 4 + 1;
        // Player.myPlayerId = 1;
        var game = this;
        Common.GameInstance = game;
    },

    start () {
        this.myLabel.string = "我的ID:" + Player.myPlayerId;
        this.gameLabel.string = "";
    },

    showGameTip: function(string) {
        if (this.gameLabelTimeId != null){
            clearTimeout(this.gameLabelTimeId);
        }
        this.gameLabel.string = string + "";
        this.gameLabelTimeId = setTimeout(this.cleanGameTip,2000);
    },

    cleanGameTip: function() {
        Common.GameInstance.gameLabel.string = "";
    },

    playAnNewGame : function() {
        this.makeFakeData();

        var chessboardJS = this.chessboard.getComponent("Chessboard");
        this.clearAll();
        this.initWithPlayers(this.curPlayerIds,chessboardJS);

        this.curPlayPlayerNum = 0;
        this.isPlaying = true;
        
        var controlboardJs = this.controlboard.getComponent("Gamecontrol");
        var player = this.totalPlayers[this.curPlayPlayerNum];
        controlboardJs.curPlayPlayer = player;
        controlboardJs.makeNewGame();
        chessboardJS.curPlayPlayer = player;
        chessboardJS.makeNewGame();

        this.showGameTip("play a new game");
    },

    makeFakeData : function() {
        this.curPlayerIds = [];
        for (var i=1;i<=2;i++) {
            this.curPlayerIds.push(i);
        }
    },

    initWithPlayers: function(playerIds,chessboardJS) {
        this.totalPlayers = [];
        for (var i=0;i<playerIds.length;i++) {
            var playerId = playerIds[i];
            var player = new Player();
            player.runPaths = [];
            player.playerId = playerId;
            this.totalPlayers.push(player);
        }
        var pathBeginPos = 0;
        var vicBeginPos = chessboardJS.loopPathMax;
        var pieceBeginPos = chessboardJS.loopPathMax + chessboardJS.victoryPathCount * 4;
        var curPathPos = pathBeginPos;
        var curVicPos =  vicBeginPos;
        var curPiecePos = pieceBeginPos;
        let playerCount = this.totalPlayers.length;
        for (var n=0;n<playerCount;n++) {
            var player = this.totalPlayers[n];
            curPathPos = pathBeginPos + 13 * n;
            curVicPos = vicBeginPos + chessboardJS.victoryPathCount * n;
            curPiecePos = pieceBeginPos + 4 * n;
            if (n==0) {
                player.curType = Common.PlayerType.leftTop;
                this.addPlayerPath(chessboardJS,player,curPathPos,curVicPos,curPiecePos);
                this.initChesspieces(player);
                
            }else if(n==1){
                player.curType = Common.PlayerType.rightTop;
                this.addPlayerPath(chessboardJS,player,curPathPos,curVicPos,curPiecePos);
                this.initChesspieces(player);
            }else if(n==2){
                player.curType = Common.PlayerType.rightBottom;
                this.addPlayerPath(chessboardJS,player,curPathPos,curVicPos,curPiecePos);
                this.initChesspieces(player);

            }else if(n==3){
                player.curType = Common.PlayerType.leftBottom;
                this.addPlayerPath(chessboardJS,player,curPathPos,curVicPos,curPiecePos);
                this.initChesspieces(player);
            }
            
            
        }
        
    },

    addPlayerPath: function(chessboardJS,player,curPathPos,curVicPos,curPiecePos) {
        var newCurPos = curPathPos;
        for (var n=0;n<chessboardJS.loopPathMax - 1;n++) {
            if (curPathPos + n >= chessboardJS.loopPathMax) {
                newCurPos = (curPathPos + n) % chessboardJS.loopPathMax;
            }else{
                newCurPos = curPathPos + n;
            }
            player.runPaths.push(newCurPos);
        }
        var newCurPos = curVicPos;
        for (var n=0;n<chessboardJS.victoryPathCount;n++) {
            newCurPos = curVicPos + n;
            player.runPaths.push(newCurPos);
        }
        player.victoryPos = player.runPaths.length - 1;
        var newPiecePos = curPiecePos;
        for (var n=0;n<4;n++) {
            newPiecePos = curPiecePos + n;
            player.runPaths.push(newPiecePos);
        }
    },

    initChesspieces:function(player) {
        player.totalChesspieces = [];
        var preparePos = player.victoryPos + 1;
        var chessboardJS = this.chessboard.getComponent("Chessboard");
        for(var i=0;i<4;i++) {
            var flyNode = chessboardJS.getFlyNode(player.curType);
            let chesspieceJs = flyNode.getComponent('Chesspiece');
            chesspieceJs.curPos = preparePos + i;
            chesspieceJs.isVictory = false;
            player.totalChesspieces.push(flyNode);
        }
        for(var i=0;i<player.totalChesspieces.length;i++) {
            var flyNode = player.totalChesspieces[i];
            let chesspieceJs = flyNode.getComponent('Chesspiece');
            let playerPos = player.getPosFromPiecePos(chesspieceJs.curPos);
            let vec2 = chessboardJS.getVec2FromPlayerPos(playerPos);
            flyNode.x = vec2.x;
            flyNode.y = vec2.y;
            flyNode.width = 40;
            flyNode.height = 40;
        }
    },

    clearAll:function() {
        var chessboardJS = this.chessboard.getComponent("Chessboard");

        let playerCount = this.totalPlayers.length;
        for (var i=0;i<playerCount;i++) {
            let onePlayer = this.totalPlayers[i];
            let piecesCount = onePlayer.totalChesspieces.length;
            for (var j=0;j<piecesCount;j++) {
                let onepiece = onePlayer.totalChesspieces[j];
                chessboardJS.resetFlyNode(onepiece);
            }
            for (var j=0;j<onePlayer.totalChesspieces.length;j++) {
                var onePiece = onePlayer.totalChesspieces[j];
                onePiece.scale = 1.0;
            }
        }

        this.curPlaySaiziNum = null;
    },

    fakeDataClicked: function() {
        if (this.isPlaying == true) {
            if (this.curPlaySaiziNum == null) {
                var player = this.totalPlayers[this.curPlayPlayerNum];
                if (player.playerId != Player.myPlayerId) {
                    var netdata = new Netdata();
                    netdata.saiziNum = Math.round(Math.random()*59) % 6 + 1;
                    netdata.playerId = player.playerId;
                    netdata.chesspieceNum = -1;
                    this.makeCurPlayWithNetData(netdata);
                }
           }
        }
        
    },

    makeNewPlay: function() {
        var controlboardJs = this.controlboard.getComponent("Gamecontrol");
        var playerNum = this.getNextNotFinishPlayerNum();
        if (playerNum >=0 ) {
            Common.GameInstance.showGameTip("next player...");
            this.curPlayPlayerNum = playerNum;
            this.curPlaySaiziNum = null;
            var player = this.totalPlayers[playerNum];
            controlboardJs.makeNewPlay(player);
            var chessboardJS = this.chessboard.getComponent("Chessboard");
            chessboardJS.makeNewPlay(player);
        }else{
            Common.GameInstance.showGameTip("Game End");
            var thisInstance = this;
            setTimeout(()=> {
                thisInstance.playAnNewGame();
            },2000);
        }
        
    },

    getNextNotFinishPlayerNum: function() {
        var finishs = [];
        for(var i=0;i<this.totalPlayers.length;i++) {
            var onePlayer = this.totalPlayers[i];
            if (onePlayer.getAllWinStatus() == false) {
                finishs.push(i);
            }
        }
        if (finishs.length <=1) {
            return -1;
        }else{
            
            for(var i=0;i<finishs.length;i++) {
                var playerNum = (this.curPlayPlayerNum + 1 + i) % this.totalPlayers.length;
                var onePlayer = this.totalPlayers[playerNum];
                if (onePlayer.getAllWinStatus() == false) {
                    return playerNum;
                }
            }
            return -1;
        }
        
    },

    makeCurPlayWithSaiziData: function(saiziNum) {
        saiziNum.chesspieceNum = -1;
        this.makeCurPlayWithNetData(saiziNum);
    },

    makeCurPlayWithNetData: function(saiziNum) {
        if (this.curPlaySaiziNum == null) {
            this.curPlaySaiziNum = saiziNum;
            var controlboardJs = this.controlboard.getComponent("Gamecontrol");
            controlboardJs.makeCurPlayWithSaiziData(this.curPlaySaiziNum);
            var chessboardJS = this.chessboard.getComponent("Chessboard");
            chessboardJS.makeCurPlayWithSaiziData(this.curPlaySaiziNum);
        }
    }

    // update (dt) {},
});
