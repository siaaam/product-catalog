// selectors
let filterInput = document.querySelector('#filter')
let productListUL = document.querySelector('.collection')
let nameInput = document.querySelector('.product-name')
let priceInput = document.querySelector('.product-price')
let  addBtn = document.querySelector('.add-product')
let deleteBtn = document.querySelector('.delete-product')

let msg = document.querySelector('.msg')


// data / state
let productData = getDataFromLocalStorage()

function getDataFromLocalStorage(){
  let items = ''
  if(localStorage.getItem('productItem')===null){
    items  = []
  } else {
    items = JSON.parse(localStorage.getItem('productItem'))
  }
  return items
}

function saveDataToLocalStorage(item){
  let items = ''
  if(localStorage.getItem('productItem')===null){
    items  = []
    items.push(item)
    localStorage.setItem('productItem',JSON.stringify(items))
  } else {
    items = JSON.parse(localStorage.getItem('productItem'))
    items.push(item)
    localStorage.setItem('productItem',JSON.stringify(items))
  }
}

function deleteItemFromLocalStorage(id){
  const items = JSON.parse(localStorage.getItem('productItem'))
  let result = items.filter((product)=>{
    return product.id !== id
  })
  // productData = result

  localStorage.setItem('productItem',JSON.stringify(result))

  if(result.length === 0) location.reload()
}

getData(productData)


loadAllEventListener()


function loadAllEventListener(){
  // add item
addBtn.addEventListener('click',addItem)
// delete item
productListUL.addEventListener('click',deleteItem)
// filter Item
filterInput.addEventListener('keyup',filterItem)
}
function addItem(e){
  e.preventDefault()
  let name = nameInput.value
  let price = Number(priceInput.value)
  let id;
  if(productData.length === 0){
    id = 0
  } else {
    id = productData[productData.length - 1].id + 1
  }

  if(name === '' || price === '' || !(!isNaN(parseFloat(price)) && isFinite(price))){
    alert('Please fill up necessary information')
  }  else{
    let data = {
      id,
      name,
      price,
    }
    productData.push(data)

    saveDataToLocalStorage(data)

    productListUL.innerHTML = ''
    getData(productData)
    nameInput.value = ''
    priceInput.value = ''
  }
}
function deleteItem(e){
  // change ui element
  if(e.target.classList.contains('delete-product')){
    let target = e.target.parentElement;
    target.remove();

    let id = parseInt(target.id.split('-')[1])

    deleteItemFromLocalStorage(id)

  }
}
function filterItem(e){
    let text =  e.target.value.toLowerCase()
    document.querySelectorAll('.collection .collection-item').forEach(item  => {
      let productName = item.firstElementChild.textContent.toLowerCase()
  
      if(productName.indexOf(text)=== -1){
        showMsg('No item matched!')
        item.style.display = 'none'
      } else {
        item.style.display = 'block'
        msg.innerHTML = ''
      }
    })
}
function showMsg(message){
  msg.innerHTML = message
}
function getData(productList){
  if(productData.length > 0){
    productList.forEach(product => {
      // destructure object
      const {id,name,price} = product
      msg.innerHTML = ''
      let li = document.createElement('li')
      li.className = 'list-group-item collection-item'
      li.id = `product-${id}`
      li.innerHTML = `<strong>${name}</strong> - <span class="price">$${price}</span>
      <i class="fa fa-trash float-right delete-product"></i>`
      productListUL.appendChild(li)
    });
  } else {
    showMsg('No item to show! Please add item.' )
  }
  
}
