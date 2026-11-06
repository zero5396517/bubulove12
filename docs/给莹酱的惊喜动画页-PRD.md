# 给莹酱的惊喜动画页

私人赠礼。莹酱打开后，布布对一二说一段情话，开场和结尾都叫她的名字。点一下才开始，大约一分钟，播完停在最后一幕。

## Problem Statement

莹酱喜欢布布和一二。送礼的人想当面给她一个惊喜：一段华丽而温馨的动画，里面有玫瑰、爱心、布布、一二、情话和轻轻的音乐盒。手机和电脑都要能看。现有仓库的 `main` 是空的；别的分支里的恋爱日记是另一件产品，这次用不上。

## Solution

做一个可以在浏览器里当面打开的动画网页。

第一屏写着这是给莹酱的，并提示点一下。点了之后，音乐盒响起，五幕按顺序自动播完，大约一分钟。中间是布布对一二说的话，最后再叫一次莹酱，停在定格画面。播放中只能静音。播完可以再看一次。

电脑上像一座居中的小剧场，四周有花瓣和少量金粉。手机上铺满屏幕。配色是午后小房间：浅粉、奶白。

## User Stories

1. As 莹酱, I want the page to stay still until I tap, so that the surprise starts when I am looking.
2. As 莹酱, I want to see my name on the first screen, so that I know the page is for me before it plays.
3. As 莹酱, I want a short hint telling me to tap, so that I know how to begin.
4. As 莹酱, I want the whole opening stage to respond to a tap, so that I do not have to hit a tiny control.
5. As 莹酱 on a phone, I want that opening tap area to be comfortable for a thumb, so that starting is easy.
6. As 送礼的人, I want the first tap to start the story and the music together, so that I do not start them separately.
7. As 莹酱, I want the story to remain on the invitation until that tap, so that the ending is not already on screen.
8. As 莹酱, I want further taps during playback to leave the story alone, so that I cannot skip by accident.
9. As 莹酱, I want the opening line to be exactly 「莹酱，今天不谈别的，只把心里的话说给你。」 so that the first words are the ones we agreed.
10. As 莹酱, I want roses and hearts to fill the room in the second scene, so that those gifts are part of the surprise.
11. As 莹酱, I want the flower scene to show 「先让花开一会儿。」 so that the pause feels deliberate.
12. As 莹酱, I want 布布 and 一二 to appear and come closer, so that I see them as a pair.
13. As 莹酱, I want the entrance line 「一二，我穿过很多天，才走到你面前。」 so that 布布 is the one speaking.
14. As 莹酱, I want the three love lines to appear one after another, so that I can read each one.
15. As 莹酱, I want each love line to remain long enough to finish, so that the longer sentences are not rushed.
16. As 莹酱, I want those three lines to be 布布 speaking to 一二, so that I understand the metaphor for us.
17. As 莹酱, I want the first love line to be exactly 「喜欢你，是我做过最安静、也最确定的事。」
18. As 莹酱, I want the second love line to be exactly 「世界再大，我也只要与你并肩的那一条路。」
19. As 莹酱, I want the third love line to be exactly 「若岁月允许，我想把余生都交给你。」
20. As 莹酱, I want the last scene to say 「莹酱，这就是布布对一二说的。也是我对你说的。我爱你。」 so that the metaphor comes back to me.
21. As 莹酱, I want the last picture to remain on screen, so that I can look at it and take a screenshot.
22. As 莹酱, I want to watch the whole piece again from the first scene, so that the surprise can be replayed.
23. As 莹酱, I want replay to appear only after the story has finished, so that the first viewing plays straight through.
24. As 莹酱, I want no pause and no fast-forward, so that the minute is one continuous piece.
25. As 莹酱, I want a mute control while the story plays, so that I can quiet it when someone else is nearby.
26. As 莹酱, I want mute to silence the music without stopping or skipping scenes, so that the words keep arriving.
27. As 莹酱, I want mute to stay on through a replay until I turn sound back on, so that a quiet room stays quiet.
28. As 莹酱, I want the sound to be a soft looping music box, so that it stays gentle.
29. As 莹酱, I want silence before the first tap, so that the browser does not block or surprise-play audio.
30. As 送礼的人, I want the music box to be synthesized from a public-domain melody, so that the page does not include someone else's recording.
31. As 莹酱, I want a replay to replace the music rather than layer it, so that the piece does not get louder each time.
32. As 莹酱 on a phone, I want the stage to fill the screen, so that the gift feels close.
33. As 莹酱 on a phone, I want the words clear of the notch and the home indicator, so that no line is cut off.
34. As 莹酱 on a phone, I want the page to stay still sideways, so that it does not slide left and right.
35. As 莹酱 on a computer, I want the story in a centered theater with petals and a little gold dust around it, so that a large screen still feels intimate.
36. As 莹酱, I want light pink and cream, like an afternoon room, so that the piece feels warm and cute.
37. As 莹酱, I want the type large enough to read on a phone, so that the lines are the focus.
38. As 莹酱, I want pictures of 布布 and 一二 saved with the page, so that the scene still works with the network off.
39. As 送礼的人, I want a search for clear pictures of the two of them together, and the pictures already kept in the repo if that search fails, so that missing art does not block the gift.
40. As 莹酱, I want the words to remain if a picture fails to load, so that the confession still arrives.
41. As 莹酱 who prefers less motion, I want the lines and the still characters without a storm of falling petals, so that I can still read the gift.
42. As 送礼的人, I want to open a local webpage in a browser while we are together, so that this round needs no public address.
43. As 送礼的人, I want that same page to already fit a phone, so that a link can be added later without redoing the layout.
44. As 莹酱 turning the phone sideways, I want the stage to stay readable and centered, so that the lines stay on screen.
45. As 莹酱, I want mute and replay large enough to tap, so that I do not miss them.
46. As 莹酱, I want the five scenes in the agreed order and about one minute of motion, so that the surprise feels complete.
47. As 送礼的人, I want every agreed sentence used character for character, so that later animation work does not rewrite the words.

## Implementation Decisions

五个模块，接口保持少而稳：

- **开场门**：把第一次点击交给时间轴和音乐盒。点击前两者都不运行。
- **剧情时间轴**：只回答「现在第几幕、是否在播、是否已播完」。接受开始、静音、重播。不知道玫瑰怎么画，也不知道旋律怎么响。
- **舞台**：只读当前幕。负责午后房间、玫瑰、爱心、角色出场、定格、电脑居中剧场、手机铺满。
- **台词本**：只保存定稿句子。舞台按幕去读。改字不改时间轴。
- **音乐盒**：第一次点击后，用代码合成音乐盒音色，循环演奏一段公有领域旋律，音量轻。跟随静音。重播时换掉正在响的声音，不叠第二层。这一轮不做自动测试。

幕次与时长，点下之后才计时：

| 幕 | 时长 | 画面 | 台词 |
| --- | --- | --- | --- |
| 1 | 8 秒 | 浅粉奶白的房间亮起 | 莹酱，今天不谈别的，只把心里的话说给你。 |
| 2 | 12 秒 | 玫瑰与爱心铺开 | 先让花开一会儿。 |
| 3 | 12 秒 | 布布与一二出场并靠近 | 一二，我穿过很多天，才走到你面前。 |
| 4 | 24 秒 | 三句依次停留，每句约 8 秒 | 见用户故事 17–19 |
| 5 | 句子显示后停住 | 两人定格 | 莹酱，这就是布布对一二说的。也是我对你说的。我爱你。 |

其余决定：

- 交付物是本地网页和放在旁边的图片。用浏览器当面打开。不依赖服务器，不依赖远程字体，这样直接打开文件也能显示中文。
- 图片先找清晰的布布与一二同框图，保存到页面旁边，不外链。找不到合适的，就用仓库里已有的那批图。某张图失败时，这一幕的字仍然出现。
- 布布与一二的形象版权在作者黄小B。此页是私人赠礼，不做对外发布的产品。
- 电脑：剧场居中，四周花瓣和少量金粉。手机竖屏铺满，避开刘海和底部横条。横屏仍居中，字不溢出。没有横向滚动。
- 静音和重播的可点区域至少约 44×44 像素。重播只在第 5 幕停住后出现。
- 静音不改变幕号。重播从第 1 幕重新计时，并保持静音状态，直到她自己打开声音。
- 系统要求减少动态效果时，保留台词和角色静帧，不做满屏落花。
- 播放中没有暂停，没有快进，没有进度条。
- 这一轮不部署公网地址。开场门仍然保留，以后发到微信时音乐也能在点击后响起。

## Testing Decisions

好的测试只检查外面能感知的行为：没点的时候停在邀请；点了以后按五幕顺序走；把时钟向前拨，幕跟着前进；静音不改变当前幕；播完停在第 5 幕；重播回到第 1 幕再走一遍；播放中再次开始不会跳幕，也不会跑出第二条时间轴。测试不检查花瓣的样式名，也不检查音乐盒内部怎么发声。

只为剧情时间轴写自动测试。舞台、台词本、音乐盒、开场门的手感，用手机和电脑看一遍。

仓库里可参考的旧测试，在 `ionic1` 分支的 Ionic 初始组件测试中。那些测试只断言组件能被创建，不能当作时间轴的范本。新测试直接对时间轴下命令，再读它报告的当前幕。

## Out of Scope

- 恋爱日记、相册、里程碑、登录和服务器
- 真人合照
- 指定歌曲，以及任何有版权的录音
- 暂停、快进、拖动进度
- 这一轮的公网网址和微信分享卡片
- 把页面做成对外的布布一二产品
- 在页面里修改文案
- 舞台和音乐盒的自动测试
- 留言、回信、小游戏

## Further Notes

定稿台词如下，实现时逐字使用。

- 开场：莹酱，今天不谈别的，只把心里的话说给你。
- 玫瑰：先让花开一会儿。
- 出场：一二，我穿过很多天，才走到你面前。
- 情话一：喜欢你，是我做过最安静、也最确定的事。
- 情话二：世界再大，我也只要与你并肩的那一条路。
- 情话三：若岁月允许，我想把余生都交给你。
- 定格：莹酱，这就是布布对一二说的。也是我对你说的。我爱你。

`main` 目前没有页面。恋爱日记在其他分支，不纳入这次实现。
