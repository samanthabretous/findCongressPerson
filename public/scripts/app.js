// require react and react dom 
// var React = require('react');
// var ReactDOM = require('react-dom');


// create variable that holds out main class
var App = React.createClass({
  render() {
    return (
      <div>
        <Form />
      </div>
    )
  }
});

var CongressPerson = React.createClass({
  render(){
    return(
      <div>
        <h1>Name of Congress Person: {this.props.name}</h1>
        <p>Office Address: {this.props.office}</p>
        <p>Phone Number: {this.props.phone}</p>
      </div>
    );
  }
});

var Form = React.createClass({
  getInitialState(){
    return({address:"3216 Dustin Trl", city: "Hurst", state:"TX", data:[], fetch:false})
  },

  handleChange(event) {
    var name = event.currentTarget.name
    this.setState({[name]: event.target.value})

    //this.setState({address: event.target.value, city: event.target.value, state: event.target.value})
  },
  findCongress(congressPerson) {
    this.setState({data:congressPerson, fetch:true})
  },
  findLatAndLong(info) {
    var latitude = info.results["0"].geometry.location.lat;
    var longitude = info.results["0"].geometry.location.lng;
    console.log(latitude, longitude)

    //second ajax call
    $.ajax({
      url: 'https://congress.api.sunlightfoundation.com/legislators/locate?latitude=' + latitude + "&longitude=" + longitude +
      '&apikey=dbcc5517d9b24a60a8bf3252cedd6916',
      success: this.findCongress
    })
  },
  callback(event){
    event.preventDefault();
    
    var address = this.state.address
    var city = this.state.city
    var state = this.state.state

    //first ajax call
    $.ajax({
      url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+",+" + city+",+" + state+ "&key=AIzaSyB1HbwMhagEquNEwhOZQ-YmFuq6flxIemo",
      success: this.findLatAndLong
    })
  },
  render() {
    var congress = []
    console.log(this.state.data)
    if (this.state.fetch) {
      this.state.data.results.forEach(function(person, i){
        var name = person.first_name
        var office = person.office
        var phone = person.phone
        congress.push(<CongressPerson key={i} name={name} office={office} phone={phone}/>)
      })
    }
    return(
      <div>
        <form onSubmit={this.callback}>
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={this.state.address}
            onChange={this.handleChange}
          ></input>
          <input
            type="text"
            placeholder="City"
            name="city"
            value={this.state.city}
            onChange={this.handleChange}
          ></input>
          <input
            type="text"
            placeholder="State"
            name="state"
            value={this.state.state}
            onChange={this.handleChange}
          ></input>
          <button>Submit</button>
        </form>
        {congress}
      </div>
    )
  }
})

// render to the dom
ReactDOM.render(<App />, document.getElementById('root'))


