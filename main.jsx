import ReactDom from "react-dom"
import React from "react";
import "./style.scss";

function ReactApp() {
  return (
    <div>
      Hello from ReactApp
    </div>
  )
}
const root =document.getElementById('test-react');
ReactDom.render(<ReactApp />,root)

function pokemonCardText(p) {
  let cardType = p.type
  .map((t) => {
    return `<div class="type ${t}">${t}</div>`;
  })
  .join("");

return `
     <div class="thumbnail-bg">
      <img src="${p.ThumbnailImage}" alt="${p.name}" />
    </div>
    <div class="p-4">
      <div class"text-sm flex justify-between">
        <div class="text-sm text-slate-400">#${p.number}</div>
        <div class="actions flex flex-nowrap gap-2">
          <button class="bnt-edit" data-id="${p.id}">Edit</button>
          <div>|</div>
          <button class="bnt-delete" data-id="${p.id}">Delete</button>
        </div>  
      </div>
      <div class="text-bold text-lg  text-slate-800" id="pokemon-name my-4">${p.name}</div>
      <div class="group-type">${cardType}</div>
    </div>
  `;
}

const pokemonListElement = document.getElementById("pokemon-list");

const bntCreatepokemon = document.getElementById("btn-create");
if (bntCreatepokemon != null) {
  bntCreatepokemon.addEventListener ("click",function () {
    const newPokemonForm = document.getElementById("new-pokemon-form");
    const name = newPokemonForm.querySelector('#name').value;
    const type = newPokemonForm.querySelector('#type').value;
    const data = {
      name: name,
      type: [type],
    }; 
    // make POST request to json server to create a new pokemon
    const createPokemonUrl =  `http://localhost:3000/pokemons`;
    fetch(createPokemonUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      pokemonListElement.insertAdjacentHTML(
        "afterbegin", 
        pokemonCardText(data));     
    });
  });
}

function assignEditCard(card) {
  let bntEdit =card.querySelector(".bnt-edit");
  if (bntEdit != null) {
    bntEdit.addEventListener("click", (e) => 
    console.log("Will edit pokemon id:"+ e.target.dataset.id)
    );
  }
}
function assignDeleteCard(card) {
  let bntDelete =card.querySelector(".bnt-delete");
  if (bntDelete != null) {
    bntDelete.addEventListener("click", (e) => {
    
      let targetId =  e.target.dataset.id
      console.log("Will delete pokemon id:"+ e.target.dataset.id)
      // send DELETE request for pokemon id to JSON server
      let deleteUrl =PokemonListUrl + '/' + targetId;
      if (confirm("Are you sure ?")){
        fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Comtent-Type": "application/json",
          },
        })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          // remoce the delete card
          card.remove();
        });
      }   
    });
  }
}

const PokemonListUrl = `http://localhost:3000/pokemons`;

function PokemonCard(props) {
  const p = props.p;
  let cardType = p.type
  .map((t) => {
    return `<div class="type ${t}">${t}</div>`;
  })
  .join("");

  return (
    <div className="card">
      <div className="thumbnail-bg">
        <img src={p.ThumbnailImage} alt={p.name} />
      </div>
      <div className="p-4">
        <div className="text-sm flex justify-between">
          <div className="text-sm text-slate-400">#{p.id}</div>
          <div className="actions flex flex-nowrap gap-2">
            <button className="bnt-edit" data-id={p.id}>Edit</button>
            <div>|</div>
            <button className="bnt-delete" data-id={p.id}>Delete</button>
          </div>  
        </div>
        <div className="text-bold text-lg  text-slate-800" id="pokemon-name my-4">{p.name}</div>
        <div className="group-type">
          { p.type.map((t) => (
            <div className={`type ${t}`}>{t}</div>
          ))}
        </div> 
      </div>
    </div>
  )
}

function PokemonList(props) {
  return (
    <div className="pokemon-list">
      {props.data.map((p) => {
        return (<PokemonCard p={p} />)
      })}
    </div>
  );
}

if (pokemonListElement != null) {
  // fetch list of pokemon from API  
  fetch(PokemonListUrl, {
    headers: {
      "Content-type": "applicatin/json",
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      ReactDom.render(<PokemonList data={data} />,pokemonListElement);
      // let pokemons = data;            
      // pokemons.map((p) => {    
      //   let cardDiv = document.createElement("div");
      //   cardDiv.setAttribute("class","card");
      //   cardDiv.innerHTML = pokemonCardText(p);
      
      //   assignEditCard(cardDiv);
      //   assignDeleteCard(cardDiv);
           
      //   pokemonListElement.insertAdjacentElement("afterbegin",cardDiv);
      // });
    });
}
