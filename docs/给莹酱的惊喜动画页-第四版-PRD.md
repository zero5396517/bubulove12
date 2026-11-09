# 给莹酱的惊喜动画页 · 第四版

私人赠礼的第四版。六张图、夜曲、烟火和大约 54 秒的节拍保持第三版。这一版改两件事：画面上的六句去掉空格，逐字淡入；六段已经放在页边的录音按句配上，其中最后一句的声音留到爱心定住时再放。

## Problem Statement

第三版里，一句台词是整句一起淡入的。送礼的人已经准备了六段口播，希望字跟着出来，声音也在。现在的文件名对不上第 1 句到第 6 句，空格还留在句子里，拥抱下面写的是「莹酱，我爱你。」。他希望字整齐地逐个出现，该响的时候才响，拥抱先留着上一句，最后一句的声音等到烟火定住。

## Solution

仍是一个可以在浏览器里当面打开的本地网页。

开场、六张图、夜曲循环、四朵烟花、爱心和烟火「莹酱」都按第三版。点一下才开始。第 1 幕到第 6 幕仍各约 8 秒，约 48 秒进入夜空，约 54 秒爱心定住。

画面上的六句去掉全部空格。一句开始时，整句的位置先占好，还没到的字看不见，但占着宽度，居中的句子不左右挪。汉字、标点、波浪号各占相等的一拍，均匀淡入。前五句的淡入时长就是各自那段录音的时长，语音和第一个字一起开始，最后一个字在这段录音说完时写满，然后整句停到这一幕结束。

雨伞那一幕写第 5 句，并播放它的录音。拥抱接下来的大约 8 秒只换图，第 5 句保持写完的样子，不再写一遍，也不再放一次。夜空一开始换成第 6 句，用最后那段录音的时长（大约 1.38 秒）均匀淡入。爱心定住时，底下已经是完整的「莹酱，我爱你。」，这时才播放最后那段录音。

静音同时关掉夜曲、烟花轻响和六句语音。一句正在说时，夜曲再轻一点，说完回到原来的音量。再看一次会停掉还在说的语音，整段从头再走。系统要求减少动态效果时，句子整句立刻出现，语音时刻不变。

## User Stories

1. As 莹酱, I want the page to stay still until I tap, so that the surprise starts when I am looking.
2. As 莹酱, I want to see my name on the first screen, so that I know the page is for me before it plays.
3. As 莹酱, I want silence before the first tap, so that neither the nocturne nor a voice plays early.
4. As 送礼的人, I want the first tap to start the pictures, the nocturne, and the first sentence together, so that the browser allows the sound.
5. As 莹酱, I want further taps during playback to leave the story alone, so that I cannot skip a sentence or the fireworks.
6. As 莹酱, I want no pause and no fast-forward, so that the piece plays straight through to the heart.
7. As 莹酱, I want the first sentence to read exactly 「臭布布和香一二是一对幸福的小熊熊」, so that the space inside the old sentence is gone.
8. As 莹酱, I want the second sentence to read exactly 「幸福的花儿为你盛开~~」, so that both tildes remain and the leading space is gone.
9. As 莹酱, I want the third sentence to read exactly 「有你的每天都很精彩~」, so that the tilde remains and the leading space is gone.
10. As 莹酱, I want the fourth sentence to read exactly 「亲爱的一二，我喜欢你啊~」, so that the comma and the tilde remain and both spaces are gone.
11. As 莹酱, I want the fifth sentence to read exactly 「愿你幸福永远，快乐永远~~」, so that the two tildes sit together.
12. As 莹酱, I want the sixth sentence to read exactly 「莹酱，我爱你。」, so that the full stop remains.
13. As 莹酱, I want each of these sentences to fade in one character at a time, so that the words arrive gradually.
14. As 莹酱, I want hanzi, punctuation, and tildes each to take an equal share of that sentence's reveal, so that the rhythm is even.
15. As 莹酱, I want the removed spaces to take no beat and no width, so that the line does not pause or gap where a space used to be.
16. As 莹酱, I want the whole sentence to reserve its final place from the first moment, so that a centered line does not shift as characters appear.
17. As 莹酱, I want characters that have not yet appeared to stay invisible while holding their width, so that the line stays even.
18. As 莹酱, I want the first sentence's voice to be the recording `bubu_01.wav`, so that the longest recording speaks the first sentence.
19. As 莹酱, I want the second sentence's voice to be `bubu_line_01.wav`, so that this recording is not mistaken for the first sentence.
20. As 莹酱, I want the third sentence's voice to be `bubu_line_02.wav`.
21. As 莹酱, I want the fourth sentence's voice to be `bubu_line_03.wav`.
22. As 莹酱, I want the fifth sentence's voice to be `bubu_line_04.wav`.
23. As 莹酱, I want the sixth sentence's voice to be `bubu_03.wav`, so that the shortest recording is kept for the last sentence.
24. As 莹酱, I want the first five voices to start with their own pictures, so that the voice and the first character begin together.
25. As 莹酱, I want the last character of each of the first five sentences to finish as that recording finishes, so that the writing and the voice end together.
26. As 莹酱, I want a finished sentence to stay on screen until the caption changes, so that I can read it after the voice has ended.
27. As 莹酱, I want each of the first five pictures to remain about eight seconds, so that a short recording does not rush the next picture.
28. As 莹酱, I want the umbrella picture to carry the fifth sentence, so that this sentence is written and spoken once, there.
29. As 莹酱, I want the hug to keep the already finished fifth sentence, so that the embrace does not start a new line.
30. As 莹酱, I want the hug to last about eight seconds with that same sentence, so that I can look at the embrace before the sky changes.
31. As 莹酱, I want the fifth recording not to play again during the hug, so that the sentence is not said twice.
32. As 莹酱, I want the sixth sentence to begin only when the night begins, so that 「莹酱，我爱你。」 belongs to the sky.
33. As 莹酱, I want the sixth sentence to fade in evenly across the length of `bubu_03.wav`, about 1.38 seconds, so that its writing has the same pace as that recording.
34. As 莹酱, I want 「莹酱，我爱你。」 to be complete before the heart locks, so that the voice arrives under a finished sentence.
35. As 莹酱, I want `bubu_03.wav` to play once when the heart locks, so that the last sentence is spoken at the end of the fireworks.
36. As 莹酱, I want `bubu_03.wav` to stay silent during the hug and during the bursts, so that it is not spoken early.
37. As 莹酱, I want the sixth sentence to remain complete under the locked heart, so that I can read it and take a screenshot.
38. As 莹酱, I want the reveal to use each recording's own length, so that the last character meets the end of that recording.
39. As 莹酱, I want the known lengths to be used when a recording's length cannot be read, about 3.96, 1.80, 1.81, 2.40, 2.61, and 1.38 seconds, so that the writing still has a pace.
40. As 莹酱, I want the sentence to keep appearing if its recording cannot play, so that a blocked sound does not stop the words.
41. As 莹酱, I want only one sentence voice at a time, so that two recordings do not speak together.
42. As 莹酱, I want the nocturne to continue through the pictures, the hug, the bursts, and the locked heart, so that the piano is still there.
43. As 莹酱, I want the nocturne to become quieter while a sentence is being spoken, so that I can hear the voice.
44. As 莹酱, I want the nocturne to return to its usual quiet level when the voice ends, is stopped, or cannot play, so that the piano comes back between sentences.
45. As 莹酱, I want the firework pops to finish before the heart locks, so that they do not sit on top of the last sentence.
46. As 莹酱, I want a mute control from the first sentence through the locked heart, so that I can quiet the room.
47. As 莹酱, I want mute to silence the nocturne, the pops, and the six voices without skipping the pictures or the fireworks, so that the story keeps arriving.
48. As 莹酱, I want the voice that is speaking to go quiet immediately when I mute, so that the room is actually quiet.
49. As 莹酱, I want a sentence whose moment passed while muted to stay silent, so that turning sound back on does not replay what I missed.
50. As 莹酱, I want a sentence whose moment has not yet arrived to play after I unmute, so that the rest of the piece can still speak.
51. As 莹酱, I want `bubu_03.wav` to stay silent if I am still muted when the heart locks, so that the ending respects the quiet room.
52. As 莹酱, I want unmuting after the heart has locked not to play `bubu_03.wav` late, so that the last sentence is not spoken after the moment has passed.
53. As 莹酱, I want mute to keep the nocturne silent even while a voice would have ducked it, so that mute wins.
54. As 莹酱, I want replay to appear only after the heart has locked, so that it is absent while the sentences and the bursts are still going.
55. As 莹酱, I want replay to stop a voice that is still speaking, so that the last sentence does not carry into the first picture.
56. As 莹酱, I want replay to start again from the first picture and the first sentence, so that the whole piece can be watched again.
57. As 莹酱, I want the first five voices to play again at the start of their own pictures, so that a second viewing speaks the same way.
58. As 莹酱, I want the fifth voice to play on the umbrella and not again on the hug, including after replay, so that the rule stays the same the second time.
59. As 莹酱, I want `bubu_03.wav` to play again the next time the heart locks, so that the ending is spoken on every full viewing.
60. As 莹酱, I want mute to stay on through a replay until I turn sound back on, so that a quiet room stays quiet.
61. As 莹酱, I want a muted replay to show the words and play no voice, so that silence survives the second viewing.
62. As 莹酱 who prefers less motion, I want each sentence to appear complete at once, so that characters do not fade in one by one.
63. As 莹酱 who prefers less motion, I want the voices to keep the same moments, so that the sound does not move when the fade is removed.
64. As 莹酱 who prefers less motion, I want the hug to show the complete fifth sentence, so that the caption is the same as a full viewing.
65. As 莹酱 who prefers less motion, I want the complete sixth sentence as soon as the night appears, so that the still heart already has its line.
66. As 莹酱 who prefers less motion, I want `bubu_03.wav` when the heart locks, so that the last sentence is still spoken at the end.
67. As 莹酱 who prefers less motion, I want replay to wait for the same about six seconds after the night appears, so that the button arrives on the same clock.
68. As 莹酱 on a phone, I want the sentences readable and clear of the notch and the home indicator, so that the words are not cut off.
69. As 莹酱 turning the phone sideways, I want the sentence, the heart, and the buttons to remain on screen together, so that a short screen does not lose the words.
70. As 莹酱 on a computer, I want the story to remain in the centered theater, so that a large screen still feels intimate.
71. As 莹酱, I want mute and replay large enough to tap, so that I do not miss them.
72. As 送礼的人, I want the six recordings saved with the page, so that the voices still play with the network off.
73. As 送礼的人, I want the six pictures, the nocturne, and the fireworks left as they are in the third edition, so that this round only changes the words and the voices.
74. As 送礼的人, I want to open a local webpage in a browser while we are together, so that this round needs no public address.
75. As 送礼的人, I want the pictures of 布布 and 一二 kept as a private gift, so that the page is not published as a product of someone else's characters.

## Implementation Decisions

五个会改到的模块。新的深模块是逐字：它只回答「这句在这一刻淡到哪」，不碰页面，也不出声。时间轴的秒数不改。

- **台词本**：只保存去掉空格后的六句，并回答某一幕显示哪一句。第 1 幕到第 5 幕是前五句。拥抱仍是第 5 句。夜空是第 6 句。它也记下每句对应的录音，以及读不出时长时用的大约 3.96、1.80、1.81、2.40、2.61、1.38 秒。不播放，不画字。
- **逐字**：给定一句完整的话、已经过的时间和这句的时长，回答每个字此刻淡到哪。汉字、标点、波浪号各占相等的一拍。这一拍之内该字从看不见淡到写满，之前的字保持写满，之后的字看不见。时长走完时整句写满。减少动态效果时整句立刻写满。句子里已经没有空格。不碰页面，不出声。
- **台词语音**：一次只放一句。前五句在各自那一幕开始时播放对应录音。`bubu_03.wav` 只在爱心定住的那一次播放。拥抱不播放。静音立刻停掉正在说的一句；静音期间已经错过的句子不补放；取消静音后只播放尚未到点的句子。爱心定住时若仍静音，`bubu_03.wav` 不放；定住之后再开声音，也不补放。再看一次停掉正在说的一句，新的一遍按同样的时刻再放，静音保持。录音的实际时长用来给逐字；读不到时用台词本里的那组大约时长。播不出来时通知夜曲恢复，逐字仍按该时长走。正在说的时候让夜曲变轻；说完、被停掉或播失败时，夜曲回到原来的音量。
- **背景音乐**：仍是那段夜曲，轻轻循环，穿过拥抱、烟花和定住。第一次点击后才响。说话时再轻一档，这句话听得清楚；话一结束就回到原来的轻轻。静音优先于变轻。再看一次时换掉正在响的声音，不叠第二层。
- **舞台**：一句开始就把整句的位置占好。还没到的字看不见，但占着宽度，居中的句子不左右挪。再按逐字的回答把字淡出来。拥抱沿用已经写完的第 5 句，不重新淡入。夜空一开始换成第 6 句并开始淡入，颜色仍按第三版在夜空里变浅。减少动态效果时，该幕的句子立刻完整出现。静音钮从第 1 幕起一直在。「再看一次」只在爱心定住后出现。横屏时句子、爱心和按钮仍留在屏幕内。静音和再看一次的可点区域至少约 44×44 像素。
- **时间轴**：仍只回答「现在第几幕、是否在播、是否已定住」。点下之后才计时。第 1 幕到第 6 幕各约 8 秒。约 48 秒进入夜空，此时仍在播。约 54 秒定住。定住之前再看一次无效。重播从第 1 幕重新计时，静音保持，并再次在约 54 秒定住。播放中再次开始不会跳幕。不知道字怎么淡，也不知道哪句在说。
- **图本、烟火编排、轻响**：保持第三版。夜空幕没有图。四朵烟花之后收成爱心轮廓和烟火「莹酱」。轻响在定住时已经停止，因此不和 `bubu_03.wav` 叠在一起。
- **开场门**：第一次点击同时交给时间轴、背景音乐和第一句语音。点击前都不运行。

节拍：

| 幕 | 时间 | 画面上的字 | 声音 |
| --- | --- | --- | --- |
| 1 | 约 8 秒 | 第 1 句按 `bubu_01.wav` 的时长淡入，然后停住 | 夜曲变轻，并播放 `bubu_01.wav`；说完夜曲恢复 |
| 2 | 约 8 秒 | 第 2 句按 `bubu_line_01.wav` 的时长淡入，然后停住 | 夜曲变轻，并播放 `bubu_line_01.wav` |
| 3 | 约 8 秒 | 第 3 句按 `bubu_line_02.wav` 的时长淡入，然后停住 | 夜曲变轻，并播放 `bubu_line_02.wav` |
| 4 | 约 8 秒 | 第 4 句按 `bubu_line_03.wav` 的时长淡入，然后停住 | 夜曲变轻，并播放 `bubu_line_03.wav` |
| 5 | 约 8 秒 | 第 5 句按 `bubu_line_04.wav` 的时长淡入，然后停住 | 夜曲变轻，并播放 `bubu_line_04.wav` |
| 6 | 约 8 秒 | 已经写完的第 5 句，拥抱的图 | 夜曲，不再放第 5 句 |
| 7，前约 6 秒 | 约 48 秒到约 54 秒 | 第 6 句用大约 1.38 秒淡入，然后保持完整 | 夜曲，烟花轻响；不放 `bubu_03.wav` |
| 7，定住 | 约 54 秒起 | 完整的「莹酱，我爱你。」 | 夜曲变轻，播放一次 `bubu_03.wav`；说完夜曲恢复。轻响不再响 |

其余决定：

- 交付物仍是本地网页，以及放在旁边的六张图、夜曲、一段烟花轻响，和这六段口播。用浏览器当面打开。播放时不再去取这些声音。
- 六段口播沿用现在的文件名，不改名，也不重录。
- 夜曲仍是 Peter Johnston 演奏的肖邦《降 E 大调夜曲》，作品 9 之 2，CC0。
- 轻响仍是 Rudmer Rotteveel 的 "Sharp Explosion 1"，CC0。
- 布布与一二的形象版权在作者黄小B。此页是私人赠礼。
- 播放中没有暂停，没有快进，没有进度条，也不能点一下提前换句或进入夜空。
- 这一轮不部署公网地址。
- 中文界面不依赖远程字体。

## Testing Decisions

这一版不写自动测试。送礼的人在浏览器里手动看。

好的一次手动检查只看外面能感知的行为：字是不是那六句、淡入时句子会不会左右挪、声音是不是在该响的时刻响、静音和再看一次有没有把声音停干净。不看内部的样式名，不看录音文件里面的采样。

要走完的路径：点一下才开始，点之前没有夜曲也没有口播。前五句逐字淡入，语音一起开始，说完字已经写满，句子停到换幕。雨伞上是第 5 句并说一次。拥抱大约 8 秒，字仍是写完的第 5 句，录音不重复。夜空一开始换成第 6 句并在大约 1.38 秒内写完。爱心定住时才说 `bubu_03.wav`，这时字已经完整。说话时夜曲变轻，说完恢复。烟花轻响不和最后一句叠在一起。静音关掉夜曲、轻响和口播；错过的句子不补放；定住时若仍静音，最后一句不说，之后再开声音也不补。再看一次停掉可能还在说的最后一句，从第 1 句再走一遍，静音保持。减少动态效果时句子整句立刻出现，语音时刻不变，夜空仍是一颗不动的心，再看一次仍晚大约 6 秒。手机竖屏、横屏和电脑宽屏都看。录音播不出来时，字仍按该句的时长出现，后面的画面继续。

已有的时间轴测试这一版不动。时钟没有改。

## Out of Scope

- 改时间轴的秒数，或让某一幕等录音放完再换
- 更换、重排或重画六张布布和一二的图
- 改烟火的朵数、颜色、爱心轮廓，或爱心中间「莹酱」两个字
- 把空格加回任何一句
- 在拥抱上改写第 6 句，或在拥抱上再放一次第 5 句的录音
- 在第 6 句淡入的同时播放 `bubu_03.wav`
- 给口播做逐词对轴，或加上闪烁的输入光标
- 静音之后补放已经错过的句子
- 重命名、重录或更换这六段口播
- 这一版的自动测试
- 《梦中的婚礼》，以及仍受版权保护的录音
- 点一下跳过、暂停、快进、拖动进度
- 这一轮的公网网址和微信分享卡片
- 恋爱日记、相册、留言、回信、小游戏、登录和服务器
- 把页面做成对外的布布一二产品，或把这些图用于商用

## Further Notes

画面上的六句是：

- 第 1 句：臭布布和香一二是一对幸福的小熊熊，录音 `bubu_01.wav`，大约 3.96 秒，第 1 幕开始时说
- 第 2 句：幸福的花儿为你盛开~~，录音 `bubu_line_01.wav`，大约 1.80 秒，第 2 幕开始时说
- 第 3 句：有你的每天都很精彩~，录音 `bubu_line_02.wav`，大约 1.81 秒，第 3 幕开始时说
- 第 4 句：亲爱的一二，我喜欢你啊~，录音 `bubu_line_03.wav`，大约 2.40 秒，第 4 幕开始时说
- 第 5 句：愿你幸福永远，快乐永远~~，录音 `bubu_line_04.wav`，大约 2.61 秒，只在雨伞那一幕开始时说
- 第 6 句：莹酱，我爱你。，录音 `bubu_03.wav`，大约 1.38 秒，只在爱心定住时说；字在夜空开始后的大约 1.38 秒里淡入

第三版定稿里的空格，这一版从画面上拿掉。录音文件本身不改。

爱心中间的烟火字仍只有「莹酱」两个字。从点下到爱心定住仍大约 54 秒。
