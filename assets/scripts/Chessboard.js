// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Player = require("Player");
var Common = require("Common");
var Chesspiece = require("Chesspiece");
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
        
        //总棋盘上的点，顺序为，赛道，获胜道，待飞区
        totalPaths: {
            default: [],
            type: [cc.Vec2],
            visible:false
        },

        //赛道终止点
        loopPathMax: {
            default: 0,
            type: cc.Integer,
            visible:false
        },

        //单个玩家获胜道步数
        victoryPathCount: {
            default: 0,
            type: cc.Integer,
            visible:false
        },

        flyPrefab1: cc.Prefab,
        flyPrefab2: cc.Prefab,
        flyPrefab3: cc.Prefab,
        flyPrefab4: cc.Prefab,

        curPlayPlayer:{
            default: null,
            type: Player,
            visible:false,
        },

        curPlaySaiziNum: {
            default: null,
            type: Netdata,
            visible:false
        },
    },

    ctor () {
        this.tween = null;
    },

    cordinateTrasform() {
        for (var i=0;i<this.totalPaths.length;i++) {
            var oldvec = this.totalPaths[i];
            var newvec = new cc.Vec2(oldvec.x,oldvec.y);
            newvec.y = 375.0/2 - newvec.y;
            newvec.x = newvec.x - 375.0/2;
            this.totalPaths[i] = newvec;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.flyPool1 = new cc.NodePool();
        this.flyPool2 = new cc.NodePool();
        this.flyPool3 = new cc.NodePool();
        this.flyPool4 = new cc.NodePool();
        this.totalPaths = new Array();
        this.loopPathMax = 52;
        this.victoryPathCount = 5;
        for (var n = 1; n <= this.loopPathMax; n++) { 
            var value = new cc.Vec2(12.5,12.5 + 25 * 6);
            if (n <= 5) {
                value = new cc.Vec2(12.5 + 25 * n,12.5 + 25 * 6);
            }else if (n <= 5 + 6) {
                var lastMaxN = 5;
                value = new cc.Vec2(12.5 + 25 * (lastMaxN + 1),12.5 + 25 * (6 - (n - lastMaxN)));
            }else if (n <= 5 + 6 + 2) {
                var lastMaxN = 5 + 6;
                var lastAddedX =  5 + 1;
                var lastAddedY =  6;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX + (n - lastMaxN)),12.5 + 25 * (lastAddedY - (11 - 5)));
            }else if (n <= 5 + 6 + 2 + 5) {
                var lastlastMaxN = 5 + 6;
                var lastMaxN = 5 + 6 + 2;
                var lastAddedX =  5 + 1;
                var lastAddedY =  6 - (11 - 5);
                value = new cc.Vec2(12.5 + 25 * (lastAddedX + (lastMaxN - lastlastMaxN)),12.5 + 25 * (lastAddedY + (n - lastMaxN)));
            }else if (n <= 5 + 6 + 2 + 5 + 6) {
                var lastlastMaxN = 5 + 6 + 2;
                var lastMaxN = 5 + 6 + 2 + 5;
                var lastAddedX =  5 + 1 + 2;
                var lastAddedY =  6 - (11 - 5);
                value = new cc.Vec2(12.5 + 25 * (lastAddedX + (n - lastMaxN)),12.5 + 25 * (lastAddedY + (lastMaxN - lastlastMaxN) + 1));
            }else if (n <= 5 + 6 + 2 + 5 + 6 + 2) {
                var lastlastMaxN = 5 + 6 + 2 + 5;
                var lastMaxN = 5 + 6 + 2 + 5 + 6;
                var lastAddedX =  5 + 1 + 2;
                var lastAddedY =  5 + 1;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX + (lastMaxN - lastlastMaxN)),12.5 + 25 * (lastAddedY + (n - lastMaxN)));
            }else if (n <= 5 + 6 + 2 + 5 + 6 + 2 + 5) {
                var lastlastMaxN = 5 + 6 + 2 + 5 + 6;
                var lastMaxN = 5 + 6 + 2 + 5 + 6 + 2;
                var lastAddedX =  5 + 1 + 2 + 6;
                var lastAddedY =  5 + 1;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX - (n - lastMaxN)),12.5 + 25 * (lastAddedY + (lastMaxN - lastlastMaxN)));
            }else if (n <= 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6) {
                var lastlastMaxN = 5 + 6 + 2 + 5 + 6 + 2;
                var lastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5;
                var lastAddedX =  5 + 1 + 2 + 6;
                var lastAddedY =  5 + 1 + 2;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX - (lastMaxN - lastlastMaxN) - 1),12.5 + 25 * (lastAddedY + (n - lastMaxN)));
            }else if (n <= 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2) {
                var lastlastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5;
                var lastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6;
                var lastAddedX =  5 + 1 + 2;
                var lastAddedY =  5 + 1 + 2;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX - (n - lastMaxN)),12.5 + 25 * (lastAddedY + (lastMaxN - lastlastMaxN)));
            }else if (n <= 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2 + 5) {
                var lastlastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6;
                var lastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2;
                var lastAddedX =  5 + 1 + 2;
                var lastAddedY =  5 + 1 + 2 + 6;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX - (lastMaxN - lastlastMaxN)),12.5 + 25 * (lastAddedY - (n - lastMaxN)));
            }else if (n <= 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6) {
                var lastlastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2;
                var lastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2 + 5;
                var lastAddedX =  5 + 1;
                var lastAddedY =  5 + 1 + 2 + 6;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX - (n - lastMaxN)),12.5 + 25 * (lastAddedY - (lastMaxN - lastlastMaxN) - 1));
            }else if (n <= 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2) {
                var lastlastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2 + 5;
                var lastMaxN = 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6 + 2 + 5 + 6;
                var lastAddedX =  5 + 1;
                var lastAddedY =  5 + 1 + 2;
                value = new cc.Vec2(12.5 + 25 * (lastAddedX - (lastMaxN - lastlastMaxN)),12.5 + 25 * (lastAddedY - (n - lastMaxN)));
            }

            this.totalPaths.push(value);
         }

         for (var i = 0;i < 4 ;i++) {
             var startX = 12.5;
             var startY = 12.5;
             var multiByX = 1;
             var multiByY = 0;
             if (i == 0) {
                startX = 12.5 + 25 * 0;
                startY = 12.5 + 25 * 7;
                multiByX = 1;
                multiByY = 0;
             }else if(i == 1){
                startX = 12.5 + 25 * 7;
                startY = 12.5 + 25 * 0;
                multiByX = 0;
                multiByY = 1;
             }else if(i == 2){
                startX = 12.5 + 25 * 14;
                startY = 12.5 + 25 * 7;
                multiByX = -1;
                multiByY = 0;
             }else if(i == 3){
                startX = 12.5 + 25 * 7;
                startY = 12.5 + 25 * 14;
                multiByX = 0;
                multiByY = -1;
             }
             for (var n = 1;n <= this.victoryPathCount;n++) {
                startX += 25 * multiByX;
                startY += 25 * multiByY;
                this.totalPaths.push(new cc.Vec2(startX,startY));
             }
         }
         for (var i = 0;i < 4 ;i++) {
            var startX = 51;
            var startY = 51;
            var crossPlayerLength = 225;
            var perChessLength = 46;
            if (i == 0) {
                startX += 0;
                startY += 0;
             }else if(i == 1){
                startX += crossPlayerLength;
                startY += 0;
             }else if(i == 2){
                startX += crossPlayerLength;
                startY += crossPlayerLength;
             }else if(i == 3){
                startX += 0;
                startY += crossPlayerLength;
             }
             for (var n = 0;n < 4 ;n++) {
                 var pieceStartX = startX;
                 var pieceStartY = startY;
                if (n == 0) {
                    pieceStartX += perChessLength * 0;
                    pieceStartY += perChessLength * 0;
                 }else if(n == 1){
                    pieceStartX += perChessLength * 1;
                    pieceStartY += perChessLength * 0;
                 }else if(n == 2){
                    pieceStartX += perChessLength * 0;
                    pieceStartY += perChessLength * 1;
                 }else if(n == 3){
                    pieceStartX += perChessLength * 1;
                    pieceStartY += perChessLength * 1;
                 }
                 this.totalPaths.push(new cc.Vec2(pieceStartX,pieceStartY));
             }
         }
         this.cordinateTrasform();
         
    },

    start () {

    },

    

    getFlyNode: function (playerType) {
        let fly = null;
        var pool = this.flyPool1;
        var prefab = this.flyPrefab1;
        if (playerType == Common.PlayerType.leftTop) {
            pool = this.flyPool1;
            prefab = this.flyPrefab1;
        }else if (playerType == Common.PlayerType.rightTop) {
            pool = this.flyPool2;
            prefab = this.flyPrefab2;
        }else if (playerType == Common.PlayerType.rightBottom) {
            pool = this.flyPool3;
            prefab = this.flyPrefab3;
        }else if (playerType == Common.PlayerType.leftBottom) {
            pool = this.flyPool4;
            prefab = this.flyPrefab4;
        }
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            fly = pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            fly = cc.instantiate(prefab);
        }
        fly.parent = this.node; // 将生成的敌人加入节点树
        let chesspieceJs = fly.getComponent('Chesspiece');
        chesspieceJs.clearAll();
        chesspieceJs.curType = playerType;
        return fly;
    },

    resetFlyNode:function(flyNode) {
        let chesspieceJs = flyNode.getComponent('Chesspiece');
        if (chesspieceJs.curType==Common.PlayerType.leftTop) {
            this.flyPool1.put(flyNode);
        }else if (chesspieceJs.curType==Common.PlayerType.rightTop) {
            this.flyPool2.put(flyNode);
        }else if (chesspieceJs.curType==Common.PlayerType.rightBottom) {
            this.flyPool3.put(flyNode);
        }else if (chesspieceJs.curType==Common.PlayerType.leftBottom) {
            this.flyPool4.put(flyNode);
        }
        flyNode.parent = null;
    },

    getVec2FromPlayerPos: function (playerPos) {
        var curPos = playerPos;
        return this.totalPaths[curPos];
    },

    makeNewGame: function() {

    },

    makeCurPlayWithSaiziData: function(netdata) {
        this.curPlaySaiziNum = netdata;
        if (this.curPlayPlayer != null && this.curPlayPlayer.playerId == netdata.playerId) {
            this.tween = null;
            this.unscheduleAllCallbacks();
            this.schedule(this.runPath, 1.5);
        }
        
    },

    runPath: function() {
        this.unscheduleAllCallbacks();
        if (this.curPlaySaiziNum != null && this.curPlaySaiziNum.playerId == this.curPlayPlayer.playerId) {
            var chesspieceNum = this.curPlaySaiziNum.chesspieceNum;
            var saiziNum = this.curPlaySaiziNum.saiziNum;
            var foundPiece = this.findChessPieceForWalk();
            
            if (foundPiece != null) {
                let onePieceJs = foundPiece.getComponent("Chesspiece");
                var isRunning = this.curPlayPlayer.getisRunStatus(foundPiece);
                var points = [];
                var zeroPoints = [];
                var victoryPoints = [];
                if (isRunning == true) {
                    var beginPos = onePieceJs.curPos;
                    var centerPos = onePieceJs.curPos;
                    var endPos = onePieceJs.curPos;
                    if (beginPos + saiziNum > this.curPlayPlayer.victoryPos) {
                        centerPos = this.curPlayPlayer.victoryPos;
                        endPos = (this.curPlayPlayer.victoryPos * 2 - (beginPos + saiziNum));
                    }else{
                        centerPos = beginPos + saiziNum;
                        endPos = beginPos + saiziNum;
                    }
                    onePieceJs.curPos = endPos;
                    for (var i=beginPos+1;i<=centerPos;i++) {
                        var playerPos = this.curPlayPlayer.getPosFromPiecePos(i);
                        points.push(this.getVec2FromPlayerPos(playerPos));
                    }
                    for (var i=centerPos-1;i>=endPos;i--) {
                        var playerPos = this.curPlayPlayer.getPosFromPiecePos(i);
                        points.push(this.getVec2FromPlayerPos(playerPos));
                    }
                    if (endPos == this.curPlayPlayer.victoryPos){
                        onePieceJs.isVictory = true;
                        let startupPos = this.curPlayPlayer.getStartupPos();
                        onePieceJs.curPos = startupPos;
                        var playerPos = this.curPlayPlayer.getPosFromPiecePos(startupPos);
                        victoryPoints.push(this.getVec2FromPlayerPos(playerPos));
                    }
                }else{
                    var beginPos = onePieceJs.curPos;
                    var endPos = 0;
                    onePieceJs.curPos = endPos;
                    var playerPos = this.curPlayPlayer.getPosFromPiecePos(endPos);
                    zeroPoints.push(this.getVec2FromPlayerPos(playerPos));
                }

                var tween = cc.tween(foundPiece);
                if (zeroPoints.length > 0) {
                    var onePoint = zeroPoints[0];
                    tween = tween.to(0.5, { position: onePoint,scale: 0.8});
                }else{
                    for (var i=0;i<points.length;i++) {
                        var onePoint = points[i];
                        tween = tween.to(0.5, { position: onePoint });
                    }
                    if (victoryPoints.length > 0){
                        var onePoint = victoryPoints[0];
                        tween = tween.to(1.0, { position: onePoint,scale: 1.2});
                    }
                }
                
                tween = tween.delay(0.3);
                var thisInstance = this;
                if (victoryPoints.length > 0 && this.curPlayPlayer.getAllWinStatus() == true) {
                    var playerId = this.curPlayPlayer.palyerId;
                    tween = tween.call(() => {
                        Common.GameInstance.showGameTip("玩家ID:"+ playerId + " win!");
                        thisInstance.schedule(this.endPlay, 1);
                    });
                }else{
                    tween = tween.call(() => {thisInstance.endPlay();});
                }
                
                tween = tween.start();
                this.tween = tween;
            }else{
                Common.GameInstance.showGameTip("none action done");
                this.schedule(this.endPlay, 1);
            }
        }else{
            Common.GameInstance.showGameTip("none action done");
            this.schedule(this.endPlay, 1);
        }
    },

    endPlay: function() {
        this.clearForNewPlay();
        Common.GameInstance.makeNewPlay();
    },

    clearForNewPlay: function() {
        this.tween = null;
        this.unscheduleAllCallbacks();
        this.curPlaySaiziNum = null;
        this.curPlayPlayer = null;
    },

    findChessPieceForWalk: function() {
        var foundPiece = null;
        if (this.curPlaySaiziNum != null && this.curPlaySaiziNum.playerId == this.curPlayPlayer.playerId) {
            var chesspieceNum = this.curPlaySaiziNum.chesspieceNum;
            var saiziNum = this.curPlaySaiziNum.saiziNum;
            if (saiziNum == 6) {
                var pieceCount = this.curPlayPlayer.totalChesspieces.length;
                for (var i=0;i<pieceCount;i++) {
                    var onePiece = this.curPlayPlayer.totalChesspieces[i];
                    let onePieceJs = onePiece.getComponent("Chesspiece");
                    var isRunning = this.curPlayPlayer.getisRunStatus(onePiece);
                    if (isRunning == false && onePieceJs.isVictory == false) {
                        foundPiece = onePiece;
                    }
                }
            }
            if (foundPiece == null) {
                if (chesspieceNum == -1) {
                    var pieceCount = this.curPlayPlayer.totalChesspieces.length;
                    for (var i=0;i<pieceCount;i++) {
                        var onePiece = this.curPlayPlayer.totalChesspieces[i];
                        var isRunning = this.curPlayPlayer.getisRunStatus(onePiece);
                        if (isRunning == true) {
                            foundPiece = onePiece;
                        }
                    }
                }
            }
        }
        return foundPiece;
    },
    
    makeNewPlay: function(newPlayer) {
        this.clearForNewPlay();
        this.curPlayPlayer = newPlayer;
    }

    // update (dt) {},
});
