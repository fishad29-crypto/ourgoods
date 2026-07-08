export const saveScrollAndNavigate = (navigate, path) => {
  sessionStorage.setItem('savedScrollY', window.scrollY);
  
  const swipePages = document.querySelectorAll('.swipe-page');
  let maxScroll = 0;
  swipePages.forEach(p => { 
    if (p.scrollTop > maxScroll) maxScroll = p.scrollTop; 
  });
  sessionStorage.setItem('savedSwipePageScrollY', maxScroll);
  
  navigate(path);
};
