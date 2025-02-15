# ImgShop-v2

Visit the [ImgShop-v2](https://imgshop-v2.netlify.app/) for a live demo and more details.

## 關於作品

### 功能特色

- **無限滾動**：瀏覽大量圖片時自動載入更多內容
- **圖片搜尋**：根據關鍵字搜尋圖片
- **簡單用戶功能**：
  - 註冊 / 登入 / 自動登入
  - 圖片新增、刪除、放大檢視
- **即時訊息提示**：操作時的反饋通知
- **RWD**：適配不同裝置

### 主要技術

- **前端框架**：Nuxt 3, Vuetify
- **狀態管理**：Pinia
- **身份驗證**：JWT (josejs)
- **資料庫**：MongoDB
- **UI & 動畫**：Swiper
- **表單驗證**：Zod
- **語言**：TypeScript

### 技術挑戰與解決方案

#### 1. Netlify 的 Node.js 版本問題

- **問題**：部署時，發現 `crypto` 為 `undefined`，導致 JWK 解析失敗。
- **解決方案**：透過 `AWS_LAMBDA_JS_RUNTIME` 環境變數設定 Node.js 版本。

#### 2. Pinia store 值未定義問題

- **問題**：`useUserStore` 開發時，導致 `useImageStore` 內的 `curatedLibrary` 變為 `undefined`。
- **解決方案**：檢查並修正 store 引用方式，確保 store 正確初始化。

#### 3. Nuxt `error.vue` 無法捕獲錯誤

- **問題**：使用 `createError` 觸發錯誤時，`error.vue` 未生效，且 `clearError` 失效。
- **解決方案**：在 `pages` 下捕獲錯誤，使用 `[...slug].vue` 來確保 Nuxt 正確處理錯誤頁面。

#### 4. NuxtPage 過渡動畫問題

- **問題**：嵌套 `NuxtPage` 離開過渡動畫異常。
- **解決方案**：在組件內部額外嵌套一層 `Transition`，解決動畫異常問題。

#### 5. **圖片閃爍問題**

- **問題**：於圖片細節頁返回後，多個圖片異常閃爍。
- **解決方案**：NuxtPage設置pageKey，阻止組件刷新。

#### 6. **圖片搜尋過渡時的顯示異常**

- **問題**：動態資料可見時，進行搜尋，會發現資料刷新總早於頁面過渡。
- **解決方案**：因為更新computed值，總早於頁面過渡，所以改為ref即可。[computed值不應更改DOM](https://cn.vuejs.org/guide/essentials/computed.html#best-practices:~:text=%E4%B8%8D%E8%A6%81%E6%94%B9%E5%8F%98%E5%85%B6%E4%BB%96%E7%8A%B6%E6%80%81%E3%80%81%E5%9C%A8%20getter%20%E4%B8%AD%E5%81%9A%E5%BC%82%E6%AD%A5%E8%AF%B7%E6%B1%82%E6%88%96%E8%80%85%E6%9B%B4%E6%94%B9%20DOM%EF%BC%81)。

#### 7. **SavedPosition錯誤**

- **問題**：頁面回退時，頁面位置與原先的有誤。
- **解決方案**：因組件仍未生成而滾動失敗，只要在其Mounted或Actived內主動scrollTo即可。

#### 8. **無法登入錯誤**

- **問題**：無法登入，但頁面刷新後卻已成功登入，且無法定期輪詢刷新RefreshToken。
- **解決方案**：因Netlify的主機時間與用戶的會有數秒的誤差，造成RefreshToken驗證為否，是故調整判斷條件即可。
