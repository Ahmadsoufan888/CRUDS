let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let mood = 'create';
let tmp;
// get total
function getTotal(){
    if(price.value != ''){
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value ;
        total.innerHTML = result;
        total.style.background = "#040";
    }else{ 
        total.innerHTML = '';
        total.style.background = "#a00d02";
    }
}
// create product / count // save localStorage
let dataPro;
if(localStorage.product != null){
    dataPro = JSON.parse(localStorage.product)
}else
{
    dataPro = [];
}
submit.onclick = function(){
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    };
    let errorMessage = '';
    if (title.value === ''){
        errorMessage += 'Please enter a title.\n';
    }
    if (price.value === '') {
        errorMessage += 'Please enter a price.\n';
    }
    if (category.value === '') {
        errorMessage += 'Please select a category.\n';
    }
    if (newPro.count > 100) {
        errorMessage += 'Count cannot exceed 100.\n';
    }
    if (newPro.count < 0) {
        errorMessage += 'Count cannot be negative.\n';
    }
    if (parseFloat(newPro.discount) > parseFloat(newPro.price)){
       errorMessage += 'discount cannot be greater than the price.\n';
    }
    if (errorMessage === '') {
        let originalData = dataPro[tmp];
        if (mood === 'create') {
            if (JSON.stringify(originalData) === JSON.stringify(newPro)){
                alert('No changes made. Product not created.');
            } else {
                if (newPro.count > 1) {
                    for (let i = 0; i < newPro.count; i++) {
                        dataPro.push(newPro);
                    }
                } else {
                    dataPro.push(newPro);
                }
                clearData();
                localStorage.setItem('product', JSON.stringify(dataPro));
                showData();
                if (newPro.count > 1){
                    alert('Products created successfully!');
                }else{
                    alert('Product created successfully!');
                }
            }
        } else {
            if (JSON.stringify(originalData) === JSON.stringify(newPro)) {
                dataPro[tmp] = newPro;
                mood = 'create';
                submit.innerHTML = 'Create';
                count.style.display = 'block';
                clearData();
                localStorage.setItem('product', JSON.stringify(dataPro));
                showData()
                total.style.background = "#a00d02";
                alert('No changes made to the product.');
            } else {
                dataPro[tmp] = newPro;
                mood = 'create';
                submit.innerHTML = 'Create';
                count.style.display = 'block';
                clearData();
                localStorage.setItem('product', JSON.stringify(dataPro));
                showData();
                total.style.background = "#a00d02";
                alert('Product updated successfully!');
            }
        }
    } else {
        alert(errorMessage);
    }
}
//clear inputs
function clearData(){
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}
//read
function showData()
{
    getTotal()
    let table = '';
    for(let i = 0; i < dataPro.length;i++){
        table += `
        <tr>
            <td>${i+1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('tbody').innerHTML = table;
    let btnDelete = document.getElementById('deleteAll');
    if(dataPro.length > 0){
        btnDelete.innerHTML = `
        <button onclick="deleteAll()">Delete ALL (${dataPro.length})</button>
        `
    }else{
        btnDelete.innerHTML = '';
    }
}
showData()
// delete
function deleteData(i)
{
    if(confirm('Are you Sure to delete this product ?') == true)
        {
            dataPro.splice(i,1);
            localStorage.product = JSON.stringify(dataPro);
            showData()
    }
}
function deleteAll()
{
    if(confirm('Are you Sure to delete all Products ?') == true)
        {
            localStorage.clear()
            dataPro.splice(0)
            showData()
        }
}
// update
function updateData(i){
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal()
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;   
    scroll({
        top:0,
        behavior: 'smooth',
    })
}
// search
let searchMood = 'title';
function getSearchMood(id)
{
    let search = document.getElementById('search');
    if(id == 'searchTitle'){
        searchMood = 'title';
       
    }else{
        searchMood = 'category';
    }
    search.placeholder = 'Search By '+ searchMood;
    search.focus()
    search.value = '';
    showData()
}
function searchData(value)
{
    let table = '';
    for(let i = 0; i < dataPro.length;i++){
        if(searchMood == 'title')
    {
            if(dataPro[i].title.includes(value.toLowerCase())){
                table += `
                <tr>
                    <td>${i+1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button onclick="updateData(${i})" id="update">Update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                </tr>
                `;
            }
        } 
        else{
            if(dataPro[i].category.includes(value.toLowerCase())){
                table += `
                <tr>
                    <td>${i+1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button onclick="updateData(${i})" id="update">Update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                </tr>
                `;
            }
        }
    }
    document.getElementById('tbody').innerHTML = table;
}
//sortByPrice
function sortByPrice(order){
    if(order === 'asc'){
        dataPro.sort((a, b) => a.price - b.price);

    }else if (order === 'desc'){
        dataPro.sort((a, b) => b.price -a.price);
    }
    showData()
}