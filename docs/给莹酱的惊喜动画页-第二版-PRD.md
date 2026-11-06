# 给莹酱的惊喜动画页 · 第二版

私人赠礼的第二版。六句台词配六张布布和一二的图，点一下才开始，大约四十秒后停在拥抱上。音乐盒换成一段可以随页面保存的背景音乐。

## Problem Statement

第一版已经能当面打开：点一下，五幕台词，音乐盒，浅粉房间。画面主要是几朵玫瑰放大、八片花瓣下落、两张静图滑进来。莹酱喜欢的是布布和一二，第二版要让每一句都换成他们自己的一张图，动图就播放，最后停在一个拥抱上。

《梦中的婚礼》和理查德·克莱德曼的录音不能放进页面。曲子仍在版权期内，录音也是别人的。简单改编、改成音乐盒音色，听得出来仍是那一首，同样不能写进去。

## Solution

仍是一个可以在浏览器里当面打开的本地网页。

第一屏写着这是给莹酱的，并提示点一下。点了之后，背景音乐响起，六张图按六句台词依次出现。第 1 句到第 5 句各停大约 8 秒，换图时用将近 1 秒淡过去。第 6 句是一个拥抱的动图，出现后不再换走，动图继续轻轻播放，方便她看，也方便截图。

播放中只能静音，不能跳过。播完可以再看一次。电脑上仍是居中的小剧场，四周有很少的花瓣和金粉。手机上铺满屏幕，花瓣只贴着边缘。

## User Stories

1. As 莹酱, I want the page to stay still until I tap, so that the surprise starts when I am looking.
2. As 莹酱, I want to see my name on the first screen, so that I know the page is for me before it plays.
3. As 莹酱, I want a short hint telling me to tap, so that I know how to begin.
4. As 莹酱, I want the whole opening stage to respond to a tap, so that I do not have to hit a tiny control.
5. As 莹酱 on a phone, I want that opening tap area to be comfortable for a thumb, so that starting is easy.
6. As 送礼的人, I want the first tap to start the pictures and the background music together, so that I do not start them separately.
7. As 莹酱, I want silence before the first tap, so that the browser does not block or surprise-play audio.
8. As 莹酱, I want the story to remain on the invitation until that tap, so that the ending is not already on screen.
9. As 莹酱, I want further taps during playback to leave the story alone, so that I cannot skip by accident.
10. As 莹酱, I want no pause and no fast-forward, so that the piece plays straight through.
11. As 莹酱, I want the first sentence to be exactly 「臭布布 和香一二是一对幸福的小熊熊」, including the space between 布布 and 和.
12. As 莹酱, I want the second sentence to be exactly 「幸福的花儿为你盛开~~」, including both tildes.
13. As 莹酱, I want the third sentence to be exactly 「有你的每天都很精彩~」, including the tilde.
14. As 莹酱, I want the fourth sentence to be exactly 「亲爱的一二，我 喜欢你啊~」, including the space between 我 and 喜欢.
15. As 莹酱, I want the fifth sentence to be exactly 「愿你幸福永远，快乐永远~ ~」, including the space between the two tildes.
16. As 莹酱, I want the last sentence to be exactly 「莹酱，我爱你。」 with a full stop and no tilde, so that the ending is plain.
17. As 送礼的人, I want the leading spaces that were typed in front of the second, third, and fourth sentences to be kept, so that later work does not tidy the words.
18. As 莹酱, I want one different picture for each sentence, so that the story is not the same two stills sliding in.
19. As 莹酱, I want the first picture to be 布布 and 一二 standing together in a field of small flowers, 布布 on the left and 一二 on the right, with no words on the picture.
20. As 莹酱, I want the second picture to be 布布 offering 一二 a bouquet while she smiles and leans toward him.
21. As 莹酱, I want the words already printed on that bouquet picture, 「锵锵~草莓哦~ 谢谢布布」, to remain, so that the offering stays as it was found.
22. As 莹酱, I want the third picture to be the two of them going out: 一二 in a blue hat with a pink bag, 布布 in a yellow hat with a blue bag, a little cord between them, grass and blue sky, and no words on the picture.
23. As 莹酱, I want the fourth picture to be the two of them very close, face to face, 一二 wearing a small bag, both smiling, without a long caption.
24. As 莹酱, I want the fifth picture to be the two of them under one pale umbrella, with small hearts nearby.
25. As 莹酱, I want the sixth picture to be 布布 with his eyes closed, hugging 一二, on a light gray background, with no words on the picture.
26. As 莹酱, I want a picture that is a still image to stay still, so that a photograph does not pretend to move.
27. As 莹酱, I want a picture that is an animation to keep playing for the whole time its sentence is on screen, so that the hug and the umbrella are not frozen frames.
28. As 莹酱, I want each of the first five pictures to remain long enough to read the sentence, about eight seconds, so that the words are not rushed.
29. As 莹酱, I want the change from one picture to the next to take about one second and fade, so that the piece does not cut.
30. As 莹酱, I want that fade to happen as the sentence changes, so that it does not add an extra wait with no words.
31. As 莹酱, I want the hug to remain after it appears, so that I can look at it and take a screenshot.
32. As 莹酱, I want the hug animation to keep playing while the last sentence stays, so that the ending is still alive.
33. As 莹酱, I want the six pictures in the agreed order, so that the bouquet comes before the outing, and the hug is last.
34. As 莹酱, I want the sentence to stay readable over or under its picture, so that the words are not lost in the drawing.
35. As 莹酱, I want the words to remain if a picture fails to load, so that the sentence still arrives.
36. As 莹酱, I want to watch the whole piece again from the first picture, so that the surprise can be replayed.
37. As 莹酱, I want replay to appear only after the hug has been reached, so that the first viewing plays straight through.
38. As 莹酱, I want a mute control while the piece plays, so that I can quiet it when someone else is nearby.
39. As 莹酱, I want mute to silence the music without stopping or skipping pictures, so that the words keep arriving.
40. As 莹酱, I want mute to stay on through a replay until I turn sound back on, so that a quiet room stays quiet.
41. As 莹酱, I want the sound to be background music rather than a synthesized music box, so that a real piano is playing.
42. As 莹酱, I want that music to be Chopin's Nocturne in E-flat major, Op. 9 No. 2, played by Peter Johnston, so that the piece is the one we are allowed to keep.
43. As 送礼的人, I want that recording because it is dedicated to the public domain, so that the page does not include someone else's copyrighted performance.
44. As 莹酱, I want the music to loop quietly, so that it is still going when the hug holds.
45. As 莹酱, I want a replay to replace the music rather than layer it, so that the piece does not get louder each time.
46. As 送礼的人, I want 《梦中的婚礼》 and Richard Clayderman's recording left out, so that the gift does not copy a song that is still under copyright.
47. As 送礼的人, I want no shortened or music-box arrangement of that song either, so that a recognizable adaptation is not stored in the page.
48. As 莹酱 on a phone, I want the stage to fill the screen, so that the gift feels close.
49. As 莹酱 on a phone, I want the words clear of the notch and the home indicator, so that no line is cut off.
50. As 莹酱 on a phone, I want the page to stay still sideways, so that it does not slide left and right.
51. As 莹酱 on a computer, I want the story in a centered theater with a few petals and a little gold dust around it, so that a large screen still feels intimate.
52. As 莹酱 on a phone, I want those petals only at the edges, so that they do not cover the pictures.
53. As 莹酱, I want the petals to slow and thin out once the hug is on screen, so that the ending can be looked at.
54. As 莹酱, I want light pink and cream, like an afternoon room, so that the piece feels warm.
55. As 莹酱, I want the type large enough to read on a phone, so that the lines are the focus.
56. As 莹酱, I want the pictures and the music saved with the page, so that the scene still works with the network off.
57. As 莹酱 who prefers less motion, I want the six pictures and the sentences without falling petals, without fades, and with animations stopped on their first frame, so that I can still read the gift.
58. As 送礼的人, I want to open a local webpage in a browser while we are together, so that this round needs no public address.
59. As 莹酱 turning the phone sideways, I want the stage to stay readable and centered, so that the lines stay on screen.
60. As 莹酱, I want mute and replay large enough to tap, so that I do not miss them.
61. As 送礼的人, I want every agreed sentence used character for character, so that later picture work does not rewrite the words.
62. As 送礼的人, I want the pictures of 布布 and 一二 kept as a private gift, so that the page is not published as a product of someone else's characters.

## Implementation Decisions

五个模块，接口保持少而稳：

- **台词本**：只保存定稿的六句，包括空格和波浪号。舞台按句去读。改字不改时间轴。
- **剧情时间轴**：只回答「现在第几句、是否在播、是否已停住」。接受开始、静音、重播。不知道图怎么画，也不知道音乐怎么响。点下之后才计时。第 1 句到第 5 句各约 8 秒。第 6 句没有时长，出现后停住。淡入淡出是舞台的事，不另加一段没有字的等待。
- **图本**：按句交出那一张图，并说明它是静图还是动图。不知道时间，也不播放声音。
- **舞台**：只读当前句。负责六张图、将近 1 秒的淡入淡出、动图在自己那一句里循环、台词、少量花瓣和金粉、静音、再看一次。最后停在拥抱上，动图继续播。
- **背景音乐**：播放存在页面旁边的那段夜曲，轻轻循环。第一次点击后才响。跟随静音。再看一次时换掉正在响的声音，不叠第二层。音乐盒去掉，不再用代码合成旋律。

开场门仍把第一次点击交给时间轴和背景音乐。点击前两者都不运行。

句子、时长与画面：

| 句 | 时长 | 画面 | 台词 |
| --- | --- | --- | --- |
| 1 | 8 秒 | 花田里并肩的静图，无字 | 臭布布 和香一二是一对幸福的小熊熊 |
| 2 | 8 秒 | 布布递花束的静图，图上保留「锵锵~草莓哦~ 谢谢布布」 | 幸福的花儿为你盛开~~ |
| 3 | 8 秒 | 出门牵着小绳子的静图，无字 | 有你的每天都很精彩~ |
| 4 | 8 秒 | 面对面靠近的图，一二有小包带；若找到的是动图就播放 | 亲爱的一二，我 喜欢你啊~ |
| 5 | 8 秒 | 共撑一把伞、旁边有小心心的动图，整段播放 | 愿你幸福永远，快乐永远~ ~ |
| 6 | 出现后停住 | 布布闭眼抱着一二的动图，整段播放，浅灰底，无字 | 莹酱，我爱你。 |

其余决定：

- 交付物是本地网页，以及放在旁边的六张图和一段音频。用浏览器当面打开。不依赖服务器。
- 图和音频都先保存下来，不外链，断网也能播。某一张图失败时，这一句的字仍然出现。
- 背景音乐用 Peter Johnston 演奏的肖邦《降 E 大调夜曲》，作品 9 之 2。录音以 CC0 捐入公有领域，来自 Musopen，收在 Wikimedia Commons。曲谱本身也已进入公有领域。循环播放，音量轻。
- 布布与一二的形象版权在作者黄小B。选用的图是网上公开流传的图，此页是私人赠礼，不做对外发布的产品，也不做商用。
- 电脑：剧场居中，四周很少的花瓣和少量金粉，不盖住照片。手机竖屏铺满，花瓣只在边缘，避开刘海和底部横条。横屏仍居中，字不溢出。没有横向滚动。
- 拥抱出现之后，花瓣变慢、变少。
- 静音和再看一次的可点区域至少约 44×44 像素。再看一次只在第 6 句停住后出现。
- 静音不改变句号。再看一次从第 1 句重新计时，并保持静音状态，直到她自己打开声音。
- 系统要求减少动态效果时，六张图和台词都保留，花瓣停下，换图不再淡入淡出，动图停在第一帧。
- 播放中没有暂停，没有快进，没有进度条。
- 这一轮不部署公网地址。开场门仍然保留，以后发到微信时音乐也能在点击后响起。
- 配色仍是午后小房间：浅粉、奶白。中文不依赖远程字体。

## Testing Decisions

好的测试只检查外面能感知的行为：没点的时候停在邀请；点了以后按六句顺序走；把时钟向前拨过约 8 秒，句子跟着换；静音不改变当前句；走到第 6 句后停住；再看一次回到第 1 句再走一遍；播放中再次开始不会跳句，也不会跑出第二条时间轴。测试不检查花瓣的样式名，不检查淡入淡出的时长数字，也不检查音频文件内部。

只为剧情时间轴写自动测试。图本、舞台、背景音乐、开场门的手感，用手机和电脑看一遍。

第一版已经有的时间轴测试是这一版的范本：对时间轴下命令，再读它报告的当前句。那些只断言组件能被创建的旧测试，不能当作范本。

## Out of Scope

- 《梦中的婚礼》，以及它的任何简单改编、缩谱、音乐盒音色版
- 理查德·克莱德曼的录音，以及任何仍受版权保护的录音
- 用代码合成旋律的音乐盒
- 恋爱日记、相册、里程碑、登录和服务器
- 真人合照
- 暂停、快进、拖动进度
- 这一轮的公网网址和微信分享卡片
- 把页面做成对外的布布一二产品，或把这些图用于商用
- 在页面里修改文案
- 图本、舞台、背景音乐、开场门的自动测试
- 留言、回信、小游戏
- 用三维或粒子系统重画这些角色

## Further Notes

定稿台词如下，实现时逐字使用。第 2、3、4 句行首的空格属于原文。

- 第 1 句：臭布布 和香一二是一对幸福的小熊熊
- 第 2 句：幸福的花儿为你盛开~~
- 第 3 句：有你的每天都很精彩~
- 第 4 句：亲爱的一二，我 喜欢你啊~
- 第 5 句：愿你幸福永远，快乐永远~ ~
- 第 6 句：莹酱，我爱你。

已经看过、可以保存进页面的来源：

- 第 1 句的花田并肩静图，见 [堆糖上的这张图](https://c-ssl.duitang.com/uploads/blog/202102/25/20210225232223_a7a25.jpeg)。
- 第 2 句的递花静图，见 [堆糖上的这张图](https://c-ssl.duitang.com/uploads/blog/202202/16/20220216085546_1c67b.jpeg)。
- 第 3 句的出门静图，见 [堆糖上的这张图](https://c-ssl.duitang.com/uploads/blog/202112/31/20211231082620_b6122.jpg)。
- 第 6 句的拥抱动图，见 [这张动图](https://imgs.qiubiaoqing.com/qiubiaoqing/imgs/69a7403896868evV.gif)。
- 第 4 句和第 5 句按上面的画面去取网上对应的那一张。第 5 句用动图。取到以后同样保存到页面旁边。
- 背景音乐见 [Wikimedia Commons 上的这段 CC0 录音](https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_No._2_in_E_Flat_Major,_Op._9.ogg)。

第一版的开场、静音、再看一次、午后房间和减少动态效果都留下。第二版换掉的是句子、六张图，以及音乐盒。
