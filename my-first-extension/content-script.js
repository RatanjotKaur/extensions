console.log("Hello to my First Extension!")
document.body.style.backgroundColor = "#eeeeef"

let image = document.querySelector("img[alt='Google']")
console.log(image)

if(image){
    console.log("Reached here......")
    let imagePath = chrome.runtime.getURL("images/logo.png")
    image.src = imagePath
    image.srcset = imagePath
}