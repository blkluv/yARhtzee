# yAR-htzee

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

<div>
<a href="https://platane.github.io/yAR-htzee/game.mp4"><img width="188" height="320" src="./doc/game.gif"></a>
<img width="188" height="320" src="./doc/ar-throw.jpg">
<img width="188" height="320" src="./doc/ar-scoresheet.jpg">
<img width="188" height="320" src="./doc/desktop-pick.jpg">
</div>

A pretty cool yahtzee game in augmented reality.

[🎲 yAR-htzee](https://platane.github.io/yAR-htzee)

[🥇 leaderboard](https://github.com/Platane/yAR-htzee/issues/6)

# Background

This game uses [8thwall](https://www.8thwall.com/products-web#world-tracking) or native [WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) to achieve world tracking.

The dice are rendered with [three.js](https://github.com/mrdoob/three.js) using [react-three-fiber](https://github.com/pmndrs/react-three-fiber) and the physical world is simulated with [cannon.js](https://github.com/schteppe/cannon.js).

# Install

```sh
bun install

# https://bun.sh/docs/installation
```

# Usage

```sh
bun dev
```

## Tips

- [wireless debugging](https://medium.com/android-news/wireless-debugging-through-adb-in-android-using-wifi-965f7edd163a)

# Attribution

- ["Dice"](https://skfb.ly/6RtsC) by tnRaro is licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).
- ["Lebombo"](https://hdrihaven.com/hdri/?c=indoor&h=lebombo) by Greg Zaal is licensed under [CC0](https://creativecommons.org/share-your-work/public-domain/cc0/)
- Thanks [@dhaiduk](https://github.com/dhaiduk) for providing a 8thWall dev key for this demo !
