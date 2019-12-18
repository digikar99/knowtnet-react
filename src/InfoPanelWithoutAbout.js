import React from 'react';
import  {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
var serverData = require('./serverData.json');

// FilterForm.updateSelectedtheme is to be updated

class SiteTitle extends React.Component{
    render() {
        const self=this;
        return (
            <div id="site-title">
              <span id="site-title-text" className="text-left">KnowTNet</span>
              <span id="site-title-spacer" className="visible-small" />
              <i id="info-panel-menu-btn"
                 className="material-icons text-right visible-small"
                 onClick={(e)=>self.props.onMenuBtnClick()}
                 >
                menu
              </i>
            </div>
        );   
    }
}

class FilterForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedTheme: "Select Theme"
        };
        this.updateSelectedTheme = this.updateSelectedTheme.bind(this);
    }
    updateSelectedTheme(e){
        this.setState({selectedTheme: e.target.value});
    }
    render(){
        return (
            <div id="filter-form">
              <select name="theme" onChange={this.updateSelectedTheme}
                      required>
                <option value="">Select Theme</option>
                {serverData["theme-list"].map(
                    theme => {return <option value={theme} key={theme}>{theme}</option>;}
                )}
              </select>
              <input type="submit" id="filter-btn"
                     className="material-icons"
                     onClick={(e)=>this.props.updateSelectedTheme(this.state.selectedTheme)}
                     value="search"
                     />
            </div>
        );
    }
}

class InfoPanelMenu extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidUpdate(oldProps){
        document.getElementById("info-panel-menu").style.width
            = this.props.isOpen ? "80vw" : "0px";
    }
    
    render() {
        return (
            <div id="info-panel-menu" >
              <a href={serverData['front-page']}>Home</a>
              <a id="toggle-known-btn" onClick={this.props.toggleKnown}>
                View {this.props.known ? "Unknown" : "Known"} Links</a>
              <Link to={serverData['about-page']}>About Us</Link>
              <div id="info-panel-spacer"></div>
              <a onClick={this.props.clearKnownLinks}>Clear Known Links</a>
              <p id="ktn" className="text-center">Knowledge Transfer Network</p>
            </div>
        );
    }
}

class InfoPanelWithoutAbout extends React.Component {
    constructor(props){
        super(props);
    }
    render(props){
        return (
            <div id={this.props.id}>
              <SiteTitle onMenuBtnClick={this.props.toggleMenu}/>
              <FilterForm updateSelectedTheme={this.props.updateSelectedTheme}/>
              <div id="username" className="text-center">Welcome to KnowTNet</div>
              <InfoPanelMenu isOpen={this.props.menuIsOpen}
                             toggleKnown={this.props.toggleKnown}
                             known={this.props.known}
                             clearKnownLinks={this.props.clearKnownLinks}/>
            </div>
        );   
    }
}

export default InfoPanelWithoutAbout;
