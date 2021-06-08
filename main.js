// selectors
let filterInput = document.querySelector('#filter')
let productListUL = document.querySelector('.collection')
let nameInput = document.querySelector('.product-name')
let priceInput = document.querySelector('.product-price')
let  addBtn = document.querySelector('.add-product')
let deleteBtn = document.querySelector('.delete-product')
let formElm = document.querySelector('form')
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

addDataToUI(productData)


loadAllEventListener()


function loadAllEventListener(){
  // add item
addBtn.addEventListener('click',addItem)
// delete item
productListUL.addEventListener('click',modifyOrDltItem)
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

  let inputIsInvalid = validateInput(name,price)
  if(inputIsInvalid){
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
    addDataToUI(productData)
    nameInput.value = ''
    priceInput.value = ''
  }
}
function validateInput(name,price){
  return (name === '' || price === '' || !(!isNaN(parseFloat(price)) && isFinite(price))
  )
} 

function findProductById(id){
return productData.find(productItem => productItem.id === id)
}

function modifyOrDltItem(e){
  
  let target = e.target.parentElement.parentElement;
  let id = parseInt(target.id.split('-')[1])
  // change ui element
  if(e.target.classList.contains('delete-product')){
    target.remove();

    deleteItemFromLocalStorage(id)

  } else if(e.target.classList.contains('edit-product')){
    let updateBtnElm;
    // search id from ui data source

    // get product from data source
    const foundProduct = findProductById(id)
    if(!foundProduct){
      alert('error')
    } 
    nameInput.value = foundProduct.name
    priceInput.value = foundProduct.price
    //hide add button
    addBtn.style.display = 'none'
    // create update button
    const updateBtn = `<button type='submit' class ='btn-info update-product btn-block'>Update</button>`
    formElm.insertAdjacentHTML('beforeend',updateBtn)
    updateBtnElm = document.querySelector('.update-product')
    // add event listener to update button and get the data
    updateBtnElm.addEventListener('click',e =>{
      
    e.preventDefault()
    // validate input
    const inputIsInvalid = validateInput(nameInput.value,priceInput.value)
    if(inputIsInvalid){
      alert('input is not valid')
    } else {
    //add data to data source
      productData = productData.map(productItem =>{
      if(productItem.id === id){
        return {
          ...productItem,
          name: nameInput.value,
          price: priceInput.value
        }
      } else {
        return productItem
      }
    })

    location.reload()
    
    //add updated data to ui
    addDataToUI(productData)

    // change ui element
    nameInput.value = ''
    priceInput.value = ''
    updateBtnElm.remove()
    addBtn.style.display = 'block'

    
    // add updated data to local storage
    localStorage.setItem('productItem',JSON.stringify(productData))

    }
    })
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
function addDataToUI(productList){
  if(productData.length > 0){
    productList.forEach(product => {
      // destructure object
      const {id,name,price} = product
      msg.innerHTML = ''
      let li = document.createElement('li')
      li.className = 'list-group-item collection-item'
      li.id = `product-${id}`
      li.innerHTML = `<strong>${name}</strong> - <span class="price">$${price}</span>
      <div class="float-right">
      <i class="fa fa-pencil-alt edit-product"></i>
      <i class="fa fa-trash delete-product"></i></div>`
      productListUL.appendChild(li)
    });
  } else {
    showMsg('No item to show! Please add item.' )
  }
  
}
