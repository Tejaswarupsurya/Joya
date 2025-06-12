function showSkeletonLoader(container, count = 8) {
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    container.innerHTML += `
        <div class="col placeholder-glow" aria-hidden="true">
          <div class="card listing-card">
            <div class="placeholder" style="height: 180px; background-color: #dee2e6;"></div>
            <div class="card-body">
              <p class="card-text">
                <span class="placeholder col-6"></span><br>
                <span class="placeholder col-4"></span>
              </p>
            </div>
          </div>
        </div>
      `;
  }
}
