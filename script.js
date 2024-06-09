// custom attribute ka use karke element ko fetch kiya h  // aur custom atrribute ke liye bracket ([]) lgane padenge
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");    
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+={[}]|:;"<,>.?/';

// sabse pehle kuch values initalize kardi starting m
// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();  // handleSlider() ye password ki length ko UI pe show karvata h
// set strength circle color to grey
setIndicator("#ccc");



// yaha se function impliment start karenge 
// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // or kuch bhi karna chaiye? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow homework
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;   // floor se floating value int m convert ho jayegi
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123)); // ab jo integer val aayegi usko char m convert kar dega string.fromcharcode
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("0f0");
    } else if (
        (hasLower || hasUpper) && 
        (hasNum || hasSym) && 
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


// await tabhi kaam karta h jab async ho
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);  // ye promise return karta h toh ye ya toh ye resolve hoga ya reject hoga
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}



function shufflePassword(array) {
    // Fisher Yates  Method
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach ( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// event listener lga rahe h ab jisme pehla h slider ko move karne pe value change go aur vo ui pe dikhe

// ab yaha jab saare checkbox ke liye eventlistener lga rahe h toh pehle uske liye ek fn bna liye handle wala taaki checked boxes ka track rakh sakhe
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected 
    if(checkCount <= 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password
    console.log("Starting the Journey");

    // remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     // password += generateRandomInteger();
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsary addition done");

    // remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done");

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    // show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    // calculate strength
    calcStrength();

});

// agar code fate toh console.log ka use karte h jese uper kiya h