
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.dropdown');
  
    links.forEach(link => {
      link.addEventListener('click', function() {
        // Remove active class from all links
        links.forEach(l => l.classList.remove('active'));
        // Add active class to the clicked link
        this.classList.add('active');
      });
    });
  });