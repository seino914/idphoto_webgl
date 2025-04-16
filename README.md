# Particle Image Animation

Three.js を使用した画像のパーティクルアニメーションを実装した Next.js プロジェクトです。画像をパーティクル化し、エフェクトのような動きを実現します。

## 機能

- 画像のパーティクル化表示
- パーティクルのアニメーション（集合・拡散）
- レスポンシブ対応

## 技術スタック

- Next.js 14
- Three.js
- TypeScript

## 始め方

まず、必要なパッケージをインストールします：

```bash
npm install
```

次に、開発サーバーを起動します：

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)をブラウザで開いて結果を確認できます。

## 使用方法

1. `public`フォルダに表示したい画像を`img.jpg`という名前で配置します。
2. 必要に応じて`src/app/components/ParticleImage.tsx`のパラメータを調整します：
   - `totalSteps`: アニメーションの遷移時間
   - `size`: パーティクルのサイズ
   - アニメーションの速度（`0.05`や`0.01`の値）

## カスタマイズ

- パーティクルのサイズ変更: `PointsMaterial`の`size`パラメータ
- アニメーション速度: `positions[i] += (targetPositions[i] - positions[i]) * 速度`の係数
- 拡散範囲: `Math.random() * 範囲 - (範囲/2)`の値
