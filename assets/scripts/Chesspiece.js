// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Common = require("Common");

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

        curPos:{
            default: 0,
            type: cc.Integer,
            visible:false,
        },

        curType:{
            default: Common.PlayerType.leftTop,
            type: Common.PlayerType,
            visible:false,
        },

        isVictory:false,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    clearAll: function() {
        this.curPos = 0;
        this.isVictory = false;
    },

    start () {

    },

    // update (dt) {},
});
