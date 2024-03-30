let c = document.querySelector('.c');
let s = document.querySelector('.slider');
let l = document.querySelector('.list');
let p = document.getElementById('prev');
let n = document.getElementById('next');
let i = document.querySelectorAll('.list .item');
let co = i.length;
let active = 1;
let leftTransform = 0;
let width_item = i[active].offsetWidth;

n.onclick = () => {
    active = active >= co - 1 ? co - 1 : active + 1;
    runCarousel();
}
p.onclick = () => {
    active = active <= 0 ? active : active - 1;
    runCarousel();
}
function runCarousel() {
    p.style.display = (active == 0) ? 'none' : 'block';
    n.style.display = (active == co - 1) ? 'none' : 'block';


    let old_active = document.querySelector('.item.active');
    if(old_active) old_active.classList.remove('active');
    i[active].classList.add('active');

     leftTransform = width_item * (active - 1) * -1;
    l.style.transform = `translateX(${leftTransform}px)`;
}
runCarousel();


// Set Text on a Circle
let textCircle = c.innerText.split('');
c.innerText = '';
textCircle.forEach((value, key) => {
    let newSpan =  document.createElement("span");
    newSpan.innerText = value;
    let rotateThisSpan = (360 / textCircle.length) * (key + 1);
    newSpan.style.setProperty('--rotate', rotateThisSpan + 'deg');
    c.appendChild(newSpan); 
});

