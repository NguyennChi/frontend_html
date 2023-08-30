// Render Menu
fetch(`${BASE_URL}categories_news`)
  .then((response) => response.json())
  .then((res) => {
    const categories = res.data;
    let contentHTML = '';
    let contentOtherHTML = '';

    categories.forEach((category, index) => {
      if (index < 2) {
        contentHTML += `
        <li class="nav-item">
          <a class="nav-link" href="category.html?id=${category.id}">${category.name}</a>
        </li>`;
      } else {
        contentOtherHTML += `<a class="dropdown-item" href="category.html?id=${category.id}">${category.name}</a>`;
      }
    });

    if (contentOtherHTML !== '') {
      contentOtherHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          Danh mục <span class="fa fa-angle-down"></span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          ${contentOtherHTML}
        </div>
      </li>`;
    }

    const favoriteMenu = `<li class="nav-item"><a class="nav-link" href="favorite.html">Yêu thích <span class="text-danger" id="total-liked">(0)</span></a></li>`;
    const account   = /*html */ ` <li class="nav-item dropdown">
                              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                                Tài Khoản <span class="fa fa-angle-down"></span>
                              </a>
                              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Đăng nhập</a>
                                <a class="dropdown-item" href="#">Đăng kí</a>
                              </div>
                            </li>`
    document.getElementById('main-menu').innerHTML = contentHTML + contentOtherHTML + favoriteMenu + account;
    document.getElementById('total-liked').innerText = `(${ARTICLES_LIKED.length})`;
  });
