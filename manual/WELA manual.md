# 什么是WELA

## 简介

WELA即World Editor Log Analyser，世界编辑器日志分析工具。为能详尽地分析一次WC3游戏中的战斗记录而生，如果读者玩过魔兽世界，那么一定对Skada(或者Recount)有所了解，WELA即WC3版的Skada。

WELA诞生于笔者2013年的一个仿魔兽世界副本地图项目，因为对职业的输出平衡以及技能的实际效果分析提出了很高的要求，笔者不得不制作了这么一款工具。

## 适用人群

对于一般玩家而言，他们很大程度上是不需要这么一件工具的，因为地图作者应该专注于让玩家在一次游戏中获得最佳体验，而不是让玩家反复研究，如何得出这张地图的最优解。

**WELA适合有着一颗数值策划的心的PVE地图作者。**

如果你是一名地图作者，你希望你设计的PVE型地图里面的英雄都有相对平衡的输出，包括伤害输出，治疗输出，伤害承受等，以及各种技能的实际效能。但是又找不到合理的统计方式，那么WELA将成为你的一个选项。

最后请记得将WELA从发布给玩家的版本移除，因为WELA会让游戏偶尔卡顿。

## 实现方式

WELA没有采用任何第三方修改WC3的手段（无JAPI），你可以使用原版的WC3。

用户通过输入聊天信息的方式触发，输出（使用Preload函数）一个或者几个纯文本的日志文件，然后将这些日志文件放入WELA的网页端工具（使用Javascript编写）进行分析。

## 缺陷

受限于笔者的时间与技术，WELA现有如下缺陷：

* 集成过程繁琐，需要与地图的伤害系统进行深度整合甚至重写
* 日志文件数据量庞大，每记录8000条信息，会自动输出一个日志，导致WC3卡顿片刻
* 无法获取系统时间，日志文件末尾会被添加一串随机字符串以防止文件名重复，又因为算法不好，仍然有极低的概率发生日志文件名重复
* 网页端工具使用Javascript编写，并未对代码作优化
* 显示器宽度必须为1920像素，否则需要左右拖动以查看完整内容
* 没有错误输入检测，请不要测试工具的健壮性

# 怎么用WELA

## Jass集成

地图代码中进行必要的事件记录。将在后面详细说明。

## 游戏输出

游戏中，WELA将持续记录单位所造成的伤害，治疗等数据。当然，记录什么，什么时候记录，记录多少，是完全可控的。

用户需要选择合适自己的方式来输出日志，可以将当前的所有记录输出为一个日志文件，存于硬盘中，具体路径在Jass代码中配置。

笔者使用输入聊天信息的方式来触发，例如：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/log.jpg)

就可以生成一个或者数个日志文件，可用任何文本编辑工具如记事本打开。

## 查看报告

使用任何一款现代浏览器打开WELA的网页端工具。推荐Google Chrome，Firefox，强烈不推荐IE10及以下的版本。

链接：[https://yatyricky.github.io/we/weloganalyser.html](https://yatyricky.github.io/we/weloganalyser.html)

如下图：

![](https://raw.githubusercontent.com/yatyricky/we/gh-pages/manual/main_ui.jpg)

将该次游戏的所有日志文件，包括自动输出的，一起选择，拖入到网页中，查看日志分析结果。

从图中可以看到，系统自动输出过两次，分别被命名为 Auto-0 和 Auto-1。然后手动输出一次，被命名为 foobar-2。

![](https://github.com/yatyricky/we/raw/gh-pages/manual/drag.jpg)

点击左侧的导航按钮，即可快速查看战斗统计了，如图:

![](https://github.com/yatyricky/we/raw/gh-pages/manual/sample.jpg)

# WELA功能详细介绍

## 战斗分段机制

WELA提供了一个函数，可以让用户设置有效战斗时间。本例中的战斗时间段以“魔兽世界”为标准，即：

* 任意怪物发现玩家单位，作为一次战斗的开始
* 所有怪物失去攻击目标时，包括但不限于所有玩家死亡，战斗结束
* 所有怪物死亡时，战斗结束

如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/combats.jpg)

* 每一次战斗将默认以时间戳区间为标签
* 点击之后，将以进入战斗时遇到的第一个怪物名称为标签
* 暗红色高亮的为战斗时间超过60秒的战斗

## 伤害

伤害部分可以看到一次战斗中，每个玩家单位的伤害输出情况，详细如下：

* 造成的总伤害量，并按降序排序
* 伤害组成，并按降序排序
* DPS曲线

如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/damages.jpg)

左侧的 Damages Done By All Players 为总伤害排名。

右侧的 Damage Per Second 为DPS记录。

点击总伤害的任意一条，即可看到分解伤害，如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/damage_drill.jpg)

## 治疗

治疗部分可以看到一次战斗中，每个玩家单位的治疗情况，详细如下：

* 造成的总治疗量，并按降序排序
* 造成的有效治疗和溢出治疗
* 按技能分组的治疗组成
* 治疗组成的有效治疗和溢出治疗
* HPS曲线

如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/healings.jpg)

左上方的 Healings Done By All Players 为总治疗排名。其中：

* 绿色部分为有效治疗
* 粉红色部分为过量治疗

右上方的 Healing Per Second 为HPS。

下方的 Healings Done by XXXX 为选定玩家单位的详细治疗组成。

* 点击黄色高亮区域的单位名称，可以在左下方看到选择的单位的治疗组成
* 上一个查看过的单位会被挤到右下方
* 饼图的内环是各治疗技能占比
* 饼图的外环是单个治疗的有效治疗和溢出治疗占比
* 所有的比例数据以总治疗量为标准

## 施法

施法部分可以看到一次战斗中，每个玩家单位的使用技能统计，其中：

* 使用技能的总次数，并按降序排序
* 使用的技能组成

如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/casts.jpg)

左侧 Casts By All Players 显示每个玩家单位的总施法次数。

点击黄色高亮区域的单位名称时，可以在右侧看到所有技能的使用组成。

## 受到伤害

受到伤害部分可以看到一次战斗中，每个玩家单位承受的伤害情况，详细如下：

* 受到的总伤害量，并按降序排序
* 受到的伤害组成，并按降序排序
* DTPS曲线

如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/damage_taken.jpg)

左侧的 Damages Taken By All Players 为总受到伤害排名。

右侧的 Damage Taken Per Second 为DTPS记录。

点击总受到伤害的任意一条，即可看到分解伤害，如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/damage_taken_drill.jpg)

## 魔法值

魔法值部分可以看到每个玩家单位在一次战斗中的法力值变化曲线，如图：

![](https://github.com/yatyricky/we/raw/gh-pages/manual/mana.jpg)

其中左侧的 Max Mana of All Players 显示为每个玩家单位的最大法力值，按降序排序。

右侧的 Mana Curve 为法力值曲线。

# WELA原理解析

## WELA的数据标准

**整个数据文件为纯文本格式，每一行为一条记录，每一条记录遵循一定的标准，使用逗号分隔，该标准为WELA系统的核心所在。**

记录总共分6种，对于每条记录（一位数组），字段的数量不等，每种记录的详细说明如下：

### "def"类型

定义单位的团队定位，用以在记录中自动区分并屏蔽部分单位的显示。比如在DPS曲线中，默认不会显示治疗职业的数据。如果不确定选择何种类型，一律选择"creep"即可。

以下为字段详解：

1. 固定取值为"def"，用以说明该字段为定义单位团队定位
2. 单位名字，全图唯一。英雄单位请使用名字，普通单位建议加上HandleID值，否则所有同类单位合并统计
3. 团队定位，取值[tank|healer|dps|minion|boss|creep]

### "combat"类型

该记录为战斗状态分割器，用以分割不同场次的战斗。首次调用时，为战斗开始，第二次调用时，战斗结束，如此往复，可以想象成括号的匹配问题。

以下为字段详解：

1. 固定取值为"combat"，用以说明该条记录为战斗状态分割器
2. 时间戳，为当前记录发生的时间，其值为游戏已经流逝的时间

### "damage"类型

该记录为一次伤害。

以下为字段详解：

1. 固定取值为"damage"，用以说明该条记录为一条伤害记录
2. 时间戳，为当前记录发生的时间，其值为游戏已经流逝的时间
3. 伤害来源单位的名称
4. 伤害目标单位的名称
5. 造成该次伤害的攻击方式名称，如，"普通攻击"，"风暴之锤"等等
6. 伤害量
7. 该伤害是否命中，取值"1"或者"0"
8. 该伤害是否被格挡，取值"1"或者"0"
9. 该伤害是否被躲闪，取值"1"或者"0"
10. 该伤害是否暴击，取值"1"或者"0""
11. 该伤害是否被免疫，取值"1"或者"0"
12. 该伤害是否为物理伤害，取值"1"或者"0"
13. 该伤害是否可被躲闪，取值"1"或者"0"

其中7-13尚未在统计结果中解析，可根据实际情况随意填写，或者自行扩展网页端分析工具。

### "heal"类型

该记录为一次治疗。

以下为字段详解：

1. 固定取值为"heal"，用以说明该条记录为一条治疗记录
2. 时间戳，为当前记录发生的时间，其值为游戏已经流逝的时间
3. 治疗来源单位的名称
4. 治疗目标单位的名称
5. 造成该次治疗的治疗方式名称，如，"治疗术"，"神圣之光"等等
6. 有效治疗量
7. 过量治疗量
8. 该治疗是否为极效治疗，取值"1"或者"0"

其中8尚未在统计结果中解析，可根据实际情况随意填写，或者自行扩展网页端分析工具。

### "cast"类型

记录单位的每次施法。

以下为字段详解：

1. 固定取值为"cast"，用以说明该条记录为一条施法记录
2. 时间戳，为当前记录发生的时间，其值为游戏已经流逝的时间
3. 施法单位的名称
4. 目标单位的名称
5. 使用的法术或者技能的名称

### "mana"类型

记录单位的魔法值状态。用户可根据需要和性能自行选择记录周期，在本例中，系统每2秒记录一次所有玩家单位的魔法值。

以下为字段详解：

1. 固定取值为"mana"，用以说明该条记录为一条魔法值记录
2. 时间戳，为当前记录发生的时间，其值为游戏已经流逝的时间
3. 记录单位的名称
4. 记录单位的当前魔法值
5. 记录单位的最大魔法值

以下为一个样本，有删减:
```
cast,797.309,dummy,Naga Royal Guard,昏迷
heal,798.300,Rayan Dawnrisen,Fandral Staghelm,治疗术,0.000,300.671,0,healer,tank
combat,810.156
heal,810.242,Sylvanas Windrunner,Sylvanas Windrunner,吸血攻击,0.000,18.810,0,dps,dps
damage,810.242,Sylvanas Windrunner,High Warlord Naj'entus,Normal Attack,188.100,1,0,0,0,0,1,1,dps,boss
mana,810.300,Jaina Proudmoore,1760.000,1760.000
mana,810.300,Sylvanas Windrunner,569.780,570.000
cast,810.486,Varok Saurfang,,英勇打击
cast,810.816,Sylvanas Windrunner,Sylvanas Windrunner,食尸鬼仆从
cast,811.146,Sylvanas Windrunner,,冰冻陷阱
damage,811.199,Varok Saurfang,High Warlord Naj'entus,撕裂,0.000,1,1,0,0,0,1,1,dps,boss
mana,811.300,Jaina Proudmoore,1760.000,1760.000
cast,811.476,Varok Saurfang,High Warlord Naj'entus,撕裂
cast,811.476,Sylvanas Windrunner,Sylvanas Windrunner,专注
damage,811.529,Varok Saurfang,High Warlord Naj'entus,致死打击,536.550,1,0,0,0,0,1,1,dps,boss
damage,811.629,Rayan Dawnrisen,High Warlord Naj'entus,Normal Attack,91.140,1,0,0,0,0,1,1,healer,boss
damage,811.799,Fandral Staghelm,High Warlord Naj'entus,割伤,118.300,1,0,0,0,0,0,0,tank,boss
cast,811.806,Fandral Staghelm,High Warlord Naj'entus,割伤
cast,811.806,Varok Saurfang,High Warlord Naj'entus,致死打击
damage,811.908,Arthas Menethil,High Warlord Naj'entus,Normal Attack,85.260,1,0,0,0,0,1,1,healer,boss
damage,812.036,Sylvanas Windrunner,High Warlord Naj'entus,黑箭,380.240,1,0,0,0,0,1,0,dps,boss
mana,812.300,Jaina Proudmoore,1760.000,1760.000
mana,812.300,Fandral Staghelm,165.000,165.000
```

## Jass部分

事实上，Jass部分并无固定的写法，只需符合WELA的数据标准即可。这里介绍一种记录数据的思路。

### 记录

**使用一个字符串数组来存储所有的记录**

```
globals
    ...
    string array WELA_Logs
    integer WELA_Index = 0
    ...
endglobals
```

**每当发生一次事件**

这里以一个伤害事件为例

```
local string entry
...
// 组装记录
// 以下元数据的获取方式最好自行实现，因为通常情况下，伤害事件的处理属于一张地图比较底层的逻辑了
set entry = "damage," /* 记录类型
            */ + "22.333" + "," /* 当前游戏逝去时间，可自行实现该逻辑 
            */ + "穆拉丁" + "," /* 获得伤害来源单位的名称 
            */ + "食尸鬼" + "," /* 获得伤害目标单位的名称
            */ + "风暴之锤" + "," /* 伤害名称
            */ + "100.0" + "," /* 伤害值
            */ + "1" + "," /*
            */ + "1" + "," /*
            */ + "1" + "," /*
            */ + "1" + "," /*
            */ + "1" + "," /*
            */ + "1" + "," /*
            */ + "1";
            
set WELA_Logs[WELA_Index] = entry
set WELA_Index = WELA_Index + 1
...
```

其它类型的记录可使用类似方式。不必太纠结先后问题，WELA网页端工具会根据第二个字段，也就是时间戳来进行处理。

### 输出

使用Preload函数作为输出日志的手段。

```
function GenerateCombatLog takes string namespace returns nothing
    // 设置输出路径，这里直接将文件输出到D盘下
    local string filename = "D:\\" + namespace + "-" + I2S(GetRandomInt(0, 0x7FFFFFFF)) + ".welog"
    local integer i = 0
    call PreloadGenStart()
    loop
        exitwhen i >= WELA_Index
        call Preload(WELA_Logs[i])
        set i = i + 1
    endloop
    call PreloadGenEnd(filename)
    call PreloadGenClear()
    set WELA_Index = 0 // 将索引重置
endfunction
```

查看实际输出的文件，使用任意文本编辑器打开，可以发现输出的内容变成了这种：

```
function PreloadFiles takes nothing returns nothing

    call Preload( "damage,729.245,Jaina Proudmoore,Ghoul Servant,Normal Attack,112.530,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,TRUE,dps,minion" )
    call Preload( "combat,747.160" )
    call Preload( "mana,747.300,Jaina Proudmoore,1760.000,1760.000" )
    call Preload( "mana,747.300,Fandral Staghelm,165.000,165.000" )
    call Preload( "damage,1261.889,Fandral Staghelm,Malacrass,Normal Attack,87.397,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,TRUE,tank,boss" )
    call Preload( "damage,1261.978,Sylvanas Windrunner,Malacrass,黑箭,893.283,TRUE,FALSE,FALSE,TRUE,FALSE,TRUE,FALSE,dps,boss" )
    call PreloadEnd( 3.3 )

endfunction
```

不过这并没有关系，WELA的网页端工具会将没用的 call Preload 等内容处理掉。

读者可以按照WELA的数据标准自己编写适合自己地图的Jass代码，因此本文并没有提供可直接使用的代码，以上Jass代码仅供参考。

## Javascript部分

还是那句话，数据格式标准才是WELA的核心所在，因此，我们有了数据，无论使用什么方式输出（Preload也好，JAPI也好，只是应用方式不同而已），使用什么方式解析，都是次要的。

笔者使用的是 Highcharts 库来作为数据图形化的工具，语言采用 Javascript，运行于任何一款现代浏览器。

具体实现原理将不在此赘述，主要技术来源于 Highcharts，读者有兴趣可以自行研究其文档，或者使用其它语言来编写解析工具。

Highcharts 中文站链接: [http://www.hcharts.cn/](http://www.hcharts.cn/)

# 结语

本文描述了WELA的设计理念，详细功能以及数据标准，希望读者可以写出自己的脚本以生成符合规范的日志文件，并对自己的地图数值平衡产生帮助。

WELA来源于笔者的一个个人项目，因此其数据标准并不适合所有的地图项目，还有极大的提升空间，欢迎提出各种需求。

Fork me on GitHub: [https://github.com/yatyricky/we](https://github.com/yatyricky/we)