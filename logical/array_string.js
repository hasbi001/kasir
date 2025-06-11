let firstArray = [];
let secondArray = [];

firstArray.push("x", "x", "x"); 

while (firstArray.length > 0 && secondArray.length < 5) {
    secondArray.push(firstArray.pop());
}

secondArray.push("x"); 

console.log(secondArray);
