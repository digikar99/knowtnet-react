import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import InfoPanel from './InfoPanel';
import BrowseLinkBoxes from './BrowseLinkBoxes';
import logo from './logo.svg';
import ReactHtmlParser from 'react-html-parser';
import './App.css';

var $ = require('jquery');
var serverData = require('./serverData.json');
const numLinks = serverData["num-links"];
const knownLinksVarName= "known";
const themeLinkIdListMap = serverData["theme-link-id-list-map"];
var effortCount = 2; // try twice to make scrollable

class Page extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            links: [],
            linkId: 1,
            waitingForAjax:null,
            fetchableLinks:[],
            knownLinks: (
                localStorage[knownLinksVarName]
                    ? JSON.parse("["+localStorage[knownLinksVarName] + "]")
                    : this.iota(1+numLinks).map((id) => 0)
            ),
            known:false,
            selectedTheme:"Select Theme",
            menuIsOpen:false
        };
        console.log(this.state);
        this.getLinkFromServer = this.getLinkFromServer.bind(this);
        this.removeLink = this.removeLink.bind(this);
        this.markAsKnownAndRemoveLink = this.markAsKnownAndRemoveLink.bind(this);
        this.updateSelectedTheme = this.updateSelectedTheme.bind(this);
        this.isKnown = this.isKnown.bind(this);
        this.toggleKnown = this.toggleKnown.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.clearKnownLinks = this.clearKnownLinks.bind(this);
    }
    iota(maxInt){
        var list = [];
        for(var i=0; i<maxInt; i++) list.push(i);
        return list;
    }
    componentDidMount(){
        window.addEventListener(
            'scroll',
            () => {
                if ((window.innerHeight + window.scrollY)
                    >= document.body.offsetHeight
                    && !this.state.waitingForAjax){
                    this.getLinkFromServer();
                }
            }
        );
        this.state.fetchableLinks = this.iota(1+numLinks).filter(
            id => !this.state.knownLinks[id]
        );
        window.addEventListener(
            'load',
            () => {
                console.log('loaded');
                this.getLinkFromServer();
            }
        );
        console.log(this.state);
    }
    getLinkIdToGet(){
        const id = this.state.fetchableLinks[1];
        this.setState({fetchableLinks: [0].concat(this.state.fetchableLinks.slice(2))});
        return id;
    }
    getLinkFromServer(){
        const elt = this; // success function requires this | pun intended :)
        const id = this.getLinkIdToGet();
        if (!id) return;
        console.log("id", id);
        this.state.waitingForAjax = true;
        $.get({
            url: "data/" + id,
            async: null,
            success: function(link){
                console.log(link);
                link = JSON.parse(link);
                elt.setState({links: [...elt.state.links, link]});
            }
        });
        this.state.waitingForAjax = null;
    }
    removeLink(link){
        this.setState({links: this.state.links.filter((l) => !l==link)});
    }
    markAsKnownAndRemoveLink(link){
        console.log(link);
        const newKnownLinks = this.iota(1+numLinks).map((id) => {
            if (link.props.id == id) return 1;
            else return this.state.knownLinks[id];
        });
        localStorage[knownLinksVarName] = newKnownLinks;
        const newState = {
            knownLinks: newKnownLinks,
            links: this.state.links.filter((l) => !(l["id"] === link.props.id))
        };
        this.setState(newState);
    }
    isKnown(id){return this.state.knownLinks[id];}
    updateSelectedTheme(theme, known = this.state.known){
        var themeLinkIds = themeLinkIdListMap[theme];
        var newState = {};
        console.log('known', known);
        if (themeLinkIds){
            newState = {
                links: [],
                fetchableLinks: [0].concat(themeLinkIds.filter((id)=> {
                    return (this.isKnown(id) && known)
                        || (!this.isKnown(id) && !known);
                })),
                selectedTheme: theme
            };
        }else{
            newState = {
                links: [],
                fetchableLinks: [0].concat(this.iota(1+numLinks).slice(1).filter((id)=> {
                    return (this.isKnown(id) && known)
                        || (!this.isKnown(id) && !known);
                })),
                selectedTheme: theme
            };
        }
        this.setState(newState);
    }
    componentDidUpdate(){
        if (effortCount && this.state.links.length < 2){
            console.log(this.state);
            this.getLinkFromServer();
            effortCount--;
        }else{
            effortCount = 2;
        }
    }
    
    toggleKnown(){
        this.setState({known:!this.state.known, menuIsOpen:!this.state.menuIsOpen});
        this.updateSelectedTheme(this.state.selectedTheme, !this.state.known);
    }
    toggleMenu(){
        this.setState({menuIsOpen: !this.state.menuIsOpen});
    }
    clearKnownLinks(){
        const noKnownLinks = this.iota(1+numLinks).map((id) => 0)
        localStorage[knownLinksVarName] = noKnownLinks;
        this.setState({knownLinks: noKnownLinks});
        window.location.reload();
    }
    render(props){
        console.log(this.props);
        console.log("about", this.props.aboutPage);
        return (
            <div>
              <InfoPanel
                aboutPage={this.props.aboutPage}
                id="responsive-info-panel"
                updateSelectedTheme={this.updateSelectedTheme}
                toggleKnown={this.toggleKnown}
                known={this.state.known}
                toggleMenu={this.toggleMenu}
                menuIsOpen={this.state.menuIsOpen}
                clearKnownLinks={this.clearKnownLinks}
                />
              {this.props.aboutPage
                  ? ReactHtmlParser(this.props.aboutPage)
                  : (
                      <span>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <BrowseLinkBoxes
                          id="responsive-browse-link-boxes"
                          links={this.state.links}
                          remove={this.removeLink}
                          markAsKnownAndRemoveLink={this.markAsKnownAndRemoveLink}
                          />
                      </span>
                  )
              }
            </div>
        );
    }
}

class App extends React.Component{
    render(){
        return (
            <Router>
              <Switch>
                <Route path={"/"+serverData["about-page"]}>
                  <Page aboutPage={serverData["about"]}/>
                </Route>
                <Route path="/">
                  <Page aboutPage={null}/>
                </Route>
              </Switch>
            </Router>
        );
    }
    
}

export default App;
