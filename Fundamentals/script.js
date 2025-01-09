
class Book{
    constructor(id, name, author){
        this.id = id
        this.name = name
        this.author = author
    }
}


var books = [
    JSON.stringify( new Book(1, "Lo pepes", "Pedroloas")),
    JSON.stringify( new Book(2, "El libro del rio selva", "Lacayo")),
    JSON.stringify( new Book(3, "Como se hacia herencia", "AH")), 
    JSON.stringify( new Book(4, "OneSMan", "Buscalo"))  
]

books = books.map((item) =>  JSON.parse(item))

function getBook(id){
    return books.find((item) => item.id==id);
}

books;

var b = getBook(2);

const {id, name, ...othersd} = b // Object destructuring, variables with the same names
othersd

id
name
othersd

const [book1, book2, ...others] = books
const [book5, book6] = books

book1
book2
book5
book6

others

const newBooks = [...others, book1]
newBooks 

const updatedBook = {
    ...book1, publication: Date.now().toLocaleString(), id: 6
}

updatedBook

console.log(`El libro se llama ${updatedBook['name']}`) //String template

const method = (a, b) => a+b // Arrow functions
const res = method(1, 4)
res

const andOp = 3 && null && false // And short circuit 
andOp

const orOp = null || false || 5 || book1 // Or short circuit
orOp

const nullishOp = undefined ?? null ?? false ?? "hola?" // nullish coalesing short circuit
nullishOp

var f = updatedBook.id ==6? true: false; //ternaries 

console.log(book1.trolo?.()) // optional chaining
console.log(book1.trolo?.() ?? 'safo')

const arr = [3, 5, 2, 5, 5, 3, 4, 7]

const mappedArr = arr.map((item) => item+1)
mappedArr
arr

const filteredArr = arr.filter((item) => !(item%2))
filteredArr
arr

const reduced = arr.reduce((acc, item) => acc+2*item, 0)
reduced
arr 

const sorted = arr.sort((a, b) => (a-b)) //Compatator Callback: if negative a goes first 
sorted
arr
const clone = arr.slice()
clone
console.log(clone === arr) // == Equality with type cohersion, === Raw equality
console.log(arr === sorted)

arr[1] = 3 // Array ref is unmutable not its data 
arr

arr.push(43) // Add object
arr

arr.splice(3, 5)
arr

const book3 = new Book(3, 'Colo', 'Drogao');
const booksAfterAdd = [...books, book3]
booksAfterAdd

const booksAfterDelete = booksAfterAdd.filter((item, index, array) => index>=0 &&index<=5)
booksAfterDelete

const booksAfterUpdate = booksAfterDelete.map((item, index, arr) => index==4? {...item, name: 'Cambiao chaval'} : item )
booksAfterUpdate


fetch("https://jsonplaceholder.typicode.com/todos")
.then((res) => res.json()) //res.json is async
.then((data) => console.log("a", data))

console.log("joanas")


async function getTodos(){
    const res = await fetch("https://jsonplaceholder.typicode.com/todos")
    const data = await res.json()
    console.log(data)

    return data
}
getTodos()

console.log("Vamonos")

const aaux = false || "strin"
aaux

const baux = "lacra" && undefined
baux

const x = undefined ?? false
x 


class IntTest{
    constructor(val = 1){
        this.val = val
    }

    valueOf(){
        return this.val
    }

    toString(){
        return this.val.toString()+','
    }
}

let testInst = new IntTest(6)
console.log(testInst.toString())

const equal1 = (testInst == '6')
equal1  
const equal2 = (testInst == 6)
equal2
const equal3 = (testInst == "6,")
equal3
const equal4 = (6 == '6')
equal4

sancho = 0
sancho

aladin = "viva"
const aladino = aladin.padStart(7, "coce")
aladino

const aladinu = aladin.padEnd(7, "sort")
aladinu

const cococatepel = " " + aladino.concat(aladinu, "   ")
cococatepel

const catepel =  cococatepel.trim()
catepel