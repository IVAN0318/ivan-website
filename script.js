let healthConcernsChart;
let resultsSummaryChart;
let healthScoreChart;

document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript 已加載");

    // 初始化健康關注度圖表
    initHealthConcernsChart();

    // 初始化健康評估問卷
    initHealthAssessment();

    // 原有的表單提交事件監聽器
    document.getElementById('petSurvey').addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            var submitButton = document.getElementById('submitButton');
            var loadingIndicator = document.getElementById('loadingIndicator');
            
            submitButton.disabled = true;
            loadingIndicator.style.display = 'block';
            
            // 模擬表單提交過程
            setTimeout(function() {
                var formData = collectFormData();
                console.log('問卷提交:', formData);
                
                updateHealthConcernsChart(formData.healthIssues);
                showSurveyResults(formData);
                
                submitButton.disabled = false;
                loadingIndicator.style.display = 'none';
                alert('感謝您完成問卷!');
                this.reset();
            }.bind(this), 2000);
        }
    });

    // 添加計算分數按鈕的事件監聽器
    const calculateScoreButton = document.getElementById('calculateScoreButton');
    if (calculateScoreButton) {
        calculateScoreButton.addEventListener('click', calculateHealthScore);
        console.log("計算分數按鈕事件監聽器已設置");
    } else {
        console.error("找不到計算分數按鈕");
    }
});

// 初始化健康關注度圖表
function initHealthConcernsChart() {
    var ctx = document.getElementById('healthConcernsChart').getContext('2d');
    healthConcernsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['腸胃問題', '皮膚問題', '關節問題', '牙齒問題', '體重問題', '器官問題'],
            datasets: [{
                label: '健康問題關注度',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '關注度'
                    }
                }
            }
        }
    });
}

// 更新健康關注度圖表
function updateHealthConcernsChart(healthIssues) {
    var data = healthConcernsChart.data.datasets[0].data;
    healthIssues.forEach(issue => {
        switch(issue) {
            case 'digestive':
                data[0]++;
                break;
            case 'skin':
                data[1]++;
                break;
            case 'joint':
                data[2]++;
                break;
            case 'dental':
                data[3]++;
                break;
            case 'obesity':
                data[4]++;
                break;
            case 'organIssues':
                data[5]++;
                break;
        }
    });
    healthConcernsChart.update();
}

// 顯示問卷結果摘要
function showSurveyResults(formData) {
    document.getElementById('surveyResults').style.display = 'block';
    
    if (resultsSummaryChart) {
        resultsSummaryChart.destroy();
    }

    var ctx = document.getElementById('resultsSummaryChart').getContext('2d');
    resultsSummaryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['狗', '貓', '其他'],
            datasets: [{
                data: [
                    formData.petType.includes('dog') ? 1 : 0,
                    formData.petType.includes('cat') ? 1 : 0,
                    formData.petType.includes('other') ? 1 : 0
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ],
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '寵物類型分佈',
                    font: {
                        size: 18
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

function validateForm() {
    var isValid = true;

    var requiredFields = document.querySelectorAll('select[required], input[type="radio"][required]');
    
    requiredFields.forEach(function(field) {
        if (field.type === 'radio') {
            var radioGroup = document.getElementsByName(field.name);
            var checked = Array.from(radioGroup).some(radio => radio.checked);
            if (!checked) {
                isValid = false;
                field.closest('.radio-group').classList.add('error');
            } else {
                field.closest('.radio-group').classList.remove('error');
            }
        } else if (field.value.trim() === '') {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    if (!isValid) {
        alert('請填寫所有必填欄位');
    }
    
    return isValid;
}

function collectFormData() {
    var formData = {
        petType: getCheckedValues('petType'),
        petAge: document.getElementById('petAge').value,
        healthStatus: document.getElementById('healthStatus').value,
        healthIssues: getCheckedValues('healthIssues'),
        vetVisit: document.getElementById('vetVisit').value,
        healthChecks: getCheckedValues('healthChecks'),
        testInterest: document.getElementById('testInterest').value,
        foodType: getCheckedValues('foodType'),
        supplements: getCheckedValues('supplements'),
        isSenior: document.querySelector('input[name="isSenior"]:checked').value,
        seniorConcerns: getCheckedValues('seniorConcerns'),
        innovativeProducts: getCheckedValues('innovativeProducts'),
        techAcceptance: document.getElementById('techAcceptance').value,
        purchaseChannel: getCheckedValues('purchaseChannel'),
        purchaseFactors: getCheckedValues('purchaseFactors'),
        comments: document.getElementById('comments').value
    };

    return formData;
}

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked')).map(el => el.value);
}

function initHealthAssessment() {
    const questions = [
        {
            category: "飲食習慣",
            questions: [
                { question: "每天食量是否穩定？", options: ["是", "不穩定", "有時拒絕進食"], scores: [2, -1, -2] },
                { question: "每天喝水量是否充足？", options: ["是", "有時少喝", "幾乎不喝水"], scores: [2, -1, -2] },
                { question: "食慾是否良好？", options: ["是", "偶爾食慾不振", "經常食慾不振"], scores: [2, -1, -2] }
            ]
        },
        {
            category: "排泄狀況",
            questions: [
                { question: "大便形狀是否正常？（如軟硬適中、無異常顏色）", options: ["是", "偶爾軟便或便秘", "經常便秘或腹瀉"], scores: [2, -1, -2] },
                { question: "排尿是否正常？（無異常氣味或顏色）", options: ["是", "有時異常", "經常異常"], scores: [2, -1, -2] }
            ]
        },
        {
            category: "身體狀況",
            questions: [
                { question: "最近體重是否穩定？", options: ["穩定", "變化不大", "明顯變瘦或變胖"], scores: [2, -1, -2] },
                { question: "皮膚和毛發是否健康（無脫毛、紅腫、瘙癢）？", options: ["是", "偶爾有皮膚問題", "經常有皮膚問題"], scores: [2, -1, -2] },
                { question: "呼吸是否順暢？（無喘氣或異常聲音）", options: ["是", "偶爾喘氣", "經常呼吸異常"], scores: [2, -1, -2] }
            ]
        },
        {
            category: "活動與行為",
            questions: [
                { question: "精神狀態是否活躍？", options: ["活躍、好動", "有時精神不振", "經常精神低迷"], scores: [2, -1, -2] },
                { question: "是否定期活動或運動？", options: ["是", "有時不活躍", "幾乎不運動"], scores: [2, -1, -2] }
            ]
        }
    ];

    const container = document.getElementById('assessmentQuestions');
    questions.forEach((category, categoryIndex) => {
        const categoryDiv = container.querySelector(`.question-category:nth-child(${categoryIndex + 1})`);
        category.questions.forEach((q, questionIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <p>${questionIndex + 1}. ${q.question}</p>
                <div class="radio-group">
                    ${q.options.map((option, i) => `
                        <input type="radio" id="q${categoryIndex}_${questionIndex}_${i}" name="q${categoryIndex}_${questionIndex}" value="${q.scores[i]}">
                        <label for="q${categoryIndex}_${questionIndex}_${i}">${option}</label>
                    `).join('')}
                </div>
            `;
            categoryDiv.appendChild(questionDiv);
        });
    });
}

function calculateHealthScore() {
    console.log("開始計算健康評估分數");
    let totalScore = 0;
    const categories = document.querySelectorAll('#assessmentQuestions .question-category');
    let allQuestionsAnswered = true;

    categories.forEach((category, categoryIndex) => {
        const questions = category.querySelectorAll('.radio-group');
        questions.forEach((q, questionIndex) => {
            const selectedOption = q.querySelector(`input[name="q${categoryIndex}_${questionIndex}"]:checked`);
            if (selectedOption) {
                const score = parseInt(selectedOption.value);
                totalScore += score;
                console.log(`問題 ${categoryIndex}_${questionIndex}: 選擇了 ${selectedOption.value}, 得分 ${score}`);
            } else {
                console.log(`問題 ${categoryIndex}_${questionIndex}: 未選擇選項`);
                allQuestionsAnswered = false;
            }
        });
    });

    if (!allQuestionsAnswered) {
        alert("請回答所有問題以獲得準確的評估結果。");
        return;
    }

    console.log(`總分: ${totalScore}`);
    displayAssessmentResult(totalScore);
}

function displayAssessmentResult(score) {
    console.log(`顯示評估結果，分數: ${score}`);
    const resultDiv = document.getElementById('assessmentResult');
    const totalScoreElem = document.getElementById('totalScore');
    const conclusionElem = document.getElementById('assessmentConclusion');

    totalScoreElem.textContent = `總分：${score}分`;
    console.log(`設置總分文字: ${totalScoreElem.textContent}`);

    let conclusion;
    let color;
    if (score >= 16) {
        conclusion = "健康狀況良好";
        color = 'rgba(152, 251, 152, 0.8)';
    } else if (score >= 10) {
        conclusion = "健康狀況尚可，建議注意觀察";
        color = 'rgba(255, 255, 224, 0.8)';
    } else {
        conclusion = "建議就醫進一步檢查";
        color = 'rgba(255, 182, 193, 0.8)';
    }
    conclusionElem.textContent = conclusion;
    console.log(`設置結論文字: ${conclusionElem.textContent}`);

    resultDiv.style.display = 'block';
    console.log("顯示結果區域");

    // 創建或更新圖表
    if (healthScoreChart) {
        healthScoreChart.destroy();
    }

    const ctx = document.getElementById('healthScoreChart').getContext('2d');
    healthScoreChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['極佳', '良好', '一般', '需要改善', '需要關注'],
            datasets: [{
                data: [
                    Math.max(score - 16, 0),
                    Math.max(Math.min(score - 12, 4), 0),
                    Math.max(Math.min(score - 8, 4), 0),
                    Math.max(Math.min(score - 4, 4), 0),
                    Math.max(4 - score, 0)
                ],
                backgroundColor: [
                    'rgba(152, 251, 152, 0.8)',
                    'rgba(173, 216, 230, 0.8)',
                    'rgba(255, 255, 224, 0.8)',
                    'rgba(255, 218, 185, 0.8)',
                    'rgba(255, 182, 193, 0.8)'
                ],
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Arial'
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: '健康評估得分',
                    font: {
                        size: 18,
                        family: 'Arial',
                        weight: 'bold'
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    // 添加中心文字
    Chart.register({
        id: 'centerText',
        afterDraw: (chart) => {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            ctx.restore();
            const fontSize = (height / 114).toFixed(2);
            ctx.font = `bold ${fontSize}em Arial`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            const text = score + "/20";
            const textX = width / 2;
            const textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    });

    console.log("圖表已創建");
}