// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Player = require("Player");
var Netdata = require("Netdata");
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


        tipLabel:{
            default: null,
            type: cc.Label,
        },

        saizi:{
            default: null,
            type: cc.Node,
        },

        saiziImages:{
            default: [],
            type: [cc.SpriteFrame],
        },

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
        // this.curPlayPlayer = null;
        // this.curPlaySaiziNum = null;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tipLabel.string = "";
    },

    start () {

    },

    makeNewGame() {
        this.tipLabel.string = "当前玩家ID:" + String(this.curPlayPlayer.playerId) + " ...";
        let sprite = this.saizi.getComponent(cc.Sprite);
        sprite.spriteFrame = this.saiziImages[5];
        this.curPlaySaiziNum = null;
        var anim = this.saizi.getComponent(cc.Animation);
        anim.off('stop',      this.onAniStop,        this);
    },

    makeWaitPlayer: function() {
        this.tipLabel.string = "当前玩家ID:" + String(this.curPlayPlayer.playerId) + " ...";
    },

    saiziClicked: function() {
        if (this.curPlaySaiziNum == null) {
            if (this.curPlayPlayer != null && this.curPlayPlayer.playerId == Player.myPlayerId) {
                var netdata = new Netdata();
                netdata.saiziNum = Math.round(Math.random()*59) % 6 + 1;
                netdata.playerId = Player.myPlayerId;
                this.curPlaySaiziNum = netdata;
                Common.GameInstance.makeCurPlayWithSaiziData(netdata);
            }
        }
    },

    makeNewPlay: function(newPlayer) {
        this.curPlaySaiziNum = null;
        var anim = this.saizi.getComponent(cc.Animation);
        anim.off('stop',      this.onAniStop,        this);
        this.curPlayPlayer = newPlayer;
        this.makeWaitPlayer();
    },

    makeCurPlayWithSaiziData: function(netdata) {
        this.curPlaySaiziNum = netdata;
        this.animateSaizi();
    },

    animateSaizi:function() {
        var anim = this.saizi.getComponent(cc.Animation);
        anim.play();
        anim.repeatCount = 6;
        anim.on('stop',      this.onAniStop,        this);
    },

    onAniStop:function() {
        var anim = this.saizi.getComponent(cc.Animation);
        anim.off('stop',      this.onAniStop,        this);
        let sprite = this.saizi.getComponent(cc.Sprite);
        let num = this.curPlaySaiziNum.saiziNum;
        sprite.spriteFrame = this.saiziImages[num-1];
    },
    // update (dt) {},
});
