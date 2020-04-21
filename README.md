# flychess
编译方式：
1.下载 Cocos Creator，https://www.cocos.com/creator/

2.网页试运行,点击cocos creator的->菜单->项目->运行预览.

3.原生编译:

1).iOS -> 点击cocos creator的->菜单->项目->构建发布->选中构建平台ios->点击构建->等待完成->点击发布路径的打开-> build/jsb-link/frameworks/runtime-src/proj.ios_mac/flychess.xcodeproj -> 打开项目并用xcode编译.


4.文件构成：

assets目录:

  animate目录,使用动画编辑器做的动画。
    
  images目录，普通的图片资源，包括背景图，棋子。
    
  scripts目录:
  
    Chessboard.js  //棋盘脚本,棋子在图中的运动逻辑主要在这里。
    
    Chesspiece.js  //棋子脚本,主要存数据结构。
    
    Common.js  //通用数据。
    
    Game.js  //游戏数据调度逻辑及启动后的初始化工作运行脚本。
    
    GameControl.js   //游戏底部面板及骰子的逻辑在这里。
    
    Netdata.js  //网络版后游戏的传输数据结构。
    
    Player.js   //玩家相关的数据及逻辑,包括玩家各自的跑道数据。
    

功能：

1.点击开始启动新一轮游戏

2.点击骰子处自己局投一次骰子

3.点击机器人他人局投一次筛子

