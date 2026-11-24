(() => {
  const viewer = document.querySelector(".shot-viewer");
  if (!viewer || typeof viewer.showModal !== "function") return;
  const photo = viewer.querySelector("img");
  let opener;
  document.querySelectorAll("a.shot").forEach(link => {
    link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      photo.src = link.href;
      photo.alt = link.querySelector("img").alt;
      viewer.showModal();
    });
  });
  viewer.querySelector("button").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", () => opener?.focus());
})();
