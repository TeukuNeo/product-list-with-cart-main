
const cartBtn = document.getElementById('add-to-cart')
const menuBtn = document.querySelector('.menu-btn')
const img = document.querySelector('img')

let shopItem = document.getElementById('shop-item')
let basket = JSON.parse(localStorage.getItem("data")) || []
let cartDesc = document.getElementById('cart-desc')
let orderTotal = document.getElementById('order-total')
let cartQuantity = document.getElementById('cart-quantity')

let generateMenu = () => {
  shopItem.innerHTML = generateShopItem.map((x) => {
    let { id, type, name, price, img } = x
    let search = basket.find((item) => item.id === id) || { item: 0 }
    return `
          <div class="shop-content" id=shop-id-${id}>
          <div class="shop-img">
            <img src="${img}" alt="waffle" id="img" style="border:${search.item > 0 ? 'solid 2px #d84727' : 'none'};">
            <div class="menu-btn-container"> 
            <a class="add-to-cart" id="add-to-cart-${id}" style="visibility:${search.item > 0 ? 'hidden' : 'visible'};">Add to Cart</a>  
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
  totalAmount()
  totalQuantity()
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
  totalAmount()
  totalQuantity()
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
            <h4 id="item-quantity">${item}</h4>
            <h5 id="item-price">@${price}</h5>
            <h5 id="item-total-price">$${item * search.price}</h5>
            <a href="" id="del-items-${id}" style="text-decoration: none;">✖️</a>
          </div>
          <hr>
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
       <h2>cart is Empty!</h2>
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

let totalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket.map((x) => {
      let { item, id } = x
      let search = generateShopItem.find((y) => y.id === id) || []
      return item * search.price
    }).reduce((x, y) => x + y, 0)
    orderTotal.innerHTML = `
       <p>Order Total</p>
       <h3>$ ${amount}</h3>
    `
  } else {
    orderTotal.innerHTML = ""
  }
}

totalAmount()

let totalQuantity = () => {
  if (basket.length !== 0) {
    let quantity = basket.reduce((total, item) => total + item.item, 0)
    cartQuantity.innerHTML = `
     <p id="cart-title">Your Cart <span id="cart-title-quantity">(${quantity})</span></p>
    `
  }else {
    cartQuantity.innerHTML = `
      <p id="cart-title">Your Cart <span id="cart-title-quantity">(0)</span></p>
    `
  }
}

totalQuantity()

let removeItem = (id) => {
  let selectedItem = {id: id}
  basket = basket.filter((x) => x.id !== selectedItem.id)
  generateBills()
  totalQuantity()
  totalAmount()
  localStorage.setItem("data", JSON.stringify(basket))
}

removeItem()