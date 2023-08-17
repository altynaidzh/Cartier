document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  container.classList.add("show");
  const API = " http://localhost:3000/CartierGoods";
  const inpName = document.querySelector("#inpName");
  // const inpDesc = document.querySelector("#inpDesc");
  const inpImg = document.querySelector("#inpImg");
  // const inpPrice = document.querySelector("#inpPrice");
  const btnAdd = document.querySelector("#btnAdd");
  const btnOpenForm = document.querySelector("#flush-collapseOne");
  const section = document.querySelector("#section");

  let searchValue = "";

  const LIMIT = 3;
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");

  let currentPage = 1;
  let countPage = 1;

  btnAdd.addEventListener("click", () => {
    if (!inpName.value.trim() || !inpImg.value.trim()) {
      return alert("Заполните все поля!");
    }

    const newItem = {
      title: inpName.value,
      img: inpImg.value,
    };
    createMyItem(newItem);
    renderGoods();
  });

  async function createMyItem(item) {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(item),
    });
    btnOpenForm.classList.toggle("show");
    inpName.value = "";
    inpImg.value = "";
  }

  async function renderGoods() {
    let res;
    if (searchValue) {
      res = await fetch(
        `${API}?title=${searchValue}&_page=${currentPage}&_limit=${LIMIT}`
      );
    } else {
      res = await fetch(`${API}?_page=${currentPage}&_limit=${LIMIT}`);
    }
    const data = await res.json();

    section.innerHTML = "";
    data.forEach(({ title, img, id }) => {
      section.innerHTML += `
    <div class="card m-4 cardBook" style="width: 20rem">
    <div class="image-container">
        <img id="${id}" src=${img} class="card-img-top detailsCard" style="height: 280px" alt="${title}"/>
        <div class="overlay">
            <div class="btn3">
                <button class="btn btn-outline-danger btnDelete w-30" id="${id}">
                    Удалить
                </button>
                <button 
                    class="btn btn-outline-warning btnEdit w-30" id="${id}"
                    data-bs-target="#exampleModal"
                    data-bs-toggle="modal"
                >
                    Изменить
                </button>
                <a href="./detail.html">
                    <button 
                        class="btn btn-outline-info btnDetails w-30" id="${id}"
                    >
                        Подробнее
                    </button>
                </a>
            </div>
        </div>
    </div>                   
            </div>
            </div>
    </div>
        `;
    });
    pageFunc();
  }

  async function pageFunc() {
    const res = await fetch(API);
    const data = await res.json();

    countPage = Math.ceil(data.length / LIMIT);
    if (currentPage === countPage) {
      nextBtn.parentElement.classList.add("disabled");
    } else {
      nextBtn.parentElement.classList.remove("disabled");
    }

    if (currentPage === 1) {
      prevBtn.parentElement.classList.add("disabled");
    } else {
      prevBtn.parentElement.classList.remove("disabled");
    }
  }

  // ----------DELETE--------------------
  document.addEventListener("click", async ({ target: { classList, id } }) => {
    const delClass = [...classList];
    if (delClass.includes("btnDelete")) {
      try {
        await fetch(`${API}/${id}`, {
          method: "DELETE",
        });
        renderGoods();
      } catch (error) {
        console.log(error);
      }
    }
  });

  renderGoods();

  //=========== EDIT =========

  const editInpName = document.querySelector("#editInpName");
  const editInpDesc = document.querySelector("#editInpDesc");
  const editInpPrice = document.querySelector("#editInpPrice");
  const editInpImage = document.querySelector("#editInpImage");
  const editBtnSave = document.querySelector("#editBtnSave");

  document.addEventListener("click", async ({ target: { classList, id } }) => {
    const classes = [...classList];
    if (classes.includes("btnEdit")) {
      const res = await fetch(`${API}/${id}`);
      const { title, img, id: productId } = await res.json();
      editInpName.value = title;
      editInpImage.value = img;
      editBtnSave.setAttribute("id", productId);
    }
  });

  editBtnSave.addEventListener("click", () => {
    const editedProduct = {
      title: editInpName.value,
      // description: editInpDesc.value,
      img: editInpImage.value,
      // price: editInpPrice.value,
    };
    editProduct(editedProduct, editBtnSave.id);
  });

  async function editProduct(product, id) {
    try {
      await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(product),
      });
      renderGoods();
    } catch (error) {
      console.log(error);
    }
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage <= 1) return;
    currentPage--;
    renderGoods();
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage >= countPage) return;
    currentPage++;
    renderGoods();
  });

  // Search
  const searchInp = document.querySelector("#searchInp");
  const searchBtn = document.querySelector("#searchBtn");

  searchInp.addEventListener("input", ({ target: { value } }) => {
    searchValue = value;
  });

  searchBtn.addEventListener("click", () => {
    renderGoods();
  });

  // Details
  document.addEventListener("click", ({ target }) => {
    if (target.classList.contains("btnDetails"))
      localStorage.setItem("detail-id", target.id);
  });
});
