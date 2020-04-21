// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Chesspiece = require("Chesspiece");
var Common = require("Common");

cc.Class({
    extends: cc.Component,

    // name: "player",
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
        playerId:0,
        //总跑道+停机场
        runPaths: {
            default: [],
            type: [cc.Integer],
            visible:false,
        },
        //获胜点
        victoryPos:cc.Integer,

        curType:{
            default: Common.PlayerType.leftTop,
            type: Common.PlayerType,
            visible:false,
        },
        
        totalChesspieces: {
            default: [],
            type: [cc.Node],
            visible:false
        },
    },

    statics: {
        // 声明静态变量
        myPlayerId:cc.Integer,
 
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },


    getPosFromPiecePos: function (pos) {
        var curPos = pos;
        return this.runPaths[curPos];
    },

    getisRunStatus: function(pieceNode) {
        let onePieceJs = pieceNode.getComponent("Chesspiece");
        if (onePieceJs.curPos >= 0 && onePieceJs.curPos <= this.victoryPos) {
            return true;
        }else{
            return false;
        }
    },

    getAllWinStatus:function() {
        for(var i=0;i<this.totalChesspieces.length;i++) {
            var pieceNode = this.totalChesspieces[i];
            let onePieceJs = pieceNode.getComponent("Chesspiece");
            if (onePieceJs.isVictory == false) {
                return false;
            }
        }
        return true;
    },

    getStartupPos:function() {
        
        var points = [this.victoryPos+1,this.victoryPos+2,this.victoryPos+3,this.victoryPos+4];
        for(var i=0;i<this.totalChesspieces.length;i++) {
            var pieceNode = this.totalChesspieces[i];
            let onePieceJs = pieceNode.getComponent("Chesspiece");
            var foundIndex = null;
            for (var j=0;j<points.length;j++){
                var onePoint = points[j];
                if (onePieceJs.curPos == onePoint) {
                    foundIndex = j;
                    break;
                }
            }
            if (foundIndex != null) {
                points.splice(foundIndex,1); 
            }
        }
        if (points.length > 0) {
            return points[0];
        }else{
            return -1;
        }
    }

    // update (dt) {},
});
