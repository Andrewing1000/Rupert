import { useState } from "react";

const content = [
  {
    summary: "React is a library for building UIs",
    details:
      "Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "State management is like giving state a home",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "We can think of props as the component API",
    details:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

//Component function: Blueprint (Do not declare nested components)
//Component instance
//React Element
//DOM Element

//------>Component LIFECYCLE<---------
//Mount
//     First time render, NEW STATE
//Re-render
//     Happens upon:
//                   State, Props, Parent, Context
//Unmount:
//     Destroyed, removed
//     State are props are destroyed


console.log(<DifferentContent test={21}/>)
//$$typeof protects again XSS attacs that send fake react components

console.log(new DifferentContent({test: "jpjp"})) //React doesnt create a prop instance this way
//Not added to the React Virtual Tree

//-------------------------------------------------------
//State Changes -> Render Triggered -> Render Phase(NOT DOM UPDATES) ->
//(React definition of render is different) This is a virtual DOM rendering
//-> Commit Phase (This is involves the actual DOM update)
//-> Browser repaint the screen

//(Rendering is a global process, changes in components are resolved globally
//Then, only the changed elements are repainted
//Renders are Async)

//================================================
//---RENDER IS TRIGGERED---
//Initial render of the application
//State is updated
//Schedulles a render to be executed async
//they can even be batched

//e.g. State changes in components are queued for rerendering 
//() => {
// setAnswer('');
//console.log(answer)}   ---->  Still returns the past answer(staled update) as the 
//                       ----> setAnswer has not yet beed executed, just queued
// setBest(true)
//}

//The react engine queues the three state changes and updates them in a
//single render, this automatic batching was only available for rerenders

//Automatic batching is supported for BrowserAPI, Microtasks, DomEvents since
//react 18


//=================================================
//---RENDER PHASE---
//All the children of elements that
//changed its state are rerendered recursively
//this is done in the Virtual DOM now called React element tree

//Rerendering = Calling the component functions
//and replacing old components with new ones
//this generates a new Virutal DOM
//New Virtual DOM is genereated with the elements created
//in the previous step


//--Fiver: 
// -Current State
// -Props
// -Side effects
// -Used hooks
// -Queue of work

//Fivers have both react and html elements
//A tree fiver(mutates over time) holds a 1-1 correspondence with a DOM element

//Past Fiber tree is reconciled with the new virutal DOM and then
//the reconciled tree(updated) is schedulled for updating the actual DOM

//Virtual DOM rerendering is cheap
//JS DOM rerendering is expensive
//Tree reconciliation is made as to keep 
//The DOM update as efficient as possible
//updating just what is necessary and leaving
//the rest untouched

//Reconciling = Deciding what needs to actually be changed
//"React main Engine" 
//Async - Does not block JS main thread


//--->Reconciliation<---
//THe trees trasversal that reconciles changes is called
//Diffing, and compares elements based on their position
//in the tree


//Finally a list of DOM updated is generated

//=========================================
//---COMMIT PHASE---(DONE BY REACTDOM)
//React writes to JS DOM (Just the absolutely necessary)
//Synchronous --> To avoid partial updated ensuring maximun
//UI consistency
//After the process the "workInProgress" fiber tree becomes 
//the "current" tree for the next render cycle


//==========================================
//--BROWSER PAINT
//Done by the browser
//The browser determines the time, 
//upon a new available screen frame that is about
//to be displayed

//React was designed to be used independently of the 
//runtime platform, therefore platform specifc libraries 
//are requiered to manage the update of visual elements
//in every plattform.

//Officially called renderes, but they are commiters instead:
//Browser: ReactDOM
//Movile: ReactNative
//Video: Remotion
//Documents: ...

//SUMMARY
//State Changes -> React Element Generation ->
//  VirtualDOM generation -> Reconciliation + Diffing
// -> Update list generation -> DOM update



//THE DIFFING ALGORITHM
//In the tree transversal the matching algorithm uses
//key and element-type for elementwise comparison
//This makes the render process go from O(n^3) to O(n)
//Diferent types are matched with completely diferent elements

//-->Matched elemets are updated instead of being rebuilt : STATE PRESERVED
//-->An element that changes its type is completely rebuilt along
//with all its children : STATE LOST

//The elemet matching with types happens as long as there is
//as matched key prop or none at all
//Elemets with a stable key keep their Fiber to DOM correspondence across renders
//A missmatch in the key trigger the rebuilt of an element

//Elements that preserve their key are reused if they are still present in
//in the three

export default function App() {
  return (
    <div>
      <Tabbed content={content} />
    </div>
  );
}

function Tabbed({ content }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        <Tab
        num={0} 
        activeTab={activeTab} 
        onClick={setActiveTab}
        key={0} />
        <Tab 
        num={1} 
        activeTab={activeTab} 
        onClick={setActiveTab}
        key={1} />
        
        <Tab 
        num={2} 
        activeTab={activeTab} 
        onClick={setActiveTab}
        key={2} />
        <Tab 
        num={3} 
        activeTab={activeTab} 
        onClick={setActiveTab}
        key={3} />
      </div>

      {activeTab <= 2 ? (
        <TabContent key={activeTab} item={content.at(activeTab)} />
      ) : (
        <DifferentContent />
      )}

      {/* {
       TabContent({item: content.at(0)}) //Cant even manage its own state
      } */}
    </div>
  );
}

//Two types of logic in react components
//1. RENDER LOGIC: Conditional Render, States
//2. EVENT LOGIC: Event callbacks

//FUNCTIONAL PROGRAMMING RECAP
//SIDE EFFECTS: Data outisde of the scope of a function mutates
//PURE FUNCTIONS: DETERMINISTIC AND NO SIDE EFFECTS

//Controlling side effects its important
//for ensuring a smooth bug free code
//RENDER LOGIG in component functions should be PURE 
//EVENT LOGIC can implement side effects (e.g. API requests)
//side effects are encouraged in EVENT LOGIC useing useEffect hook

//((STATE CAN NOT BE MUTATED IN RENDER LOGIC --> INFINITE LOOP


function Tab({ num, activeTab, onClick }) {
  return (
    <button
      className={activeTab === num ? "tab active" : "tab"}
      onClick={() => onClick(num)}
    >
      Tab {num + 1}
    </button>
  );
}

function TabContent({ item }) {
  const [showDetails, setShowDetails] = useState(true);
  const [likes, setLikes] = useState(0);

  //console.log("RENDERING PUTO");  //Batching 

  function handleInc() {
    setLikes(likes + 1);
  }

  function handleUndo(){
    setShowDetails(true);
    console.log("Likes: ", likes) //State updated are async
    setLikes(0);
  }

  function tripleLike(){
    // setLikes(likes+1); 
    // setLikes(likes+1);
    // setLikes(likes+1);//Does not work for increasing + 1
    // state becomed stale

    setLikes((pastLikes) => pastLikes+1)
    setLikes((pastLikes) => pastLikes+1)
    setLikes((pastLikes) => pastLikes+1)
  }

  function delayedReset(){
    setTimeout(handleUndo, 2000);
  }

  return (
    <div className="tab-content">
      <h4>{item.summary}</h4>
      {showDetails && <p>{item.details}</p>}

      <div className="tab-actions">
        <button onClick={() => setShowDetails((h) => !h)}>
          {showDetails ? "Hide" : "Show"} details
        </button>

        <div className="hearts-counter">
          <span>{likes} ❤️</span>
          <button onClick={handleInc}>+</button>
          <button onClick={tripleLike}>+++</button>
        </div>
      </div>

      <div className="tab-undo">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={delayedReset}>Undo in 2s</button>
      </div>
    </div>
  );
}

function DifferentContent() {
  return (
    <div className="tab-content">
      <h4>I'm a DIFFERENT tab, so I reset state 💣💥</h4>
    </div>
  );
}


//Event Capturing: Root to node
//Event Bubblling: Node to Root
//Event handlers in the entire path are triggered
//Events can be consumed at any point of their path --> Stops Propagation

//--->EVENT DELEGATION<----
//Parent intercepts child event
//Checks its event.target == childx
//Executes callback

//REACT fiver tree perform EVENT DELEGATION to the #root of the app
//and raps event with SyntheticEvent to fix browser inconsistencies
//Synth events bubble except for scroll

//In JS the event callback function can return false,
//To prevent default behavior

//That does not work in react, you must call the preventDefault()
//of the synth event.
//to attach handlers in the capturing phase: onClickCapture


//TO STUDY

//-React Router
//-Js fetch
//-React Query
//-Context API
//-Redux
//-Tailwind
//-CSS Modules
//-React Hook Form

//All in One solutions: Opinionated
//dev involved their coding and architectural decition on
//their creation
//NEXT
//Remix
//Gatsby