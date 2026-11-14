/**
 * LẨU NƯỚNG VN - BRANCHES FEATURE LOGIC
 * Bộ lọc chi nhánh theo thành phố và Xem bản đồ vị trí trực quan
 */

document.addEventListener('DOMContentLoaded', () => {
  const cityFilterBtns = document.querySelectorAll('.city-filter-btn');
  const branchCards = document.querySelectorAll('.branch-card');
  const mapModal = document.getElementById('mapModalOverlay');
  const mapCloseBtn = document.getElementById('mapModalCloseBtn');
  const mapTitle = document.getElementById('mapModalTitle');
  const mapAddress = document.getElementById('mapModalAddress');
  const mapIframe = document.getElementById('mapModalIframe');

  // 1. City Filter
  cityFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cityFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCity = btn.getAttribute('data-city');
      branchCards.forEach(card => {
        const cardCity = card.getAttribute('data-city');
        if (selectedCity === 'all' || cardCity === selectedCity) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 2. View Map Modal
  document.querySelectorAll('.btn-view-map').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const address = btn.getAttribute('data-address');

      if (mapTitle) mapTitle.textContent = title;
      if (mapAddress) mapAddress.textContent = address;
      if (mapIframe) {
        const encoded = encodeURIComponent(address);
        mapIframe.src = `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }

      if (mapModal) {
        mapModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeMapModal() {
    if (mapModal) {
      mapModal.classList.remove('active');
      document.body.style.overflow = '';
      if (mapIframe) mapIframe.src = '';
    }
  }

  if (mapCloseBtn) {
    mapCloseBtn.addEventListener('click', closeMapModal);
  }

  if (mapModal) {
    mapModal.addEventListener('click', (e) => {
      if (e.target === mapModal) {
        closeMapModal();
      }
    });
  }
});
