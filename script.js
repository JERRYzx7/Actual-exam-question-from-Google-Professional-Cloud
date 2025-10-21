// JavaScript 核心邏輯

let quizData = [];
let questionNumberMap = {}; // 映射題號到 quizData 的索引 {q_number: index}
let currentQuestionIndex = 0;
let userSelections = {}; // 存儲用戶選擇: {index: selected_letter}
let answeredQuestions = {}; // 存儲已檢查答案的狀態: {index: true/false}


// --- 資料處理與初始化 ---

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        document.getElementById('file-status').textContent = '未選擇檔案。';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            parseCSV(e.target.result);
            document.getElementById('file-status').textContent = `✓ 檔案 ${file.name} 載入成功！共 ${quizData.length} 題。`;
            document.getElementById('quiz-container').style.display = 'block';
            document.getElementById('total-questions').textContent = quizData.length;
            
            if (quizData.length > 0) {
                renderQuestion(0);
            }
        } catch (error) {
            console.error("CSV 解析錯誤:", error);
            document.getElementById('file-status').textContent = `錯誤：CSV 檔案格式不正確。請確認欄位是否正確。`;
        }
    };
    reader.readAsText(file, 'utf-8');
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 2) return;

    // 尋找正確的欄位索引 (使用爬蟲最終輸出 CSV 的欄位名稱)
    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const numberIndex = header.indexOf('Question Number');
    const textIndex = header.indexOf('Question Text');
    const optionsIndex = header.indexOf('Options');
    const answerIndex = header.indexOf('Correct Answer Letter');
    const linkIndex = header.indexOf('Link'); 

    if (textIndex === -1 || optionsIndex === -1 || answerIndex === -1 || numberIndex === -1 || linkIndex === -1) {
        throw new Error("CSV 缺少必要的欄位 (Question Text, Options, Correct Answer Letter, Question Number, Link)");
    }

    quizData = [];
    questionNumberMap = {};
    for (let i = 1; i < lines.length; i++) {
        // 使用正則表達式解析 CSV 行，更好地處理內部逗號
        const columns = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        
        if (columns.length > Math.max(textIndex, optionsIndex, answerIndex, linkIndex)) {
            // 清理引號
            const cleanColumn = (col) => col ? col.trim().replace(/^"|"$/g, '').trim() : '';

            const questionNumber = cleanColumn(columns[numberIndex]);
            const questionText = cleanColumn(columns[textIndex]);
            const optionsText = cleanColumn(columns[optionsIndex]);
            const correctAnswerLetter = cleanColumn(columns[answerIndex]);
            const linkUrl = cleanColumn(columns[linkIndex]); 

            // 分割選項
            const options = optionsText.split(' ||| ').map(opt => cleanColumn(opt));

            if (questionText && options.length > 0 && correctAnswerLetter && questionNumber && linkUrl) {
                const qNumKey = String(questionNumber);

                quizData.push({
                    number: qNumKey,
                    text: questionText,
                    options: options,
                    answer: correctAnswerLetter,
                    link: linkUrl 
                });
                // 建立題號到索引的映射
                questionNumberMap[qNumKey] = quizData.length - 1; 
            }
        }
    }
}

// --- 介面渲染邏輯 ---

function renderQuestion(index) {
    if (index < 0 || index >= quizData.length) return;

    currentQuestionIndex = index;
    const q = quizData[index];
    
    // 更新題目、題號和連結
    const qLinkElement = document.getElementById('current-q-link');
    qLinkElement.textContent = q.number;
    qLinkElement.href = q.link; // 設定連結

    document.getElementById('question-text').textContent = q.text;
    document.getElementById('jump-input').value = q.number; // 更新跳轉框中的題號

    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = ''; // 清空舊選項

    // 渲染選項
    q.options.forEach(optionText => {
        const li = document.createElement('li');
        li.className = 'option-item';
        
        const match = optionText.match(/^([A-Z])\./);
        const letter = match ? match[1] : '';
        
        li.setAttribute('data-letter', letter);
        li.textContent = optionText;

        const isAnswered = answeredQuestions[index];
        const selectedLetter = userSelections[index];
        
        if (isAnswered) {
            // 如果已檢查答案，顯示結果
            if (letter === q.answer) {
                li.classList.add('correct'); 
            } else if (letter === selectedLetter && letter !== q.answer) {
                li.classList.add('wrong'); 
            }
        } else if (letter === selectedLetter) {
            // 如果未檢查答案，顯示選擇狀態
            li.classList.add('selected');
        }

        if (!isAnswered) {
            li.onclick = handleOptionClick;
        }
        
        optionsList.appendChild(li);
    });

    // 更新按鈕狀態
    updateControls(index);
}

function updateControls(index) {
    const checkBtn = document.getElementById('check-answer-btn');
    const isAnswered = answeredQuestions[index];
    const hasSelection = userSelections[index];

    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').disabled = index === quizData.length - 1;

    if (isAnswered) {
        checkBtn.textContent = '已檢查';
        checkBtn.disabled = true;
    } else {
        checkBtn.textContent = '檢查答案';
        checkBtn.disabled = !hasSelection;
    }
}

// --- 互動邏輯 ---

function handleOptionClick(event) {
    const currentItem = event.currentTarget;
    const index = currentQuestionIndex;
    
    document.querySelectorAll('#options-list .option-item').forEach(item => {
        item.classList.remove('selected');
    });

    currentItem.classList.add('selected');
    
    userSelections[index] = currentItem.getAttribute('data-letter');
    
    document.getElementById('check-answer-btn').disabled = false;
}

function checkAnswer() {
    const index = currentQuestionIndex;
    const q = quizData[index];
    const selectedLetter = userSelections[index];
    
    if (!selectedLetter) return;

    answeredQuestions[index] = true;

    document.querySelectorAll('#options-list .option-item').forEach(item => {
        const letter = item.getAttribute('data-letter');
        item.onclick = null; // 禁用點擊
        
        if (letter === q.answer) {
            item.classList.add('correct'); // 正確答案 (綠色)
        } else if (letter === selectedLetter) {
            item.classList.add('wrong'); // 錯誤的選擇 (紅色)
            item.classList.remove('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    updateControls(index);
}

function navigate(direction) {
    const newIndex = currentQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < quizData.length) {
        renderQuestion(newIndex);
    }
}

function jumpToQuestionNumber() {
    const qNum = document.getElementById('jump-input').value.trim();
    const index = questionNumberMap[qNum];

    if (index !== undefined) {
        renderQuestion(index);
    } else {
        alert(`找不到題號 ${qNum}。請輸入有效的題號（例如：CSV 中的數字）。`);
    }
}