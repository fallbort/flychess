// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var _playerType = cc.Enum({
    leftTop: 0,
    rightTop: 1,
    rightBottom: 2,
    leftBottom: 3
});

module.exports = {
    PlayerType: _playerType,
    MaxPlayerCount: 4,
    GameInstance:null,
};
