# GCP 證照測驗練習工具

這是一個簡易的前端測驗工具，旨在幫助使用者練習 Google Cloud Platform (GCP) 的證照考題。

本專案的初始題目來自於 [chouhsiang/examtopics-actual-questions](https://github.com/chouhsiang/examtopics-actual-questions/tree/main) 這個開源專案，透過爬蟲將其整理成 CSV 格式，並利用這個網頁工具提供互動式的測驗體驗。

## 主要功能

*   **互動式測驗介面**：提供清晰的題目、選項，以及答案檢查功能。
*   **預載題庫**：內建 GCP Professional Cloud Architect 和 Professional Cloud DevOps Engineer 考題。
*   **支援自訂題庫**：使用者可以上傳自己的 CSV 檔案，載入客製化的題目。
*   **題目參考連結**：每道題目都附有原始的 examtopics.com 連結，方便查閱討論。

## 如何使用

1.  在您的電腦上，直接用瀏覽器開啟 `quiz.html` 檔案。
2.  從下拉選單中選擇您想練習的題庫。
3.  選擇檔案後就會自動載入題目。
4.  開始作答！

## 如何使用自訂題庫

本工具最大的特色之一就是可以載入您自己的題庫。

1.  **準備 CSV 檔案**：您需要先將您的題目整理成一個 CSV 檔案。
2.  **遵循欄位格式**：為了讓程式能正確讀取，您的 CSV 檔案 **必須** 包含以下欄位名稱 (大小寫需相符)：
    *   `Question Text`：題目的完整文字。
    *   `Options`：所有的選項放在同一個儲存格中，並用 ` ||| ` (前後有空格) 分隔。
    *   `Correct Answer Letter`：正確答案的英文字母 (例如：`A`, `B`, `C`)。
    *   `Link`：題目的參考來源連結。
    *   `Question Number`：題目的編號。

    **`Options` 欄位範例：**
    ```
    A. Instrument all applications with Stackdriver Profiler. ||| B. Instrument all applications with Stackdriver Trace and review inter-service HTTP requests. ||| C. Use Stackdriver Debugger to review the execution of logic within each application to instrument all applications. ||| D. Modify the Node.js application to log HTTP request and response times to dependent applications. Use Stackdriver Logging to find dependent applications that are performing poorly.
    ```

3.  **上傳檔案**：在 `quiz.html` 頁面上，點擊 `選擇檔案` 按鈕，然後選取您剛剛準備好的 CSV 檔案。
4.  **開始測驗**：檔案載入成功後，測驗介面將會顯示您的題目。

## 資料來源

本專案使用的 GCP 考題資料，原始出處為 [examtopics.com](https://www.examtopics.com/)，並由 [chouhsiang/examtopics-actual-questions](https://github.com/chouhsiang/examtopics-actual-questions/tree/main) 專案進行了初步的抓取與整理。在此特別感謝原作者的貢獻。
