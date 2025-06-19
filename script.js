
function toggleMobileMenu(){const n=document.getElementById("mobile-nav"),e=document.getElementById("menu-icon");n.classList.toggle("active"),e.className=n.classList.contains("active")?"fas fa-times":"fas fa-bars"}
function closeMobileMenu(){document.getElementById("mobile-nav").classList.remove("active"),document.getElementById("menu-icon").className="fas fa-bars"}
document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll('a[href^="#"]').forEach(function(e){e.addEventListener("click",function(t){t.preventDefault();const n=document.querySelector(this.getAttribute("href"));if(n){const t=document.querySelector(".header").offsetHeight,i=n.offsetTop;window.scrollTo({top:i-t,behavior:"smooth"})}})}),animateOnScroll()});
function animateOnScroll(){document.querySelectorAll(".fade-in").forEach(function(e){e.getBoundingClientRect().top<window.innerHeight-150&&e.classList.add("visible")})}
window.addEventListener("scroll",animateOnScroll),window.addEventListener("load",animateOnScroll);
