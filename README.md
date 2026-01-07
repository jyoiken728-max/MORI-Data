# 大手町の森 - 環境センサー可視化システム

## プロジェクト概要

東京建物株式会社の大手町タワー1階にある「大手町の森」の環境センサーデータを可視化するWebアプリケーションです。
8種類の環境データ（温度、湿度、雨量、風速、最高風速、風向、照度、紫外線量）を美しく、わかりやすく表示し、
テナントの方々にこの空間の快適さと価値を実感していただくことを目的としています。

## 機能

- **リアルタイム環境データ表示**: 8種類のセンサーデータをリアルタイムで表示
- **インタラクティブなグラフ**: Chart.jsを使用した時系列データの可視化
- **環境快適度評価**: 複数の環境因子を総合的に評価した快適度スコアを表示
- **自然/森テーマのデザイン**: 「森」のコンセプトに合わせた自然な配色とデザイン
- **レスポンシブ対応**: デスクトップ、タブレット、モバイルデバイスに対応
- **自動データ更新**: 30秒ごとに自動でデータを更新（設定可能）

## センサーデータタイプ

1. **温度** (Temperature) - 単位：°C (測定範囲: -20～60°C, 精度: ±1°C, 分解能: 0.1°C)
2. **湿度** (Humidity) - 単位：% (測定範囲: 0～100%RH, 精度: ±3%RH)
3. **雨量** (Rainfall) - 単位：mm (分解能: 0.3mm)
4. **風速** (Wind Speed) - 単位：m/s (測定範囲: 0～50m/s, 分解能: 0.14m/s)
5. **最高風速** (Maximum Wind Speed) - 単位：m/s (分解能: 1.2m/s)
6. **風向** (Wind Direction) - 単位：度/方向（コンパス表示）(測定範囲: 0～360度)
7. **照度** (Illuminance) - 単位：lux (測定範囲: 0～200,000 lux, 分解能: 1 lux)
8. **紫外線量** (UV/Ultraviolet) - 単位：μW/cm² (測定範囲: 0～30,000 μW/cm², 分解能: 1 μW/cm²)

## ファイル構成

```
大手町の森_環境センサー可視化/
├── index.html                 # メインページ（HTML、CSS、JavaScriptを含む）
├── data/
│   └── mock-sensor-data.js    # シミュレーションデータ生成器
├── api-config.example.js      # API設定のサンプルファイル
└── README.md                  # このファイル
```

## 使用方法

### 基本的な使い方（シミュレーションデータを使用）

1. `index.html` をWebブラウザで開く
2. シミュレーションデータが自動的に表示されます
3. データは30秒ごとに自動更新されます

### リアルAPIを接続する場合

1. `api-config.example.js` を `api-config.js` にコピー
2. `api-config.js` に実際のAPIエンドポイントURLと認証情報を入力
3. `index.html` の `<head>` セクションで `api-config.js` を読み込む：

```html
<script src="api-config.js"></script>
```

4. `api-config.js` の `useMockData: false` に設定

## 技術スタック

- **HTML5 + CSS3 + JavaScript (Vanilla)**: ビルドツール不要のシンプルな構成
- **Chart.js 4.4.0** (CDN): グラフ表示ライブラリ
- **Noto Sans JP**: Google Fonts からの日本語フォント

## カスタマイズ

### データ更新間隔の変更

`index.html` の以下の部分を変更：

```javascript
// 设置自动刷新（每30秒）
state.updateInterval = setInterval(loadSensorData, 30000); // 30000 = 30秒
```

### 色やスタイルの変更

CSS変数を変更することで、テーマカラーを簡単に変更できます：

```css
:root {
  --forest-green: #2d5016;      /* 森の緑 */
  --nature-green: #4a7c3f;      /* 自然の緑 */
  --light-green: #7fb069;       /* ライトグリーン */
  /* ... */
}
```

### センサー設定の変更

`index.html` の `sensorConfig` オブジェクトを編集することで、各センサーの表示や評価基準を変更できます。

## API仕様

### データ形式

APIから返されるデータは以下の形式である必要があります：

```json
{
  "timestamp": "2025-01-XX HH:MM:SS",
  "temperature": 22.5,
  "humidity": 65,
  "rainfall": 0,
  "windSpeed": 1.2,
  "maxWindSpeed": 2.5,
  "windDirection": 180,
  "solarRadiation": 450,
  "uvIndex": 3
}
```

### APIエンドポイント

- **現在のデータ取得**: `GET /sensors/current`
- **履歴データ取得**: `GET /sensors/historical?start=YYYY-MM-DDTHH:mm:ss&end=YYYY-MM-DDTHH:mm:ss`

詳細は `api-config.example.js` を参照してください。

## ブラウザ対応

以下のモダンブラウザで動作確認済み：

- Google Chrome (最新版)
- Microsoft Edge (最新版)
- Mozilla Firefox (最新版)
- Safari (最新版)

## 開発者向け情報

### シミュレーションデータ

`data/mock-sensor-data.js` には、リアルなセンサーデータの特性を模倣したシミュレーション関数が含まれています。
以下の機能があります：

- 連続性のあるデータ生成（急激な変化を避ける）
- 時間帯に応じたデータ変化（照度、紫外線は昼高く、夜低い）
- 合理的なデータ範囲の制限

### データの追加

新しいセンサーデータタイプを追加する場合：

1. `sensorConfig` オブジェクトに新しいエントリを追加
2. `mock-sensor-data.js` の `baseValues` と `variationRanges` に設定を追加
3. 必要に応じてカード表示をカスタマイズ

## ライセンス

このプロジェクトは東京建物株式会社向けに開発されました。

## お問い合わせ

技術的な質問や問題がございましたら、開発チームまでお問い合わせください。

## 更新履歴

- **v1.0.0** (2025-01-XX)
  - 初回リリース
  - 8種類のセンサーデータの可視化
  - インタラクティブなグラフ機能
  - 環境快適度評価機能
  - シミュレーションデータ生成器

