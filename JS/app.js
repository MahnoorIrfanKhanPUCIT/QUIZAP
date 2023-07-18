
    const nameInput=document.getElementById('user-name');
    const usernameContainer = document.getElementById('username-container');
    const startQuizBtn=document.querySelector('.start-quiz-btn');

    const UIquestion=document.getElementById('question');
    const UIoptions=document.querySelector('.quiz-options');
    const UIcheckBtn=document.getElementById('check-answer');
    const UIplayAgainBtn=document.getElementById('play-again');
    const UIresult=document.getElementById('result');
    const UIcorrectScore=document.getElementById('correct-score');
    const UItotalQuestion=document.getElementById('total-question');
          
    let totalQuestion=10;
    let correctAnswer="";
    let correctScore=0;
    let askedCount=0;
    let username="";

    function eventListeners()
    {
        if(startQuizBtn)
        {
            nameInput.addEventListener('input', function () 
            {
                if (nameInput.value.trim() !== '') 
                {
                  startQuizBtn.disabled = false;
                } 
                else 
                {
                  startQuizBtn.disabled = true;
                }
              });
          
            startQuizBtn.addEventListener('click', function (event) 
            {
                event.preventDefault();
              
                const username = nameInput.value.trim();
              
                if (username) 
                {
                  localStorage.setItem('username', username);
                  window.location.href = 'quiz.html';
                }
              });
        }
        if(UIcheckBtn)
        {
            UIcheckBtn.addEventListener('click',checkAnswer);
        }
        if(UIplayAgainBtn)
        {
            UIplayAgainBtn.addEventListener('click',restartQuiz);
        }
    }

    function showQuestion(data)
    {
        if(UIcheckBtn)
        {
            UIcheckBtn.disabled=false;
        }
        correctAnswer=data.correct_answer;
        let incorrectAnswer=data.incorrect_answers;
        let optionList=incorrectAnswer;

        optionList.splice(Math.floor(Math.random()*(incorrectAnswer.length+1)),0,correctAnswer);

        if(UIquestion)
        {
            UIquestion.innerHTML=`${data.question} <br> <span class="category" ${data.category} </span>`;
        }
        if(UIoptions)
        {
            UIoptions.innerHTML=`${optionList.map((option,index)=>`
            <li> ${index+1}.<span>${option}</span></li>`).join('')}`;
        }

        selectOption();    
    }

    function selectOption()
    {
        if(UIoptions)
        {
            UIoptions.querySelectorAll('li').forEach(function(option)
            {
                option.addEventListener('click',function()
                {
                    if(UIoptions.querySelector('.selected'))
                    {
                        const choosedOption=UIoptions.querySelector('.selected');
                        choosedOption.classList.remove('selected');
                    }
                    option.classList.add('selected');
                });
            });
        }
    }

    function checkAnswer()
    {
        if(UIcheckBtn)
        {
            UIcheckBtn.disabled=true;
        }
        if(UIoptions.querySelector('.selected'))
        {
            let selectedAnswer=UIoptions.querySelector('.selected span').textContent;
            if(selectedAnswer==HTMLDecode(correctAnswer))
            {
                correctScore++;
                UIresult.innerHTML=`<p><i class="fas fa-check"></i>Correct Answer...</p>`;
            }
            else
            {
                UIresult.innerHTML=`<p><i class="fas fa-times"></i>Incorrect Answer...</p> <small><b>Correct Answer:</b>${correctAnswer}</small> `;
            }
            checkCount();
        }
        else
        {
            if(UIresult)
            { 
                UIresult.innerHTML=`<p><i class="fas fa-question"></i>Please select an option...</p>`;
            }
            if(UIcheckBtn)
            {
                UIcheckBtn.disabled=false;
            }
            
        }
    }

    function HTMLDecode(textString)
    {
        let text=new DOMParser().parseFromString(textString,"text/html");
        return text.documentElement.textContent;
    }

    function checkCount()
    {
        askedCount++;
        setCount();

        if(askedCount==totalQuestion)
        {
            if(UIresult)
            {
                const username = localStorage.getItem('username');
                showResults(username);
            }
            if(UIplayAgainBtn)
            {
                UIplayAgainBtn.style.display='block';
            }
            if(UIcheckBtn)
            {
                UIcheckBtn.style.display='none';
            }
        }
        else
        {
            setTimeout(function()
            {
                loadQuestion();
            },1000);
        }
    }

    function setCount()
    {
        if(UItotalQuestion)
        {
            UItotalQuestion.textContent=totalQuestion;
        }
        if(UIcorrectScore)
        {
            UIcorrectScore.textContent=correctScore;
        }
    }

    function restartQuiz()
    {
        correctScore=0;
        if(UIplayAgainBtn)
        {
            UIplayAgainBtn.style.display='none';
        }
        if(UIcheckBtn)
        {
            UIcheckBtn.style.display='block';
            UIcheckBtn.style.disabled=false;    
        }
        setCount();
        loadQuestion();
    }

    async function loadQuestion()
    {
        const result=await fetch('https://opentdb.com/api.php?amount=1&category=18&difficulty=hard&type=multiple');
        const data=await result.json();
        if(UIresult)
        {
            UIresult.innerHTML="";
        }
        showQuestion(data.results[0]);
    }

    document.addEventListener('DOMContentLoaded',function()
    {
        loadQuestion();
        eventListeners();
        if(UItotalQuestion)
        {
            UItotalQuestion.textContent=totalQuestion;
        }
        if(UIcorrectScore)
        {
            UIcorrectScore.textContent=correctScore;
        }
    });


    
    function showResults(username)
    {
        const isQuizPage = location.pathname.includes('quiz.html');
        if (isQuizPage)
         {
            const overlay=document.querySelector('.container');
            overlay.classList.add('blur-effect');
            const message = `<img src="../IMAGES/512.gif">${username}! Your score is ${correctScore} out of ${totalQuestion}. `;
            const resultsContainer = document.createElement('div');
            resultsContainer.classList.add('card');
            resultsContainer.classList.add('results-container');
        
            resultsContainer.innerHTML = message;
        
            const container = document.createElement('div');
            container.classList.add('result-part');
            container.appendChild(resultsContainer);
        
            const quizContainer = document.querySelector('.quiz-container');
            quizContainer.appendChild(container);
        
            setTimeout(function ()
             {
              resultsContainer.style.display = 'none';
              overlay.classList.remove('blur-effect');
            }, 5000);
          }
    }