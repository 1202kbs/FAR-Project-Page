// Videos start paused; the viewer plays them with the controls.
// If a playing video scrolls out of view it is paused, and resumed when it comes back into view.
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll("video");
  if (!("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) {
        if (v._autoPaused) { v._autoPaused = false; v.play().catch(() => {}); }
      } else if (!v.paused) {
        v._autoPaused = true;
        v.pause();
      }
    });
  }, { threshold: 0.2 });
  videos.forEach((v) => io.observe(v));
});
