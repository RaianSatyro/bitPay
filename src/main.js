import "./css/index.css"
import IMask from "imask";



const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");




function setCardType(type) {
    const colors = {
        "ripple": ["#001456", "#11aae2"],
        "bitcoin": ["#Df6f29", "#C69347"],
        "dogecoin":["#000","#FFF300"],
        "ethereum":["#454975", "#8992b1"],
        "default": ["black", "gray"]
    }

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);
    ccLogo.setAttribute("src", `cc-${type}.svg`)

}
globalThis.setCardType = setCardType


//Codigo de segurança do cartão
const cvc = document.querySelector('#security-code')
const cvcPattern = {
    mask: "000"
}
const cvcMasked = IMask(cvc, cvcPattern)

cvcMasked.on("accept", () => {
    updateSecurityCode(cvcMasked.value)
})
function updateSecurityCode(code) {
    const ccSecurity = document.querySelector('.cc-security .value')
    ccSecurity.innerText = code.length === 0 ? '123' : code
}


//Data de validade
const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear()+4).slice(2)
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);
expirationDateMasked.on('accept', () =>{
    expirationUpdate(expirationDateMasked.value)
})

function expirationUpdate(date){
    const ccExpiration = document.querySelector('.cc-expiration .value');
    ccExpiration.innerText = date.length === 0 ? '12/26' : date;
}


//numero do cartão
const cardNumber = document.querySelector('#card-number');
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardType: "bitcoin",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^1[0-5]\d{0,14}/,
            cardType: "dogecoin",
        },    
        {
            mask: "0000 0000 0000 0000",
            regex: /(^9[5-9]\d{0,1}|^8[1-4]\d{0,1})\d{0,14}/,
            cardType: "ripple",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: "ethereum"
        },
        {
            mask: "0000 0000 0000 0000",
            cardType: "default"
        },
    ],
    dispatch: function(appended, dynamicMasked){
        const number = (dynamicMasked.value + appended).replace(/\D/g,'');

        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex);
        
        })
        console.log(foundMask);
        return foundMask;
    },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType(cardType)
    cardNumberUpdate(cardNumberMasked.value)
})
function cardNumberUpdate(number){
    const ccNumber = document.querySelector(".cc-number");
    ccNumber.innerText = number.length === 0 ? "1234 5678 9101 1121" : number
}


//Trabalhando com botão de submit
const addButton = document.querySelector('#add-card');
addButton.addEventListener('click', () => {alert('Cartão adicionado')});

document.querySelector('form').addEventListener('submit', (event) => {event.preventDefault()});


//capturando nome do usuario
const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', () =>{
    const ccHolder = document.querySelector('.cc-holder .value');

    ccHolder.innerText = cardHolder.value.length === 0 ? "SEU NOME AQUI" : cardHolder.value
})