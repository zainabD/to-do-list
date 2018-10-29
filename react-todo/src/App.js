import React, { Component } from "react";
import "./App.css";
import fetch from 'isomorphic-fetch';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      listItems: []
    };
  }

  componentDidMount() {
	this.hydrateStateWithLocalStorage();
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage() {
    for (let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key); try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    for (let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  updateInput(key, value) {
    this.setState({ [key]: value });
  }

  addItem() {
	  const listItems = [...this.state.listItems];
	    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice(),
	  done: false,
	  desc: null
    };

        listItems.unshift(newItem);

    this.setState({
      listItems,
      newItem: ""
    });
  }

  deleteItem(id) {
    const listItems = [...this.state.listItems];
    const updatedList = listItems.filter(item => item.id !== id);
    this.setState({ listItems: updatedList });
  }
  
  onClickComplete(id) {
	const listItems = [...this.state.listItems];
	 var todo = listItems[id];
    listItems.splice(id, 1);
    todo.done = !todo.done;
    todo.done ? listItems.push(todo) : listItems.unshift(todo);
    this.setState({listItems: listItems});  
   console.log(listItems);
	
  }

  render() {
	  
    return (
      <div className="App">
<form className="form-inline">
        <div>
          <h1>TO-DO : </h1>
          <br />
          <input className="input-control" type="text" value={this.state.newItem}
            onChange={e => this.updateInput("newItem", e.target.value)}
          />
          <button className="btn btn-default" onClick={() => this.addItem()} disabled={!this.state.newItem.length} >
            Add new To-Do
          </button>
          <br /> <br />
          <ul className="list-group">
            {this.state.listItems.map((item, index) => {
				var todoClass = "undone";
				 var btnText = "Complete";
				if (item.done === true){
				 todoClass = "done";
				 btnText = "Completed";
				} 
              return (
                <li className="list-group-item " key={item.id}>
			
				 <div className={todoClass}>
              <Router>
    <Link to={{
    pathname: "/task",
	//search: "?id={item.id}",
    state: { id : item.id }
  }}>   {item.value}</Link>
  </Router>
  
				  
				  <button type="button" className="btn" disabled={item.done} onClick={ () =>this.onClickComplete(index)}>{btnText}</button>
          <button type="button" className="close" onClick={() => this.deleteItem(item.id)}>&times;</button>
				  
				  </div>
				  
                </li>
              );
            })}
          </ul>
        </div>
		</form>
      </div>
    );
  }
}

export default App;