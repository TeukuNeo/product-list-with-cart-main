
const startNewOrder = document.getElementById('confirm-order')
const confirmNotification = document.getElementById('confirm-notification')

let shopItem = document.getElementById('shop-item')
let basket = JSON.parse(localStorage.getItem("data")) || []
let cartDesc = document.getElementById('cart-desc')
let orderTotal = document.getElementById('order-container')
let cartQuantity = document.getElementById('cart-quantity')
let confirmItemContainer = document.getElementById('confirm-item-container')
let ordersQuantity = document.getElementById('confirm-total-detail')

startNewOrder.addEventListener('click', function (e) {
  e.preventDefault()
  confirmNotification.classList.toggle('active')
})

let generateMenu = () => {
  shopItem.innerHTML = generateShopItem.map((x) => {
    let { id, type, name, price, img } = x
    let search = basket.find((item) => item.id === id) || { item: 0 }
    return `
          <div class="shop-content" id=shop-id-${id}>
          <div class="shop-img">
            <img src="${img}" alt="waffle" id="img" style="border:${search.item > 0 ? 'solid 2px #d84727' : 'none'};">
            <div class="menu-btn-container"> 
            <a class="add-to-cart" id="add-to-cart-${id}" style="visibility:${search.item > 0 ? 'hidden' : 'visible'};">
             <img src="../assets/images/icon-add-to-cart.svg" style="width: 15px; height:15px; position: relative; top: 2px;">Add to Cart</a>  
              <div class="menu-btn" id="menu-btn" style="visibility:${search.item === 0 ? 'hidden' : 'visible'};">
                <a class="decrement-btn" id="decrement-btn-${id}">-</a>
                <span class="quantity" id="quantity-${id}">
                 ${search.item === undefined ? 0 : search.item}                
                </span>
                <a class="increment-btn" id="increment-btn-${id}">+</a>
              </div>
            </div>
          </div>
          <div class="shop-desc">
            <p>${type}</p>
            <h4>${name}</h4>
            <h5>$${price}</h5>
          </div>
        </div> 
        `
  }).join("");

  generateShopItem.forEach(item => {
    const addCartButton = document.getElementById(`add-to-cart-${item.id}`)
    const incrementButton = document.getElementById(`increment-btn-${item.id}`)
    const decrementButton = document.getElementById(`decrement-btn-${item.id}`)
    if (addCartButton) {
      addCartButton.addEventListener('click', (e) => {
        e.preventDefault()
        addToCart(item.id)
      })
    }
    if (incrementButton) {
      incrementButton.addEventListener('click', (e) => {
        e.preventDefault()
        addToCart(item.id)
      })
    }
    if (decrementButton) {
      decrementButton.addEventListener('click', (e) => {
        e.preventDefault()
        decrement(item.id)
      })
    }
  })
}
generateMenu()

let addToCart = (id) => {
  let selectedItem = { id: id }
  let search = basket.find((x) => x.id === selectedItem.id)

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1
    })
  } else {
    search.item += 1
  }
  generateMenu()
  generateBills()
  generateOrders()
  totalAmount(selectedItem.id)
  totalQuantity()
  orderQuantity()
  localStorage.setItem("data", JSON.stringify(basket))
}

let decrement = (id) => {
  let selectedItem = { id: id }
  let search = basket.find((x) => x.id === selectedItem.id)

  if (search === undefined) return
  else if (search.item === 1) {
    basket = basket.filter((x) => x.id !== id)
  }
  else {
    search.item -= 1
  }

  generateMenu()
  generateBills()
  generateOrders()
  totalAmount(selectedItem.id)
  totalQuantity()
  orderQuantity()
  localStorage.setItem("data", JSON.stringify(basket))
}

let updateToCart = (id) => {
  let search = basket.find((x) => x.id === id)
  if (search) {
    document.getElementById(`shop-id-${id}`).innerHTML = search.item;
  }
}

let generateBills = () => {
  if (basket.length !== 0) {
    cartDesc.innerHTML = basket.map((x) => {
      let { id, item } = x
      let search = generateShopItem.find((y) => y.id === id) || []
      let { name, price } = search
      return `
        <div class="cart-id" id=cart-id-${id}>
        <p class="cart-menu-title">${name}</p>
          <div class="cart-num">
            <h4 id="item-quantity">${item}x</h4>
            <h5 id="item-price">@$${price}</h5>
            <h5 id="item-total-price">$${item * search.price}</h5>
            <div class="del-items">
            <img src="../assets/images/icon-remove-item.svg" id="del-items-${id}">
            </div>
          </div>
          <hr style="border: 1px solid #f5f3f4;">
        </div>
        `
    }).join("")

    generateShopItem.forEach(item => {
      const deleteCheckout = document.getElementById(`del-items-${item.id}`)
      if (deleteCheckout) {
        deleteCheckout.addEventListener('click', (e) => {
          e.preventDefault()
          removeItem(item.id)
        })
      }
    })

  } else {
    cartDesc.innerHTML = `
       <img src="../assets/images/illustration-empty-cart.svg" alt="">
       <h5 style="color: #583101; font-weight: lighter;">Your added items will appear here!</h5>
      `
  }
}

generateBills()

let updateInCart = (id) => {
  let search = basket.find((x) => x.id === id)
  if (search) {
    document.getElementById(`cart-id-${id}`).innerHTML = search.item;
  }
}

let totalAmount = (id) => {
  if (basket.length !== 0) {
    let amount = basket.map((x) => {
      let { item, id } = x
      let search = generateShopItem.find((y) => y.id === id) || []
      return item * search.price
    }).reduce((x, y) => x + y, 0)
    orderTotal.innerHTML = `
     <div class="order-total" id="order-total">
       <p>Order Total</p>
       <h3>$ ${amount}</h3>
      </div>
      <div class="order-btn">
        <button id="btn1"><img src="../assets/images/icon-carbon-neutral.svg"> This is <span>carbon-neutral</span> delivery</button>
        <button class="btn2" id="btn2-${id}">Confirm Order</button>
      </div>  
    `
  } else {
    orderTotal.innerHTML = ""
  }

  generateShopItem.forEach((item) => {
    const confirmOrderBtn = document.getElementById(`btn2-${item.id}`)
    if (confirmOrderBtn) {
      confirmOrderBtn.addEventListener('click', function (e) {
        e.preventDefault()
        confirmNotification.classList.toggle('active')
      })
    }
  })
}

totalAmount()

let totalQuantity = () => {
  if (basket.length !== 0) {
    let quantity = basket.reduce((total, item) => total + item.item, 0)
    cartQuantity.innerHTML = `
     <p id="cart-title">Your Cart <span id="cart-title-quantity">(${quantity})</span></p>
    `
  } else {
    cartQuantity.innerHTML = `
      <p id="cart-title">Your Cart <span id="cart-title-quantity">(0)</span></p>
    `
  }
}

totalQuantity()

let removeItem = (id) => {
  let selectedItem = { id: id }
  basket = basket.filter((x) => x.id !== selectedItem.id)
  generateMenu()
  generateBills()
  totalQuantity()
  totalAmount()
  localStorage.setItem("data", JSON.stringify(basket))
}

removeItem()

let generateOrders = () => {
  if (basket.length !== 0) {
    confirmItemContainer.innerHTML = basket.map((X) => {
      let { id, item } = X
      let search = generateShopItem.find((y) => y.id === id) || []
      let { name, img, price } = search
      return `
        <img src="${img}" alt="">
          <div class="confirm-desc">
            <p>${name}</p>
            <div class="confirm-detail">
              <h4>${item}x</h4>
              <h5 class="confirm-detail-prices">@$${price}</h5>
              <h5 class="confirm-detail-quantity-price">$${item * search.price}</h5>
            </div>
          </div>
      `
    }).join("")
  } else {
    confirmItemContainer.innerHTML = ""
  }
}

generateOrders()

let orderQuantity = () => {
  if (basket.length !== 0) {
    let amount = basket.map((x) => {
      let { item, id } = x
      let search = generateShopItem.find((y) => y.id === id) || []
      return item * search.price
    }).reduce((x, y) => x + y, 0)
    ordersQuantity.innerHTML = `
     <p>Order Total</p>
      <h3>$${amount}</h3>
   `
  } else {
    ordersQuantity.innerHTML = `
       <p>Order Total</p>
        <h3>$ 0</h3>
    `
  }
}

orderQuantity()