const parallax = function (event) {
  let speed = layer.getAttribute('data-speed');
  let items;

  layer.style.transform = `translateX(${
    (event.clientX * speed) / 1300
  }px) translateY(${(event.clientY * speed) / 1000}px)`;

  title.style.transform = `translateX(${
    (event.clientX * 40) / 700
  }px) translateY(${(event.clientY * 40) / 400}px)`;

  decor2.style.transform = `translateX(${
    (event.clientX * 40) / 500
  }px) translateY(${(event.clientY * 30) / 600}px)`;

  items = [...title2].forEach(el => {
    el.style.transform = `translateX(${
      (event.clientX * 40) / 600
    }px) translateY(${(event.clientY * 30) / 500}px)`;
  });
  decor1.style.transform = `translateX(${
    (event.clientX * 40) / 350
  }px) translateY(${(event.clientY * 40) / 700}px)`;
};

const layer = document.querySelector('.layer__bg');
const title = document.querySelector('.parallax-logo');
const title2 = document.querySelectorAll('.parallax-item');
const decor1 = document.querySelector('.decoration-first');
const decor2 = document.querySelector('.decoration-second');

let elementScrollTop1 = document.documentElement.scrollTop;

function parallaxWidthCheck() {
  if (window.innerWidth >= 1024) {
    document.addEventListener('mousemove', parallax);
    return;
  }
  if (window.innerWidth < 1024) {
    document.removeEventListener('mousemove', parallax);
    return;
  }
}

function parallaxCheck() {
  let elementHeight = document.body.children[1].clientHeight;
  let documentScroll = document.documentElement.scrollTop;
  if (documentScroll > elementHeight) {
    document.removeEventListener('mousemove', parallax);
    return;
  }
  if (
    documentScroll > 330 &&
    documentScroll < 600 &&
    window.innerWidth >= 1024
  ) {
    document.addEventListener('mousemove', parallax);
    return;
  }
}
