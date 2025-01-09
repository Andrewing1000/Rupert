import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

const pizzaData = [
    {
      name: "Focaccia",
      ingredients: "Bread with italian olive oil and rosemary",
      price: 6,
      photoName: "pizzas/focaccia.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Margherita",
      ingredients: "Tomato and mozarella",
      price: 10,
      photoName: "pizzas/margherita.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Spinaci",
      ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
      price: 12,
      photoName: "pizzas/spinaci.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Funghi",
      ingredients: "Tomato, mozarella, mushrooms, and onion",
      price: 12,
      photoName: "pizzas/funghi.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Salamino",
      ingredients: "Tomato, mozarella, and pepperoni",
      price: 15,
      photoName: "pizzas/salamino.jpg",
      soldOut: true,
    },
    {
      name: "Pizza Prosciutto",
      ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
      price: 18,
      photoName: "pizzas/prosciutto.jpg",
      soldOut: false,
    },
  ];


function Pizza(props){
    console.log(props)

    return  <div className={'pizza ' + (props.soldOut? 'sold-out': '')}>
                <img src={props.photo} alt="Pizza focaccia"></img>
                <div>
                  <h3>{props.name}</h3>
                  <p>{props.ingredients}</p>
                  <p>{props.soldOut? 'SOLD OUT': 'Price:'+ props.price}</p> 
                </div>
               </div>
}


function App(){
    return  <div className="container">
                <Header/>
                <Menu/>
                <Footer/>
            </div>
}

function Header(){

  const style = {color: 'red', fontSize: '52px'}
  return <div>
          <header className='header footer'>
            <h1 style={style}>
              Fast React Pizza Co.
            </h1>  
          </header>
          
        </div>
}

function Menu(){
  const pizzas = [pizzaData];

  return  <main className="menu">
            <h2>Our menu</h2>
            {/* {pizzas.length>0 && //react does not render bool values
            
            <ul className="pizzas">
              {
                pizzaData.map((element, index) => {
                  return <Pizza
                    key={index}
                    name={element.name}
                    photo={element.photoName}
                    ingredients={element.ingredients}
                    price={parseInt(element.price)+10}/>    
                })
              }  
              </ul>
            } */}

            {/* {
            pizzas.length>0? //react does not render bool values
              [
                <p key={1}>La coca La coca La coca La coca La coca La coca
                La cocaLa cocaLa cocaLa cocavLa cocavLa cocavLa cocavLa coca
                </p>,
                <ul className="pizzas" key={2}>
                  {pizzaData.map((element, index) => {
                    return <Pizza
                      key={index}
                      name={element.name}
                      photo={element.photoName}
                      ingredients={element.ingredients}
                      price={parseInt(element.price)+10}
                      soldOut={element.soldOut}/>    
                  })}
                </ul>
              ]:
              
              <p>We're like coque</p>
            } */}



            {
            pizzas.length>0? //react does not render bool values
              (
              <> {/* same as <React.Fragment key={someshit}></React.Fragment> */}
                <p key={1}>La coca La coca La coca La coca La coca La coca
                  La cocaLa cocaLa cocaLa cocavLa cocavLa cocavLa cocavLa coca
                  </p>,
                  <ul className="pizzas" key={2}>
                    {pizzaData.map((element, index) => {
                      return <Pizza
                        key={index}
                        name={element.name}
                        photo={element.photoName}
                        ingredients={element.ingredients}
                        price={parseInt(element.price)+10}
                        soldOut={element.soldOut}/>    
                    })}
                  </ul>
              </>
              ) 
              : <p>We're like coque</p>
            }
          </main>
}

function Order({coke, ...others}){
  console.log('marcin es', others)
  console.log('la coke is', coke)
  return (
  <div className='order'>
    <p>We're open until {coke}:00. 
    Come visist us or order online</p>
    <button className='btn'>Order</button>
  </div>);
}

const Footer = () => {
  const hour =  new Date().getHours()
  console.log(hour)

  const openHour = 0;
  const closeHour = 22;
  const isOpen = hour >=openHour && hour<=closeHour
  console.log(isOpen) 
  // if(hour >=openHour && hour<=closeHour){
  //   alert("We are open")
  // }
  // else{
  //   alert("We are currently close")
  // }

  // return React.createElement('footer',
  //   {className: 'footer'},
  //   new Date().toLocaleTimeString() + " We're currently open!")}
  if(isOpen) return <Order coke={closeHour} marcin={1}/>;
  else return <p>Ye whatever</p>
  
  // return (
  //   <footer className='footer'>
  //   <div className='order'>
  //     {
  //       isOpen?
  //       <p>We're open unril {closeHour}:00. 
  //       Come visist us or order online</p>:
  //       <p>Wtf mate we're closed</p>
  //     }
  //     {
  //       false
  //     } {
  //     true
  //     }
  //     <button className='btn'>Order</button>
  //   </div>
  //   </footer>
  // );
}

const root =  ReactDOM.createRoot(document.getElementById("root"))
root.render(
      <React.StrictMode>
        <App />
        </React.StrictMode>
    )
