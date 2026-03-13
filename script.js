let lang="th"

const text={

th:{
title:"☢ Nuclear Myth Spy",
start:"เริ่มเกม",
settings:"ตั้งค่า",
help:"วิธีเล่น",
vote:"Myth จริงหรือไม่",
panic:"ระดับ Panic"
},

en:{
title:"☢ Nuclear Myth Spy",
start:"Start Game",
settings:"Settings",
help:"How to Play",
vote:"Is the myth true?",
panic:"Panic Level"
},

cn:{
title:"☢ Nuclear Myth Spy",
start:"开始游戏",
settings:"设置",
help:"玩法",
vote:"神话是真的吗",
panic:"恐慌等级"
}

}


function applyLang(){

title.innerText=text[lang].title
startBtn.innerText=text[lang].start
settingsBtn.innerText=text[lang].settings
helpBtn.innerText=text[lang].help
voteTitle.innerText=text[lang].vote

}

function changeLang(l){

lang=l
applyLang()

}

applyLang()



let players=[]
let alive=[]
let spy
let playerIndex=0

let panic=0
let quickVotes=2

let spySkillUsed=false
let sabotageNextRound=false



const myths=[

{
myth:"Bananas contain radiation",
facts:[
"Bananas contain potassium-40",
"Human body also has potassium-40",
"Radiation dose from banana is tiny",
"Many foods contain natural radiation",
"Banana equivalent dose exists"
],
truth:true,
explain:"Bananas contain natural potassium-40."
},

{
myth:"Nuclear reactors explode like bombs",
facts:[
"Reactor fuel is 3-5% enriched",
"Nuclear bombs need ~90%",
"Reactors use controlled fission",
"Chernobyl was not a nuclear bomb",
"Reactor physics is different"
],
truth:false,
explain:"Reactors cannot explode like nuclear bombs."
}

]



let currentMyth



function hideAll(){

document.querySelectorAll("body > div").forEach(d=>d.classList.add("hidden"))

}


function goHome(){

hideAll()
document.getElementById("home").classList.remove("hidden")

}


function openSettings(){

hideAll()
document.getElementById("settings").classList.remove("hidden")

}


function openHelp(){

hideAll()
document.getElementById("help").classList.remove("hidden")

}


function openPlayerSelect(){

hideAll()

document.getElementById("players").classList.remove("hidden")

}



function setPlayers(n){

players=[]
alive=[]

for(let i=0;i<n;i++){

players.push({role:"Expert",hint:""})
alive.push(i)

}

spy=Math.floor(Math.random()*n)

players[spy].role="Spy"

startRound()

}



function startRound(){

currentMyth=myths[Math.floor(Math.random()*myths.length)]

let factPool=[...currentMyth.facts]

players.forEach(p=>{

if(p.role==="Expert"){
p.hint=factPool.pop()||""
}else{
p.hint=""
}

})

playerIndex=0

showRole()

}



function showRole(){

hideAll()

document.getElementById("role").classList.remove("hidden")

let p=alive[playerIndex]

playerTitle.innerText="Player "+(p+1)

roleText.innerText=players[p].role

hintText.innerText=players[p].hint

spySkillBtn.style.display=(p===spy && !spySkillUsed)?"block":"none"

}



function nextPlayer(){

playerIndex++

if(playerIndex>=alive.length){

startDiscussion()
return

}

showRole()

}



let timerInterval



function startDiscussion(){

hideAll()

document.getElementById("discussion").classList.remove("hidden")

mythText.innerText=currentMyth.myth

updateQuickVoteUI()

let t=60

timer.innerText=t

timerInterval=setInterval(()=>{

t--
timer.innerText=t

if(t<=0){

clearInterval(timerInterval)

startMythVote()

}

},1000)

}



function updateQuickVoteUI(){

quickVoteInfo.innerText="Quick vote left: "+quickVotes

}



function quickVote(){

if(quickVotes<=0)return

quickVotes--

updateQuickVoteUI()

clearInterval(timerInterval)

startMythVote()

}



let mythVotes=[]



function startMythVote(){

hideAll()

document.getElementById("voteMyth").classList.remove("hidden")

mythVotes=[]

voteCount.innerText="0/"+alive.length

}



function voteMyth(v){

mythVotes.push(v)

voteCount.innerText=mythVotes.length+"/"+alive.length

if(mythVotes.length===alive.length){

finishMythVote()

}

}



function finishMythVote(){

let trueVotes=mythVotes.filter(v=>v).length

let majority=trueVotes>alive.length/2

if(majority!==currentMyth.truth){

panic++

}

showPanic()

}



function showPanic(){

hideAll()

document.getElementById("panic").classList.remove("hidden")

panicText.innerText=text[lang].panic+" "+panic

if(panic>=2){

document.body.classList.add("panicMode")

}

if(panic>=3){

resultText.innerText="☢ SPY WINS (PANIC)"

showResult()

}

}



function showFact(){

hideAll()

document.getElementById("fact").classList.remove("hidden")

factText.innerText=currentMyth.explain

}



function spySkill(){

if(spySkillUsed)return

spySkillUsed=true

alert("Spy sabotage ready next round")

}



let spyVotes=[]
let spyVoteTurn=0



function startSpyVote(){

spyVotes=[]
spyVoteTurn=0

showSpyVote()

}



function showSpyVote(){

hideAll()

document.getElementById("spyVote").classList.remove("hidden")

spyVoteTitle.innerText="Player "+(spyVoteTurn+1)

spyButtons.innerHTML=""

alive.forEach(i=>{

let b=document.createElement("button")

b.innerText="Player "+(i+1)

b.onclick=()=>castVote(i)

spyButtons.appendChild(b)

})

}



function castVote(i){

spyVotes.push(i)

spyVoteTurn++

if(spyVoteTurn>=alive.length){

finishSpyVote()

}else{

showSpyVote()

}

}



function finishSpyVote(){

let count={}

spyVotes.forEach(v=>count[v]=(count[v]||0)+1)

let suspect=parseInt(Object.keys(count).reduce((a,b)=>count[a]>count[b]?a:b))

if(suspect===spy){

resultText.innerText="Experts Win"

showResult()

}else{

alive=alive.filter(p=>p!==suspect)

showElimination(suspect)

}

}



function showElimination(p){

hideAll()

document.getElementById("eliminate").classList.remove("hidden")

eliminateText.innerText="Player "+(p+1)+" eliminated!"

}



function continueGame(){

if(alive.length===2){

resultText.innerText="Spy Wins"

showResult()

}else{

startRound()

}

}



function showResult(){

hideAll()

document.getElementById("result").classList.remove("hidden")

}



function resetGame(){

panic=0
quickVotes=2
spySkillUsed=false

document.body.classList.remove("panicMode")

goHome()

}



goHome()