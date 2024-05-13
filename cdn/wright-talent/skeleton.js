window.addEventListener("DOMContentLoaded", (event) => {
  const skeletonElements = document.querySelectorAll("[ms-code-skeleton]");

  skeletonElements.forEach((element) => {
    // Create a skeleton div
    const skeletonDiv = document.createElement("div");
    skeletonDiv.classList.add("skeleton-loader");

    // Add the skeleton div to the current element
    element.style.position = "relative";
    element.appendChild(skeletonDiv);
  });
});
